import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface MindsetPair {
  fixed: string;
  growth: string;
}

interface PairCard {
  type: 'fixed' | 'growth';
  text: string;
}

export default function PaareFinden() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";

  const [pairs, setPairs] = useState<MindsetPair[]>([]);
  const [allCards, setAllCards] = useState<PairCard[]>([]);
  const [selectedFixed, setSelectedFixed] = useState<string | null>(null);
  const [selectedGrowth, setSelectedGrowth] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isGameLoading, setIsGameLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const shuffle = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadPairs = async () => {
    setIsGameLoading(true);
    setSelectedFixed(null);
    setSelectedGrowth(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-mindset-pairs');
      
      if (error) throw error;
      
      if (!data || !Array.isArray(data.pairs)) {
        throw new Error('Unerwartete API-Antwort');
      }
      
      setPairs(data.pairs);
      
      const fixedCards: PairCard[] = data.pairs.map((p: MindsetPair) => ({ 
        type: 'fixed' as const, 
        text: p.fixed 
      }));
      const growthCards: PairCard[] = data.pairs.map((p: MindsetPair) => ({ 
        type: 'growth' as const, 
        text: p.growth 
      }));
      
      setAllCards(shuffle([...fixedCards, ...growthCards]));
      setGameStarted(true);
    } catch (error) {
      console.error('Fehler beim Laden der Aussagen:', error);
      setPopupMessage('Fehler beim Laden der Aussagen.');
      setShowPopup(true);
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleCardClick = (card: PairCard) => {
    if (card.type === 'fixed') {
      setSelectedFixed(card.text);
    } else {
      setSelectedGrowth(card.text);
    }
  };

  const checkAnswer = () => {
    if (!selectedFixed || !selectedGrowth) return;
    
    const isCorrect = pairs.some(p => p.fixed === selectedFixed && p.growth === selectedGrowth);
    
    if (isCorrect) {
      setPopupMessage('🎉 Richtig zugeordnet!');
      // Remove the correct pair from cards
      setAllCards(prev => prev.filter(card => 
        card.text !== selectedFixed && card.text !== selectedGrowth
      ));
    } else {
      setPopupMessage('❌ Diese Aussagen gehören nicht zusammen. Versuche es nochmal.');
    }
    
    setShowPopup(true);
    setSelectedFixed(null);
    setSelectedGrowth(null);
    
    // If all pairs found, load new ones
    setTimeout(() => {
      if (isCorrect && allCards.filter(card => 
        card.text !== selectedFixed && card.text !== selectedGrowth
      ).length === 0) {
        loadPairs();
      }
    }, 300);
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedFixed(null);
    setSelectedGrowth(null);
    setAllCards([]);
    setPairs([]);
  };

  const canSubmit = selectedFixed && selectedGrowth;

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
                  
                  <h2 className="text-xl font-bold text-foreground">„Mindset‑Paare finden" – Worum geht's?</h2>
                  
                  <p className="text-muted-foreground">
                    Du lernst, hinderliche Gedanken (<em>Fixed Mindset</em>) zu erkennen
                    und sie mit ermutigenden Gedanken (<em>Growth Mindset</em>) zu ersetzen.
                    Finde die Aussagen, die zusammengehören.
                  </p>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">So spielst du</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Klicke auf <strong>„Neue Paare laden"</strong> (passiert automatisch beim Start)</li>
                      <li>• Wähle einen <strong>hinderlichen</strong> und danach die passende <strong>positive</strong> Aussage</li>
                      <li>• Klicke auf <strong>„Antwort prüfen"</strong></li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span>💡</span>
                      <span className="font-semibold text-foreground">Warum das wichtig ist</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dein Denken beeinflusst dein Handeln. Mit dem richtigen Mindset löst du
                      Probleme konstruktiver – und lernst schneller.
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
                    src="/lovable-uploads/f402e6b2-cfe9-4c7d-9969-484f52c0ccec.png" 
                    alt="Ferdy Puzzle"
                    className="w-70 h-85 mx-auto rounded-lg object-cover"
                  />
                </div>

                {/* Loading State */}
                {isGameLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Lade neue Aussagen...</p>
                  </div>
                )}

                {/* Start Screen */}
                {!gameStarted && !isGameLoading && (
                  <div className="text-center space-y-6">
                    <h1 className="text-2xl font-bold text-foreground">
                      Finde passende Aussagen
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Wähle jeweils ein Paar: ein hinderlicher Gedanke und die passende positive Einstellung.
                    </p>
                    <Button 
                      onClick={loadPairs}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Neue Paare laden
                    </Button>
                  </div>
                )}

                {/* Game Display */}
                {gameStarted && !isGameLoading && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-foreground mb-2">
                        Finde passende Aussagen
                      </h1>
                      <p className="text-muted-foreground">
                        Wähle jeweils ein Paar: ein hinderlicher Gedanke und die passende positive Einstellung.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {allCards.map((card, index) => (
                        <button
                          key={index}
                          onClick={() => handleCardClick(card)}
                          className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                            (card.type === 'fixed' && selectedFixed === card.text) ||
                            (card.type === 'growth' && selectedGrowth === card.text)
                              ? 'border-primary bg-primary/10'
                              : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <p className="text-sm text-foreground leading-relaxed">
                            {card.text}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={checkAnswer}
                        disabled={!canSubmit}
                        className="bg-primary hover:bg-primary/90 flex-1"
                        size="lg"
                      >
                        Antwort prüfen
                      </Button>
                      
                      <Button
                        onClick={resetGame}
                        variant="outline"
                      >
                        Neu starten
                      </Button>
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