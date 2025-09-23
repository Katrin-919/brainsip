import { useState, useEffect } from "react";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { useGameProgress } from "@/hooks/useGameProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Situation {
  text: string;
  correctColor: 'green' | 'yellow' | 'red';
  explanation: string;
  strategy?: string;
}

const Gefuehlsampel = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { completeGame } = useGameProgress();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";

  const [currentSituation, setCurrentSituation] = useState<Situation | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const situations: Situation[] = [
    {
      text: "Jemand nimmt dir dein Lieblingsspielzeug weg",
      correctColor: "red",
      explanation: "Das macht dich sicher wütend oder traurig - das ist völlig normal!",
      strategy: "Atme 3-mal tief ein und aus. Dann kannst du ruhig sagen: 'Das ist mein Spielzeug, bitte gib es mir zurück.'"
    },
    {
      text: "Du bekommst ein tolles Geschenk",
      correctColor: "green",
      explanation: "Geschenke machen uns glücklich und ruhig - wie schön!",
      strategy: "Genieße dieses schöne Gefühl und vergiss nicht, 'Danke' zu sagen."
    },
    {
      text: "Morgen schreibst du eine wichtige Klassenarbeit",
      correctColor: "yellow",
      explanation: "Es ist normal, vor Tests etwas aufgeregt zu sein.",
      strategy: "Bereite dich gut vor, dann atmest du tief durch und sagst dir: 'Ich schaffe das!'"
    },
    {
      text: "Dein bester Freund ist heute krank und kann nicht spielen",
      correctColor: "yellow",
      explanation: "Enttäuschung macht uns oft unruhig und traurig.",
      strategy: "Du kannst deinem Freund eine schöne Nachricht schreiben oder malen ihm ein Bild."
    },
    {
      text: "Du hilfst deiner Oma beim Kochen",
      correctColor: "green",
      explanation: "Anderen zu helfen macht uns glücklich und zufrieden.",
      strategy: "Sei stolz auf dich - du hilfst gerne und das ist wunderbar!"
    },
    {
      text: "Jemand ärgert dich in der Pause",
      correctColor: "red",
      explanation: "Ärgern macht uns wütend und manchmal auch traurig.",
      strategy: "Gehe weg von der Person, atme tief durch und hole dir Hilfe von einem Erwachsenen."
    }
  ];

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    startNewRound();
  }, [user, loading, navigate]);

  const startNewRound = () => {
    if (questionCount >= 5) {
      completeGameLogic();
      return;
    }
    
    const randomSituation = situations[Math.floor(Math.random() * situations.length)];
    setCurrentSituation(randomSituation);
    setSelectedColor(null);
    setShowResult(false);
  };

  const handleColorSelect = (color: string) => {
    if (showResult) return;
    
    setSelectedColor(color);
    setShowResult(true);
    
    if (color === currentSituation?.correctColor) {
      setScore(score + 20);
      toast.success("Richtig erkannt! 🎉");
    } else {
      toast.info("Nicht ganz richtig, aber gut versucht! 💪");
    }
    
    setTimeout(() => {
      setQuestionCount(questionCount + 1);
      startNewRound();
    }, 4000);
  };

  const completeGameLogic = async () => {
    setGameCompleted(true);
    const success = score >= 60; // 3 von 5 richtig
    
    const result = await completeGame({
      game_name: 'Gefühlsampel',
      game_category: 'emotional_intelligence',
      score: score,
      success: success
    });

    if (result.needsPayment) {
      // Handle payment flow if needed
      return;
    }
  };

  const resetGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameCompleted(false);
    startNewRound();
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

  const getColorInfo = (color: string) => {
    switch (color) {
      case 'green':
        return { name: 'Grün', meaning: 'Ruhig & Glücklich', bgColor: 'bg-green-500', textColor: 'text-white' };
      case 'yellow':
        return { name: 'Gelb', meaning: 'Aufgeregt & Unruhig', bgColor: 'bg-yellow-500', textColor: 'text-black' };
      case 'red':
        return { name: 'Rot', meaning: 'Wütend & Überdreht', bgColor: 'bg-red-500', textColor: 'text-white' };
      default:
        return { name: '', meaning: '', bgColor: '', textColor: '' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
      
      <main className="mt-20 px-4 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Gefühlsampel 🚦
            </h1>
            <p className="text-lg text-muted-foreground">
              Welche Farbe beschreibt dein Gefühl in dieser Situation?
            </p>
          </div>

          {!gameCompleted && currentSituation ? (
            <div className="space-y-8">
              {/* Progress */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Frage {questionCount + 1} von 5
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((questionCount + 1) / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm font-medium text-foreground mt-2">
                  Punkte: {score}
                </p>
              </div>

              {/* Situation */}
              <Card className="p-8 text-center">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">
                    {currentSituation.text}
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Traffic Light */}
              <div className="flex justify-center">
                <div className="bg-gray-800 rounded-3xl p-6 space-y-4">
                  {['red', 'yellow', 'green'].map((color) => {
                    const colorInfo = getColorInfo(color);
                    const isSelected = selectedColor === color;
                    const isCorrect = showResult && color === currentSituation.correctColor;
                    const isWrong = showResult && isSelected && color !== currentSituation.correctColor;
                    
                    return (
                      <Button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        disabled={showResult}
                        className={`
                          w-24 h-24 rounded-full text-lg font-bold transition-all duration-300
                          ${colorInfo.bgColor} ${colorInfo.textColor}
                          ${isSelected ? 'ring-4 ring-blue-400 scale-110' : ''}
                          ${isCorrect ? 'ring-4 ring-green-400 animate-pulse' : ''}
                          ${isWrong ? 'ring-4 ring-red-400' : ''}
                          hover:scale-105 disabled:cursor-not-allowed
                        `}
                      >
                        <div className="text-center">
                          <div className="text-sm">{colorInfo.name}</div>
                          <div className="text-xs">{colorInfo.meaning}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Result */}
              {showResult && (
                <Card className="p-6 bg-muted/50">
                  <CardContent className="text-center space-y-4">
                    <h3 className="text-lg font-bold">
                      {selectedColor === currentSituation.correctColor ? "Richtig! 🎉" : "Gut versucht! 💪"}
                    </h3>
                    <p className="text-muted-foreground">
                      {currentSituation.explanation}
                    </p>
                    {currentSituation.strategy && (
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h4 className="font-bold text-primary mb-2">💡 Ferdy's Tipp:</h4>
                        <p className="text-sm">{currentSituation.strategy}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : gameCompleted ? (
            <Card className="p-8 text-center">
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-bold">Spiel beendet! 🎉</h2>
                <div className="text-lg">
                  <p>Deine Punktzahl: <span className="font-bold text-primary">{score} von 100</span></p>
                  <p className="mt-2">
                    {score >= 80 ? "Fantastisch! Du kennst deine Gefühle sehr gut! 🌟" :
                     score >= 60 ? "Gut gemacht! Du verstehst deine Emotionen! 👍" :
                     "Das war ein guter Anfang! Übung macht den Meister! 💪"}
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame} size="lg">
                    Nochmal spielen
                  </Button>
                  <Button onClick={() => navigate('/emotionale-intelligenz')} variant="outline" size="lg">
                    Zurück zur Übersicht
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Gefuehlsampel;