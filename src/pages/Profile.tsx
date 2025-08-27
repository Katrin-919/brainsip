import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Star, Medal, Clock, Target, User, Mail, Edit3, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FerdyHeader } from '@/components/FerdyHeader';
import ferdiFox from '@/assets/ferdi-fox.png';

interface Profile {
  display_name: string;
  total_points: number;
  status: string;
  user_id: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    email: ''
  });

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
      setEditForm({
        display_name: data?.display_name || '',
        email: user?.email || ''
      });
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

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: editForm.display_name })
        .eq('user_id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, display_name: editForm.display_name } : null);
      setIsEditing(false);
      toast.success('Profil erfolgreich aktualisiert');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Fehler beim Aktualisieren des Profils');
    }
  };

  const handleStartSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('purchase-additional-plays', {
        body: { 
          game_category: 'premium_subscription',
          additional_plays: 999 // Unlimited for subscription
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error starting subscription:', error);
      toast.error('Fehler beim Starten des Abonnements');
    }
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

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Profile Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil Informationen
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Abbrechen' : 'Bearbeiten'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Name</Label>
                    <Input
                      id="display_name"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Dein Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      value={editForm.email}
                      disabled
                      className="opacity-60"
                    />
                    <p className="text-xs text-muted-foreground">
                      E-Mail kann derzeit nicht geändert werden
                    </p>
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full">
                    Änderungen speichern
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{profile.display_name || 'Nicht gesetzt'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ferdi Card */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Dein Lernpartner</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={ferdiFox} 
                alt="Ferdi der Fuchs"
                className="w-24 h-24 mx-auto mb-3 rounded-full"
              />
              <p className="text-sm text-muted-foreground">
                Hallo! Ich bin Ferdi und begleite dich auf deiner Lernreise!
              </p>
            </CardContent>
          </Card>
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

        {/* Subscription Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Premium Abonnement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div>
                <h3 className="font-semibold text-lg">Ferdi Premium</h3>
                <p className="text-muted-foreground">Unbegrenzter Zugang zu allen Spielen und Features</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Alle Spiele freigeschalten</li>
                  <li>• Keine täglichen Limits</li>
                  <li>• Erweiterte Statistiken</li>
                  <li>• Prioritäts-Support</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">€9.99</div>
                <div className="text-sm text-muted-foreground">pro Monat</div>
                <Button 
                  onClick={handleStartSubscription}
                  className="mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  Jetzt upgraden
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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