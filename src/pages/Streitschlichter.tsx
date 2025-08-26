import { useState } from "react";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface ConflictData {
  conflict: string;
  options: string[];
  correctIndex: number;
  feedback?: string;
}

const Streitschlichter = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";

  const [conflictData, setConflictData] = useState<ConflictData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isGameLoading, setIsGameLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const maxQuestions = 5;

  const loadConflictScenario = async () => {
    if (questionCount >= maxQuestions) {
      setGameCompleted(true);
      return;
    }

    setIsGameLoading(true);
    setSelectedOption(null);
    setShowFeedback(false);

    try {
      const { data, error } = await supabase.functions.invoke('generate-conflict');
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.conflict && Array.isArray(data.options) && data.correctIndex !== undefined) {
        setConflictData(data);
        if (!gameStarted) {
          setGameStarted(true);
        }
      } else {
        throw new Error('Ungültige Antwort von der API');
      }
    } catch (error) {
      console.error('Error loading conflict scenario:', error);
      toast({
        title: "Fehler",
        description: "Konfliktszenario konnte nicht geladen werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !conflictData) return;

    const isCorrect = selectedOption === conflictData.correctIndex;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage("Richtig! Das war eine deeskalierende und sozial kompetente Antwort.");
    } else {
      setFeedbackMessage("Nicht ganz. Überlege nochmal, wie sich die Person wohl fühlt und welche Antwort die Situation beruhigt.");
    }
    
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setQuestionCount(prev => prev + 1);
    setShowFeedback(false);
    loadConflictScenario();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setQuestionCount(0);
    setScore(0);
    setConflictData(null);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const progress = (questionCount / maxQuestions) * 100;

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
                  
                  <h2 className="text-xl font-bold text-foreground">„Streitschlichter" – Worum geht's?</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Das Ziel:</h3>
                      <p className="text-sm text-muted-foreground">
                        Du übst, in Alltagskonflikten ruhig zu bleiben, die Perspektive zu wechseln und eine faire Lösung für alle zu finden.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground mb-2">Was lernst du?</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Gefühle & Bedürfnisse erkennen</li>
                        <li>• Konflikte auflösen</li>
                        <li>• Sozial kompetent reagieren</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground mb-2">So spielst du:</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Lies das Szenario</li>
                        <li>• Wähle eine Reaktion aus den 3 Optionen aus</li>
                        <li>• Bestätige & sieh dir das Feedback an</li>
                        <li>• Beantworte 5 Fragen und erhalte deine Punkte</li>
                      </ul>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>💡</span>
                        <span className="font-semibold text-foreground">Tipp</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Frag dich: <em>„Welche Option beruhigt die Situation und ist fair?"</em>
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate('/konfliktloesung')}
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
                {/* Progress Bar */}
                {gameStarted && !gameCompleted && (
                  <div className="w-full bg-muted rounded-full h-2 mb-6">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Header with Ferdy */}
                <div className="text-center mb-6">
                  <img 
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_auge.jpg"
                    alt="Ferdy Maskottchen"
                    className="w-48 h-auto mx-auto rounded-lg object-cover"
                  />
                </div>

                {/* Loading State */}
                {isGameLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Lade Frage...</p>
                  </div>
                )}

                {/* Start Screen */}
                {!gameStarted && !isGameLoading && (
                  <div className="text-center space-y-6">
                    <h1 className="text-2xl font-bold text-foreground">Wie würdest du den Konflikt lösen?</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Willkommen zum Streitschlichter-Spiel! Du bekommst Konfliktsituationen aus dem Alltag und 
                      sollst die beste Lösung finden, die alle Beteiligten respektiert und die Situation beruhigt.
                    </p>
                    <Button 
                      onClick={loadConflictScenario}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Spiel starten
                    </Button>
                  </div>
                )}

                {/* Question Display */}
                {gameStarted && !gameCompleted && conflictData && !showFeedback && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-foreground mb-4">Wie würdest du den Konflikt lösen?</h1>
                      <span className="text-sm text-muted-foreground">
                        Frage {questionCount + 1} von {maxQuestions}
                      </span>
                    </div>
                    
                    <p className="text-lg text-foreground leading-relaxed text-center">
                      {conflictData.conflict}
                    </p>

                    <div className="space-y-3">
                      {conflictData.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(index)}
                          className={`w-full p-4 text-left border rounded-lg transition-all duration-200 ${
                            selectedOption === index 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <span className="text-foreground">{option}</span>
                        </button>
                      ))}
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Antwort bestätigen
                      </Button>
                    </div>
                  </div>
                )}

                {/* Feedback Display */}
                {showFeedback && (
                  <div className="text-center space-y-6">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <p className="text-lg text-foreground">{feedbackMessage}</p>
                    </div>
                    <Button
                      onClick={handleNextQuestion}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {questionCount + 1 >= maxQuestions ? 'Zur Auswertung' : 'Nächste Frage'}
                    </Button>
                  </div>
                )}

                {/* Results Screen */}
                {gameCompleted && (
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">🎉 Du hast {score} von {maxQuestions} richtig beantwortet!</h2>
                    
                    <div className="bg-primary/10 p-6 rounded-lg">
                      <div className="text-6xl mb-4">
                        {score >= maxQuestions * 0.8 ? '🎉' : 
                         score >= maxQuestions * 0.6 ? '👍' : '💪'}
                      </div>
                      <p className="text-foreground font-semibold">
                        {score >= maxQuestions * 0.8 ? 'Ausgezeichnet! Du bist ein echter Konfliktlöser!' :
                         score >= maxQuestions * 0.6 ? 'Gut gemacht! Du kannst Konflikte bereits gut lösen!' :
                         'Das war ein guter Start! Mit etwas Übung wirst du noch besser!'}
                      </p>
                    </div>

                    <Button 
                      onClick={resetGame}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Erneut spielen
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Streitschlichter;