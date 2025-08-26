import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export default function Mindshift() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";

  const [scenario, setScenario] = useState<string>("");
  const [negativeThought, setNegativeThought] = useState("");
  const [positiveThought, setPositiveThought] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isGameLoading, setIsGameLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const loadScenario = async () => {
    setIsGameLoading(true);
    setFeedback("");
    setNegativeThought("");
    setPositiveThought("");
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-scenario');
      
      if (error) throw error;
      
      if (!data || !data.scenario) {
        throw new Error('Unerwartete API-Antwort');
      }
      
      setScenario(data.scenario);
      setGameStarted(true);
    } catch (error) {
      console.error('Fehler beim Laden des Szenarios:', error);
      setPopupMessage('Fehler beim Laden des Szenarios.');
      setShowPopup(true);
    } finally {
      setIsGameLoading(false);
    }
  };

  const checkAnswer = async () => {
    const neg = negativeThought.trim();
    const pos = positiveThought.trim();
    
    if (!neg || !pos) {
      setPopupMessage('Bitte fülle beide Felder aus.');
      setShowPopup(true);
      return;
    }
    
    setIsGameLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-mindshift-answer', {
        body: { negativeThought: neg, positiveThought: pos }
      });
      
      if (error) throw error;
      
      if (data?.isValid) {
        setPopupMessage(data.feedback || 'Super! Du hast den negativen Gedanken erkannt und positiv umformuliert.');
        setShowPopup(true);
        setTimeout(() => {
          loadScenario();
        }, 2000);
      } else {
        setPopupMessage(data?.feedback || 'Überlege noch einmal, ob die Formulierungen wirklich stimmen.');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Fehler beim Prüfen der Antwort:', error);
      setPopupMessage('Technischer Fehler. Bitte versuche es erneut.');
      setShowPopup(true);
    } finally {
      setIsGameLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Lade...</p>
        </div>
      </div>
    );
  }

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
                  
                  <h2 className="text-xl font-bold text-foreground">„GedankenStopp" – Worum geht's?</h2>
                  
                  <p className="text-muted-foreground">
                    Du erkennst belastende, negative Gedanken und formulierst sie in 
                    <strong> positive, hilfreiche</strong> Gedanken um. Du bekommst kurze Alltagssituationen
                    und übst achtsam, wie du dein Denken in eine konstruktive Richtung lenkst.
                  </p>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">So spielst du</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Eine Situation wird angezeigt.</li>
                      <li>• Schreibe deinen <strong>negativen</strong> Gedanken dazu auf.</li>
                      <li>• Formuliere ihn als <strong>positiven</strong> Gedanken um.</li>
                      <li>• Klicke auf <strong>Weiter</strong> und lies das Feedback.</li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span>💡</span>
                      <span className="font-semibold text-foreground">Warum das wichtig ist</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mit hilfreichen Gedanken bleibst du handlungsfähig, gelassener und lernst schneller aus Situationen.
                    </p>
                  </div>

                  <Button 
                    onClick={() => navigate('/mindset')}
                    variant="outline"
                    className="w-full"
                  >
                    Zurück
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Game Area */}
            <div className="md:col-span-8">
              <Card className="p-8 ferdy-shadow-card">
                {/* Header with Ferdy */}
                <div className="text-center mb-6">
                  <img 
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_goodbye.png" 
                    alt="Ferdy Goodbye"
                    className="w-64 h-48 mx-auto rounded-lg object-cover bg-white shadow-lg"
                  />
                </div>

                {/* Loading State */}
                {isGameLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Lade neue Situation...</p>
                  </div>
                )}

                {/* Start Screen */}
                {!gameStarted && !isGameLoading && (
                  <div className="text-center space-y-6">
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
                      <p className="text-lg text-foreground leading-relaxed">
                        In diesem Spiel lernst du, wie du negative Gedanken erkennst und in positive, hilfreiche Gedanken umwandeln kannst.
                        Du bekommst kleine Alltagssituationen gezeigt und übst, wie du mit deinen Gedanken achtsamer umgehst.
                        So stärkst du Schritt für Schritt dein mentales Wohlbefinden – spielerisch und mit Leichtigkeit.
                      </p>
                    </div>
                    <Button 
                      onClick={loadScenario}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Spiel starten
                    </Button>
                  </div>
                )}

                {/* Game Display */}
                {gameStarted && !isGameLoading && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <h3 className="font-bold text-foreground mb-2">Situation:</h3>
                      <p className="text-foreground text-left leading-relaxed">{scenario}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Textarea
                          value={negativeThought}
                          onChange={(e) => setNegativeThought(e.target.value)}
                          placeholder="Welchen negativen Gedanken hast du in dieser Situation erkannt?"
                          className="min-h-[100px] resize-none"
                        />
                      </div>

                      <div>
                        <Textarea
                          value={positiveThought}
                          onChange={(e) => setPositiveThought(e.target.value)}
                          placeholder="Wie könntest du diesen Gedanken positiv umformulieren?"
                          className="min-h-[100px] resize-none"
                        />
                      </div>

                      {feedback && (
                        <p className="font-semibold text-green-600 text-center">{feedback}</p>
                      )}

                      <div className="flex gap-4">
                        <Button
                          onClick={checkAnswer}
                          disabled={!negativeThought.trim() || !positiveThought.trim()}
                          className="bg-primary hover:bg-primary/90 flex-1"
                          size="lg"
                        >
                          Weiter
                        </Button>
                        
                        <Button
                          onClick={loadScenario}
                          variant="outline"
                        >
                          Neue Situation
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Popup */}
      {showPopup && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowPopup(false)}
          />
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-6 rounded-lg z-50 max-w-md w-[90%] text-center">
            <p className="text-lg font-medium mb-4">{popupMessage}</p>
            <Button
              onClick={() => setShowPopup(false)}
              variant="secondary"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Schließen
            </Button>
          </div>
        </>
      )}
    </div>
  );
}