import { useState, useEffect } from "react";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Question {
  question: string;
  answerA: string;
  answerB: string;
  solutionOriented: 'A' | 'B';
}

const Denkweiser = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [solutionOrientedAnswers, setSolutionOrientedAnswers] = useState(0);
  const [isGameLoading, setIsGameLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const loadQuestions = async () => {
    setIsGameLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz-questions');
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.content && Array.isArray(data.content)) {
        setQuestions(data.content);
        setGameStarted(true);
        setCurrentQuestion(1);
        setSolutionOrientedAnswers(0);
        setGameCompleted(false);
        setShowResults(false);
      } else {
        throw new Error('Ungültige Antwort von der API');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Fehler",
        description: "Fragen konnten nicht geladen werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleAnswerSelect = (answer: 'A' | 'B') => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const currentQ = questions[currentQuestion - 1];
    if (selectedAnswer === currentQ.solutionOriented) {
      setSolutionOrientedAnswers(prev => prev + 1);
    }

    if (currentQuestion < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setGameCompleted(true);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setShowResults(false);
    setCurrentQuestion(1);
    setSelectedAnswer(null);
    setSolutionOrientedAnswers(0);
    setQuestions([]);
  };

  const currentQuestionData = questions[currentQuestion - 1];
  const progress = questions.length > 0 ? ((currentQuestion - 1) / questions.length) * 100 : 0;

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
                  
                  <h2 className="text-xl font-bold text-foreground">„Denkweiser" – Worum geht's?</h2>
                  
                  <p className="text-muted-foreground">
                    Deine Aufgabe: Du bekommst Situationen aus dem Alltag und wählst jeweils die Antwort, 
                    die das Problem <strong>lösungsorientiert</strong> angeht – also so, dass nicht das Problem, 
                    sondern die Lösung im Mittelpunkt steht und möglichst alle Beteiligten davon profitieren.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">Beispiel:</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Jemand ist genervt, weil du dich verspätet hast.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">Welche Antwort ist lösungsorientiert?</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• „Ich weiß, dass ich zu spät bin – lass uns sehen, wie wir jetzt das Beste aus der Zeit machen."</li>
                      <li>• Statt zu meckern, überlegst du gemeinsam, wie ihr den restlichen Termin optimal nutzt.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">So spielst du</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Lies die Frage aufmerksam</li>
                      <li>• Wähle die passendere Antwort aus den 2 Optionen</li>
                      <li>• Klicke auf <strong>„Weiter"</strong> und erhalte Feedback</li>
                      <li>• Spiele alle Fragen bis zur Auswertung</li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span>💡</span>
                      <span className="font-semibold text-foreground">Tipp</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Frag dich: <em>„Welche Option bringt alle am besten weiter und schafft eine faire Lösung?"</em>
                    </p>
                  </div>

                  <Button 
                    onClick={() => navigate('/losungsorientierung')}
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
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_dancearound.gif"
                    alt="Ferdy Maskottchen"
                    className="w-32 h-40 mx-auto rounded-lg object-cover"
                  />
                </div>

                {/* Progress Bar */}
                {gameStarted && !gameCompleted && (
                  <div className="w-full bg-muted rounded-full h-2 mb-6">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Loading State */}
                {isGameLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Lade spannende Fragen...</p>
                  </div>
                )}

                {/* Start Screen */}
                {!gameStarted && !isGameLoading && (
                  <div className="text-center space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Willkommen zum Lösungs-Spiel! Du bekommst Fragen, die im echten Leben passieren könnten – 
                      manche sind lustig, andere knifflig. Wähle die Antwort, die dabei hilft, das Problem gut zu lösen.
                    </p>
                    <Button 
                      onClick={loadQuestions}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Spiel starten
                    </Button>
                  </div>
                )}

                {/* Question Display */}
                {gameStarted && !gameCompleted && currentQuestionData && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">
                        Frage {currentQuestion} von {questions.length}
                      </span>
                    </div>
                    
                    <p className="text-lg font-bold text-foreground leading-relaxed">
                      {currentQuestionData.question}
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleAnswerSelect('A')}
                        className={`w-full p-4 text-left border rounded-lg transition-all duration-200 flex items-start gap-3 ${
                          selectedAnswer === 'A' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          selectedAnswer === 'A' ? 'bg-primary' : 'bg-muted-foreground'
                        }`}>
                          ★
                        </div>
                        <span className="text-foreground flex-1">{currentQuestionData.answerA}</span>
                      </button>

                      <button
                        onClick={() => handleAnswerSelect('B')}
                        className={`w-full p-4 text-left border rounded-lg transition-all duration-200 flex items-start gap-3 ${
                          selectedAnswer === 'B' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          selectedAnswer === 'B' ? 'bg-primary' : 'bg-muted-foreground'
                        }`}>
                          ★
                        </div>
                        <span className="text-foreground flex-1">{currentQuestionData.answerB}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Results Screen */}
                {showResults && (
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Super gemacht!</h2>
                    <p className="text-lg text-muted-foreground">
                      Du hast {solutionOrientedAnswers} von {questions.length} Fragen lösungsorientiert beantwortet.
                    </p>
                    
                    <div className="bg-primary/10 p-6 rounded-lg">
                      <div className="text-6xl mb-4">
                        {solutionOrientedAnswers >= questions.length * 0.8 ? '🎉' : 
                         solutionOrientedAnswers >= questions.length * 0.6 ? '👍' : '💪'}
                      </div>
                      <p className="text-foreground font-semibold">
                        {solutionOrientedAnswers >= questions.length * 0.8 ? 'Ausgezeichnet! Du bist ein echter Lösungsprofi!' :
                         solutionOrientedAnswers >= questions.length * 0.6 ? 'Gut gemacht! Du denkst bereits lösungsorientiert!' :
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

                {/* Navigation Buttons */}
                {gameStarted && !gameCompleted && (
                  <div className="flex justify-between items-center mt-8 gap-4">
                    <Button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 1}
                      variant="outline"
                    >
                      Zurück
                    </Button>
                    
                    <Button
                      onClick={handleNext}
                      disabled={!selectedAnswer}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {currentQuestion === questions.length ? 'Auswertung' : 'Weiter'}
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

export default Denkweiser;