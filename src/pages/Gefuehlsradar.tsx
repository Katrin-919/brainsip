import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FerdyHeader } from "@/components/FerdyHeader";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Scenario {
  text: string;
  options: string[];
  correct: number;
  feedback: string;
}

const Gefuehlsradar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [gameLoading, setGameLoading] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const maxQuestions = 5;

  const loadScenario = async () => {
    if (currentQuestion > maxQuestions) {
      setPopupMessage("🎉 Gut gemacht! Du hast alle Szenarien durchgespielt und gelernt, Gefühle noch besser zu erkennen.");
      setShowPopup(true);
      return;
    }

    setGameLoading(true);
    setSelectedOption(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-feeling-scenario');
      
      if (error) throw error;
      
      if (data && data.text && data.options && typeof data.correct === 'number') {
        setScenario(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error loading scenario:', error);
      setScenario({
        text: "Fehler beim Laden der Aufgabe.",
        options: [],
        correct: 0,
        feedback: ""
      });
    } finally {
      setGameLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null || !scenario) return;

    if (selectedOption === scenario.correct) {
      setWasCorrect(true);
      setPopupMessage(scenario.feedback || 'Richtig!');
    } else {
      setWasCorrect(false);
      setPopupMessage('Nicht ganz. Überlege nochmal, wie sich die Person wohl fühlt.');
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    
    if (wasCorrect) {
      if (currentQuestion >= maxQuestions) {
        return;
      }
      setCurrentQuestion(prev => prev + 1);
      loadScenario();
    } else {
      setSelectedOption(null);
    }
  };

  useEffect(() => {
    loadScenario();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Lade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader />
      
      <main className="mt-20 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Instructions */}
          <Card className="p-6 h-fit">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">ℹ️ Spiel-Info</h3>
                <h2 className="text-2xl font-bold text-foreground mb-4">„Gefühlsradar" – Worum geht's?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Du bekommst kurze Alltagssituationen. Deine Aufgabe: Wähle das Gefühl,
                  das am besten dazu passt. So trainierst du Empathie und verstehst andere besser.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">So spielst du</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Lies das Szenario aufmerksam.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Klicke auf das Gefühl, das am ehesten passt.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Bestätige mit <strong>„Antwort abschicken"</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Spiele alle Runden durch.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-foreground mb-2">💡 Tipp</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Achte auf <em>Hinweise</em> im Text: Körperhaltung, Tonfall, Situation.
                  Oft verraten kleine Details große Gefühle.
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

          {/* Right Column - Game */}
          <Card className="p-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <img 
                  src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_blink.gif" 
                  alt="Ferdy blinzelt"
                  className="w-56 h-72 object-cover rounded-2xl"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground mb-4">Gefühle erkennen</h1>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Manchmal sieht man jemandem an, wie er sich fühlt – manchmal auch nicht.
                  Lies das Szenario und wähle das Gefühl, das am besten passt.
                </p>
              </div>

              {currentQuestion <= maxQuestions && (
                <div className="font-bold text-foreground">
                  Frage {currentQuestion} von {maxQuestions}
                </div>
              )}

              <div className="bg-muted/50 p-6 rounded-lg min-h-[120px] flex items-center justify-center">
                {gameLoading ? (
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    <span className="text-muted-foreground">Lade neue Frage...</span>
                  </div>
                ) : scenario?.text ? (
                  <p className="text-lg font-semibold text-foreground leading-relaxed text-justify">
                    {scenario.text}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Lade Szenario...</p>
                )}
              </div>

              {scenario?.options && scenario.options.length > 0 && (
                <div className="space-y-3">
                  {scenario.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedOption(index)}
                      variant={selectedOption === index ? "default" : "outline"}
                      className="w-full min-w-[220px] max-w-[320px] mx-auto block p-4 h-auto"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null || currentQuestion > maxQuestions}
                className="w-full max-w-[320px]"
              >
                Antwort abschicken
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Popup */}
      {showPopup && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={closePopup}></div>
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-[90%] max-w-md text-center shadow-lg">
            <p className="text-foreground mb-4 leading-relaxed">{popupMessage}</p>
            <Button onClick={closePopup} className="w-full">
              Schließen
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Gefuehlsradar;