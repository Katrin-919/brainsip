import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FerdyHeader } from "@/components/FerdyHeader";
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
  const navigate = useNavigate();
  const [pairs, setPairs] = useState<MindsetPair[]>([]);
  const [allCards, setAllCards] = useState<PairCard[]>([]);
  const [selectedFixed, setSelectedFixed] = useState<string | null>(null);
  const [selectedGrowth, setSelectedGrowth] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const shuffle = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadPairs = async () => {
    setLoading(true);
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
    } catch (error) {
      console.error('Fehler beim Laden der Aussagen:', error);
      setPopupMessage('Fehler beim Laden der Aussagen.');
      setShowPopup(true);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    loadPairs();
  }, []);

  const canSubmit = selectedFixed && selectedGrowth;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <FerdyHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Instructions */}
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    ℹ️ Spiel-Info
                  </h3>
                  <h2 className="text-xl font-bold text-gray-800">
                    „Mindset‑Paare finden" – Worum geht's?
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Du lernst, hinderliche Gedanken (<em>Fixed Mindset</em>) zu erkennen
                    und sie mit ermutigenden Gedanken (<em>Growth Mindset</em>) zu ersetzen.
                    Finde die Aussagen, die zusammengehören.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-primary mt-6">So spielst du</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Klicke auf <strong>„Neue Paare laden"</strong> (passiert automatisch beim Start)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Wähle einen <strong>hinderlichen</strong> und danach die passende <strong>positive</strong> Aussage
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Klicke auf <strong>„Antwort prüfen"</strong>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-primary mt-6">Warum das wichtig ist</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Dein Denken beeinflusst dein Handeln. Mit dem richtigen Mindset löst du
                    Probleme konstruktiver – und lernst schneller.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={() => navigate("/mindset")}
              variant="outline"
              className="w-full lg:w-auto"
            >
              Zurück zur Übersicht
            </Button>
          </div>

          {/* Right Column - Game */}
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/baed1d19-cefc-427e-9413-c5bb9584cb84.png" 
                      alt="Ferdy Puzzle" 
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Finde passende Aussagen
                  </h1>
                  <p className="text-gray-600">
                    Wähle jeweils ein Paar: ein hinderlicher Gedanke und die passende positive Einstellung.
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Lade neue Aussagen...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {allCards.map((card, index) => (
                        <Card
                          key={index}
                          className={`cursor-pointer transition-all duration-200 border-2 ${
                            (card.type === 'fixed' && selectedFixed === card.text) ||
                            (card.type === 'growth' && selectedGrowth === card.text)
                              ? 'bg-green-100 border-green-500 shadow-md'
                              : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                          onClick={() => handleCardClick(card)}
                        >
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {card.text}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button
                      onClick={checkAnswer}
                      disabled={!canSubmit}
                      className="w-full"
                      size="lg"
                    >
                      Antwort prüfen
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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