import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FerdyHeader } from '@/components/FerdyHeader';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function SagsMalAnders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { completeGame } = useGameProgress();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";
  const [badSentence, setBadSentence] = useState<string>('Lade...');
  const [userInput, setUserInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  const loadBadSentence = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-bad-sentence');
      
      if (error) {
        console.error('Error loading sentence:', error);
        setBadSentence('Fehler beim Laden.');
        return;
      }

      setBadSentence(data?.sentence || 'Fehler beim Laden.');
    } catch (error) {
      console.error('Error:', error);
      setBadSentence('Fehler beim Laden.');
    }
  };

  // Load initial sentence on component mount
  useEffect(() => {
    loadBadSentence();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Lade...</div>
      </div>
    );
  }

  const checkRewrite = async () => {
    if (userInput.trim().length < 5) {
      setPopupMessage('Bitte schreibe eine etwas längere Antwort.');
      setShowPopup(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('check-rewrite', {
        body: {
          original: badSentence,
          rewrite: userInput
        }
      });

      if (error) {
        console.error('Error checking rewrite:', error);
        setPopupMessage('Technischer Fehler. Bitte versuche es erneut.');
      } else {
        // Check if the rewrite was successful and award points
        if (data?.isImproved && user) {
          const gameResult = await completeGame({
            game_name: "Sag's mal anders",
            game_category: "communication", 
            score: 80,
            success: true
          });
          
          if (gameResult.pointsEarned > 0) {
            setPopupMessage(`${data?.feedback || 'Sehr gut!'} Du hast ${gameResult.pointsEarned} Punkte verdient!`);
          } else {
            setPopupMessage(data?.feedback || 'Sehr gut!');
          }
        } else {
          setPopupMessage(data?.feedback || 'Fehler bei der Bewertung.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Technischer Fehler. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setUserInput('');
    loadBadSentence();
  };


  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
      
      <main className="mt-20 px-4 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8">
          
            {/* Left Info Panel */}
            <div className="md:col-span-4">
              <Card className="p-6 ferdy-shadow-card sticky top-24">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">ℹ️</span>
                    <h3 className="text-lg font-bold text-foreground">Spiel-Info</h3>
                  </div>
              
                  <h2 className="text-xl font-bold text-foreground">
                    „Sag's mal anders" – Worum geht's?
                  </h2>
              
                  <p className="text-muted-foreground">
                    Manchmal rutscht uns ein Satz heraus, der andere verletzt. 
                    In diesem Spiel übst du, unfreundliche Formulierungen in freundliche, wertschätzende Sprache zu verwandeln.
                  </p>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">So spielst du</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Lies den roten Beispielsatz.</li>
                      <li>• Formuliere ihn freundlich und respektvoll um.</li>
                      <li>• Klicke auf <strong>„Antwort abschicken"</strong> und lies das Feedback.</li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span>💡</span>
                      <span className="font-semibold text-foreground">Tipp</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nutze Ich‑Botschaften, vermeide Vorwürfe und bleib konkret: 
                      „Ich wünsche mir …", „Können wir …?", „Mir hilft es, wenn …".
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/konfliktloesung')}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Zurück
                </Button>
              </Card>
            </div>

            {/* Right Game Panel */}
            <div className="md:col-span-8">
              <Card className="p-8 ferdy-shadow-card">
            
            <div className="flex flex-col items-center space-y-6">
                  <div className="flex justify-center">
                    <img 
                      src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_blink.gif" 
                      alt="Schlauer Fuchs" 
                      className="w-44 h-auto rounded-2xl"
                    />
                  </div>

                  <h1 className="text-3xl font-bold text-center text-foreground">
                    Sag's mal anders
                  </h1>

                  <p className="text-base text-muted-foreground text-center max-w-2xl">
                    Formuliere den folgenden Satz freundlich um:
                  </p>

                  <div className="w-full max-w-2xl bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-red-700">
                      {badSentence}
                    </div>
                  </div>

                  <div className="w-full max-w-2xl">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Deine freundliche Version hier..."
                      className="min-h-32 text-base border-2 border-slate-300 focus:border-blue-500"
                    />
                  </div>

                  <Button
                    onClick={checkRewrite}
                    disabled={userInput.trim().length === 0 || isSubmitting}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-base"
                  >
                    {isSubmitting ? 'Wird bewertet...' : 'Antwort abschicken'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Popup */}
      {showPopup && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClosePopup}
          />
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 z-50 w-11/12 max-w-md text-center shadow-2xl">
            <p className="text-slate-800 mb-6 leading-relaxed">
              {popupMessage}
            </p>
            <Button
              onClick={handleClosePopup}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Schließen
            </Button>
          </div>
        </>
      )}
    </div>
  );
}