import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GameProgressParams {
  game_name: string;
  game_category: 'mindset' | 'communication' | 'problem_solving' | 'conflict_resolution' | 'emotional_intelligence';
  score: number;
  success: boolean;
}

export const useGameProgress = () => {
  const [loading, setLoading] = useState(false);

  const completeGame = async (params: GameProgressParams) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('complete-game', {
        body: params
      });

      if (error) throw error;

      if (data.needsPayment) {
        toast.error(data.error);
        return { success: false, needsPayment: true };
      }

      toast.success(`Spiel abgeschlossen! +${data.points_earned} Punkte`);
      return { 
        success: true, 
        pointsEarned: data.points_earned,
        totalPoints: data.total_points,
        canPlayAgain: data.canPlayAgain
      };
    } catch (error) {
      console.error('Error completing game:', error);
      toast.error('Fehler beim Speichern des Spielfortschritts');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const purchaseAdditionalPlays = async (game_category: 'mindset' | 'communication' | 'problem_solving' | 'conflict_resolution' | 'emotional_intelligence', additional_plays = 1) => {
    try {
      const { data, error } = await supabase.functions.invoke('purchase-additional-plays', {
        body: { game_category, additional_plays }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error('Error purchasing additional plays:', error);
      toast.error('Fehler beim Kaufprozess');
      return { success: false };
    }
  };

  const checkPlayLimit = async (game_category: 'mindset' | 'communication' | 'problem_solving' | 'conflict_resolution' | 'emotional_intelligence') => {
    try {
      const { data: playLimit } = await supabase
        .from('daily_play_limits')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('game_category', game_category)
        .eq('play_date', new Date().toISOString().split('T')[0])
        .single();

      const freePlayUsed = playLimit?.free_plays_used || 0;
      const paidPlays = playLimit?.paid_plays || 0;

      return {
        canPlay: freePlayUsed < 1 || paidPlays > freePlayUsed - 1,
        freePlayUsed,
        paidPlays
      };
    } catch (error) {
      console.error('Error checking play limit:', error);
      return { canPlay: true, freePlayUsed: 0, paidPlays: 0 };
    }
  };

  return {
    completeGame,
    purchaseAdditionalPlays,
    checkPlayLimit,
    loading
  };
};