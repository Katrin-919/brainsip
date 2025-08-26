import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuizQuestion {
  statement: string;
  type: 'fixed' | 'growth';
  explanation: string;
}

const Mindmatch = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const totalQuestions = 10;
  const isLoggedIn = !!user;
  const displayName = user?.user_metadata?.display_name || user?.email || "Gast";

  const fetchQuestion = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mindset-statements', {
        body: {}
      });

      if (error) throw error;

      if (data && data.statement && data.type && data.explanation) {
        setQuestion({
          statement: data.statement,
          type: data.type,
          explanation: data.explanation
        });
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion({
        statement: "Fehler beim Laden der Frage.",
        type: "fixed",
        explanation: "Bitte versuche es erneut."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleOptionClick = (option: 'fixed' | 'growth') => {
    if (selectedOption || !question) return;
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    if (option === question.type) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      fetchQuestion();
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setGameFinished(false);
    fetchQuestion();
  };

  const getScoreMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return "Ausgezeichnet! Du hast ein starkes Growth Mindset entwickelt.";
    if (percentage >= 60) return "Gut gemacht! Du erkennst Growth Mindset-Aussagen schon sehr gut.";
    if (percentage >= 40) return "Das ist ein guter Anfang! Übe weiter, um dein Growth Mindset zu stärken.";
    return "Lass dich nicht entmutigen! Jeder Fehler ist eine Chance zu lernen.";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Lade...</p>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="min-h-screen bg-background">
        <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
        <main className="mt-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/mindset")}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">ℹ️ Spiel-Info</h3>
                  <h2 className="text-xl font-bold mb-4 text-foreground">„Mindset Quiz" – Worum geht's?</h2>
                  <p className="mb-4 text-muted-foreground">
                    Du bekommst Aussagen aus dem Alltag. Deine Aufgabe: 
                    Entscheide, ob die Aussage ein <em>Fixed Mindset</em> (fester Denkstil) 
                    oder ein <em>Growth Mindset</em> (Wachstums‑Denken) zeigt.
                  </p>
                  
                  <h3 className="font-semibold mb-2 text-foreground">Warum das wichtig ist</h3>
                  <p className="text-muted-foreground">
                    Wer ein Growth Mindset trainiert, bleibt neugierig, probiert aus und lernt 
                    leichter aus Fehlern – genau darum geht's hier.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <img 
                    src="/lovable-uploads/d8fa8bd4-9c4f-4ed0-892f-e72f94052db1.png" 
                    alt="Ferdy" 
                    className="w-full max-w-xs mx-auto mb-6 rounded-xl"
                  />
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Quiz beendet!</h2>
                    <div className="text-3xl font-bold text-primary">
                      {Math.round((score / totalQuestions) * 100)}% Growth Mindset
                    </div>
                    <p className="text-foreground">
                      Du hast {score} von {totalQuestions} Aussagen im Sinne eines Growth Mindset erkannt.
                    </p>
                    <p className="text-muted-foreground">{getScoreMessage()}</p>
                    <Button onClick={handleRestart} className="w-full">
                      Neu starten
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
      
      <main className="mt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/mindset")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Info */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">ℹ️ Spiel-Info</h3>
                <h2 className="text-xl font-bold mb-4 text-foreground">„Mindset Quiz" – Worum geht's?</h2>
                <p className="mb-4 text-muted-foreground">
                  Du bekommst Aussagen aus dem Alltag. Deine Aufgabe: 
                  Entscheide, ob die Aussage ein <em>Fixed Mindset</em> (fester Denkstil) 
                  oder ein <em>Growth Mindset</em> (Wachstums‑Denken) zeigt.
                </p>

                <h3 className="font-semibold mb-2 text-foreground">So spielst du</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">
                  <li>Lies die Aussage aufmerksam.</li>
                  <li>Klicke auf <strong>Fixed</strong> oder <strong>Growth</strong>.</li>
                  <li>Sieh dir das Feedback an und klicke <strong>Weiter</strong>.</li>
                  <li>Nach 10 Fragen siehst du dein Ergebnis.</li>
                </ul>

                <h3 className="font-semibold mb-2 text-foreground">Warum das wichtig ist</h3>
                <p className="text-muted-foreground">
                  Wer ein Growth Mindset trainiert, bleibt neugierig, probiert aus und lernt 
                  leichter aus Fehlern – genau darum geht's hier.
                </p>
              </CardContent>
            </Card>

            {/* Right Column - Game */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <img 
                  src="/lovable-uploads/f402e6b2-cfe9-4c7d-9969-484f52c0ccec.png" 
                  alt="Ferdy" 
                  className="w-full max-w-xs mx-auto mb-6 rounded-xl"
                />

                <div className="bg-background/60 rounded-xl p-4 mb-6">
                  <strong className="text-foreground">Wie denkst du über Herausforderungen?</strong>
                  <p className="text-muted-foreground mt-2">
                    In diesem Quiz bekommst du Aussagen aus dem Alltag gezeigt.
                    Du sollst entscheiden: Zeigt diese Aussage ein <em>Fixed Mindset</em> – also einen festen Denkstil –
                    oder ein <em>Growth Mindset</em>, das offen für Entwicklung ist?
                  </p>
                </div>

                <div className="mb-6">
                  <Progress value={(currentQuestion / totalQuestions) * 100} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Frage {currentQuestion + 1} von {totalQuestions}
                  </p>
                </div>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="text-lg font-semibold text-center mb-6 text-foreground">
                      {isLoading ? "Lade Frage..." : question?.statement}
                    </div>

                    <div className="grid gap-3 mb-4">
                      <Button
                        variant={selectedOption === 'fixed' ? 'default' : 'outline'}
                        onClick={() => handleOptionClick('fixed')}
                        disabled={!!selectedOption || isLoading}
                        className="w-full"
                      >
                        Fixed Mindset
                      </Button>
                      <Button
                        variant={selectedOption === 'growth' ? 'default' : 'outline'}
                        onClick={() => handleOptionClick('growth')}
                        disabled={!!selectedOption || isLoading}
                        className="w-full"
                      >
                        Growth Mindset
                      </Button>
                    </div>

                    {showFeedback && question && (
                      <div className={`p-3 rounded-lg mb-4 ${
                        selectedOption === question.type 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {selectedOption === question.type ? 'Richtig!' : 'Leider falsch.'} {question.explanation}
                      </div>
                    )}

                    <Button
                      onClick={handleNext}
                      disabled={!showFeedback}
                      className="w-full"
                    >
                      Weiter
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Mindmatch;