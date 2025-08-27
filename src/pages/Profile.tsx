import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Medal, Clock, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FerdyHeader } from '@/components/FerdyHeader';

interface Profile {
  display_name: string;
  total_points: number;
  status: string;
}

interface GameSession {
  id: string;
  game_name: string;
  game_category: string;
  points_earned: number;
  score: number;
  success: boolean;
  completed_at: string;
}

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile();
      fetchGameSessions();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Fehler beim Laden des Profils');
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchGameSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setGameSessions(data || []);
    } catch (error) {
      console.error('Error fetching game sessions:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'gold':
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 'silver':
        return <Medal className="h-6 w-6 text-gray-400" />;
      default:
        return <Star className="h-6 w-6 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
      default:
        return 'bg-gradient-to-r from-amber-500 to-amber-700';
    }
  };

  const getProgressToNextLevel = () => {
    if (!profile) return { progress: 0, nextLevel: 'Silber', pointsNeeded: 500 };
    
    const points = profile.total_points;
    if (points < 500) {
      return { progress: (points / 500) * 100, nextLevel: 'Silber', pointsNeeded: 500 - points };
    } else if (points < 1000) {
      return { progress: ((points - 500) / 500) * 100, nextLevel: 'Gold', pointsNeeded: 1000 - points };
    } else {
      return { progress: 100, nextLevel: 'Gold erreicht!', pointsNeeded: 0 };
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      'mindset': 'Mindset',
      'communication': 'Kommunikation',
      'problem_solving': 'Problemlösung',
      'conflict_resolution': 'Konfliktlösung',
      'emotional_intelligence': 'Emotionale Intelligenz'
    };
    return names[category] || category;
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <FerdyHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Lädt...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <FerdyHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Profil nicht gefunden</div>
        </div>
      </div>
    );
  }

  const progressInfo = getProgressToNextLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <FerdyHeader />
      
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Mein Profil</h1>
          <p className="text-muted-foreground">Verfolge deinen Lernfortschritt und deine Erfolge</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Status Card */}
          <Card className="relative overflow-hidden">
            <div className={`absolute inset-0 ${getStatusColor(profile.status)} opacity-10`}></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(profile.status)}
                <span className="capitalize">{profile.status} Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {profile.total_points}
                </div>
                <div className="text-sm text-muted-foreground">Gesamt Punkte</div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Fortschritt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Nächstes Level: {progressInfo.nextLevel}</span>
                  <span>{progressInfo.pointsNeeded} Punkte fehlen</span>
                </div>
                <Progress value={progressInfo.progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Letzte Spiele
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gameSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Noch keine Spiele gespielt. Starte dein erstes Abenteuer!
              </div>
            ) : (
              <div className="space-y-4">
                {gameSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{session.game_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getCategoryDisplayName(session.game_category)} • {' '}
                        {new Date(session.completed_at).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={session.success ? "default" : "secondary"}>
                        {session.success ? 'Erfolgreich' : 'Versucht'}
                      </Badge>
                      <div className="text-right">
                        <div className="font-medium">+{session.points_earned} Punkte</div>
                        <div className="text-sm text-muted-foreground">
                          Score: {session.score}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/')} size="lg">
            Zurück zu den Spielen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;