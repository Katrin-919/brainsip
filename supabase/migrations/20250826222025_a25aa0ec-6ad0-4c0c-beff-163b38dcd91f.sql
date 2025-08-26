-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  total_points INTEGER DEFAULT 0,
  status TEXT DEFAULT 'bronze', -- bronze, silver, gold
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create game categories enum
CREATE TYPE public.game_category AS ENUM (
  'mindset',
  'communication', 
  'problem_solving',
  'conflict_resolution',
  'emotional_intelligence'
);

-- Create game sessions table to track completed games
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_name TEXT NOT NULL,
  game_category game_category NOT NULL,
  points_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  score INTEGER,
  success BOOLEAN DEFAULT false
);

-- Enable RLS on game sessions
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Create daily play limits table
CREATE TABLE public.daily_play_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_category game_category NOT NULL,
  play_date DATE DEFAULT CURRENT_DATE,
  free_plays_used INTEGER DEFAULT 0,
  paid_plays INTEGER DEFAULT 0,
  UNIQUE(user_id, game_category, play_date)
);

-- Enable RLS on daily play limits
ALTER TABLE public.daily_play_limits ENABLE ROW LEVEL SECURITY;

-- Create payments table for additional plays
CREATE TABLE public.game_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  game_category game_category NOT NULL,
  additional_plays INTEGER DEFAULT 1,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.game_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game sessions
CREATE POLICY "Users can view their own game sessions" ON public.game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game sessions" ON public.game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily play limits
CREATE POLICY "Users can view their own play limits" ON public.daily_play_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own play limits" ON public.daily_play_limits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own play limits" ON public.daily_play_limits
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.game_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON public.game_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user status based on points
CREATE OR REPLACE FUNCTION public.update_user_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    status = CASE
      WHEN NEW.total_points >= 1000 THEN 'gold'
      WHEN NEW.total_points >= 500 THEN 'silver'
      ELSE 'bronze'
    END,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger to update status when points change
CREATE TRIGGER on_profile_points_updated
  AFTER UPDATE OF total_points ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_user_status();

-- Function to check daily play limits
CREATE OR REPLACE FUNCTION public.can_play_game(
  p_user_id UUID,
  p_game_category game_category
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  current_plays INTEGER := 0;
  total_paid_plays INTEGER := 0;
BEGIN
  -- Get current free plays used today
  SELECT COALESCE(free_plays_used, 0) INTO current_plays
  FROM public.daily_play_limits
  WHERE user_id = p_user_id 
    AND game_category = p_game_category 
    AND play_date = CURRENT_DATE;
  
  -- Get total paid plays for today
  SELECT COALESCE(SUM(paid_plays), 0) INTO total_paid_plays
  FROM public.daily_play_limits
  WHERE user_id = p_user_id 
    AND game_category = p_game_category 
    AND play_date = CURRENT_DATE;
  
  -- Allow if under free limit or has paid plays available
  RETURN (current_plays < 1) OR (total_paid_plays > current_plays - 1);
END;
$$;