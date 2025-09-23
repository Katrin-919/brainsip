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
  responses: {
    [key in 'green' | 'yellow' | 'red']: {
      feedback: string;
      strategy: string;
    };
  };
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
      responses: {
        green: {
          feedback: "Toll, dass du ruhig bleibst! Das zeigt, dass du sehr stark bist.",
          strategy: "Bleib ruhig und erkläre freundlich, dass es dein Spielzeug ist."
        },
        yellow: {
          feedback: "Es ist völlig normal, aufgeregt zu werden! Das zeigt, dass dir das Spielzeug wichtig ist.",
          strategy: "Atme einmal tief durch und erkläre dann ruhig, dass es dein Spielzeug ist."
        },
        red: {
          feedback: "Wut ist ein völlig normales Gefühl! Es zeigt, dass dir etwas wichtig ist.",
          strategy: "Atme 3-mal tief ein und aus. Dann kannst du ruhig sagen: 'Das ist mein Spielzeug, bitte gib es mir zurück.'"
        }
      }
    },
    {
      text: "Du bekommst ein tolles Geschenk",
      responses: {
        green: {
          feedback: "Wie schön, dass du dich ruhig freust! Das ist ein wunderbares Gefühl.",
          strategy: "Genieße dieses schöne Gefühl und vergiss nicht, 'Danke' zu sagen."
        },
        yellow: {
          feedback: "Aufregung bei Geschenken ist toll! Das zeigt, wie sehr du dich freust.",
          strategy: "Lass die Aufregung zu, aber vergiss nicht, dich zu bedanken!"
        },
        red: {
          feedback: "Manchmal kann Freude auch sehr überwältigend sein - das ist okay!",
          strategy: "Atme tief durch und lass die Freude langsam wirken. Vergiss nicht, 'Danke' zu sagen."
        }
      }
    },
    {
      text: "Morgen schreibst du eine wichtige Klassenarbeit",
      responses: {
        green: {
          feedback: "Super, dass du so ruhig bist! Das zeigt, dass du gut vorbereitet bist.",
          strategy: "Bleib entspannt und vertraue auf dein Können."
        },
        yellow: {
          feedback: "Ein bisschen Aufregung vor Tests ist völlig normal und kann sogar helfen!",
          strategy: "Bereite dich gut vor, dann atmest du tief durch und sagst dir: 'Ich schaffe das!'"
        },
        red: {
          feedback: "Nervosität vor Tests kennt jeder! Das zeigt, dass dir gute Noten wichtig sind.",
          strategy: "Atme tief durch, bereite dich gut vor und denk daran: Du hast schon viel gelernt!"
        }
      }
    },
    {
      text: "Dein bester Freund ist heute krank und kann nicht spielen",
      responses: {
        green: {
          feedback: "Schön, dass du so verständnisvoll bist! Das zeigt, was für ein guter Freund du bist.",
          strategy: "Du kannst deinem Freund eine schöne Nachricht schreiben oder ihm ein Bild malen."
        },
        yellow: {
          feedback: "Enttäuschung ist völlig normal! Das zeigt, wie gerne du mit deinem Freund spielst.",
          strategy: "Du kannst deinem Freund eine schöne Nachricht schreiben oder ihm ein Bild malen."
        },
        red: {
          feedback: "Traurigkeit ist okay! Das zeigt, wie wichtig dir dein Freund ist.",
          strategy: "Lass die Traurigkeit zu, aber denk auch daran: Bald ist dein Freund wieder gesund!"
        }
      }
    },
    {
      text: "Du hilfst deiner Oma beim Kochen",
      responses: {
        green: {
          feedback: "Wie wunderbar! Helfen macht uns glücklich und ruhig.",
          strategy: "Sei stolz auf dich - du hilfst gerne und das ist wunderbar!"
        },
        yellow: {
          feedback: "Aufregung beim Helfen ist toll! Das zeigt, wie gerne du hilfst.",
          strategy: "Lass die Aufregung zu - es ist schön zu helfen!"
        },
        red: {
          feedback: "Manchmal kann Kochen auch stressig sein - das ist völlig normal!",
          strategy: "Atme durch und denk daran: Du hilfst gerade jemandem, den du lieb hast!"
        }
      }
    },
    {
      text: "Jemand ärgert dich in der Pause",
      responses: {
        green: {
          feedback: "Toll, dass du so ruhig bleibst! Das zeigt echte Stärke.",
          strategy: "Bleib so ruhig und gehe weg von der Person, wenn es dir nicht gut tut."
        },
        yellow: {
          feedback: "Unruhe beim Ärgern ist normal! Das zeigt, dass du merkst, wenn etwas nicht okay ist.",
          strategy: "Gehe weg von der Person und hole dir Hilfe von einem Erwachsenen."
        },
        red: {
          feedback: "Wut beim Geärgert-werden ist völlig normal! Das zeigt, dass du dich selbst schützen willst.",
          strategy: "Gehe weg von der Person, atme tief durch und hole dir Hilfe von einem Erwachsenen."
        }
      }
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
    
    // Every answer gets points for emotional awareness
    setScore(score + 20);
    toast.success("Gut erkannt! Jedes Gefühl ist wichtig! 🎉");
    
    setTimeout(() => {
      setQuestionCount(questionCount + 1);
      startNewRound();
    }, 4000);
  };

  const completeGameLogic = async () => {
    setGameCompleted(true);
    const success = true; // Always success - it's about awareness, not correctness
    
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
                    
                    return (
                      <Button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        disabled={showResult}
                        className={`
                          w-32 h-32 rounded-full text-sm font-bold transition-all duration-300 p-2
                          ${colorInfo.bgColor} ${colorInfo.textColor}
                          ${isSelected ? 'ring-4 ring-blue-400 scale-110' : ''}
                          hover:scale-105 disabled:cursor-not-allowed
                        `}
                      >
                        <div className="text-center leading-tight">
                          <div className="font-bold text-base">{colorInfo.name}</div>
                          <div className="text-xs mt-1 whitespace-normal">{colorInfo.meaning}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Result */}
              {showResult && selectedColor && currentSituation && (
                <Card className="p-6 bg-muted/50">
                  <CardContent className="text-center space-y-4">
                    <h3 className="text-lg font-bold">
                      Toll! 🎉
                    </h3>
                    <p className="text-muted-foreground">
                      {currentSituation.responses[selectedColor as 'green' | 'yellow' | 'red'].feedback}
                    </p>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h4 className="font-bold text-primary mb-2">💡 Ferdy's Tipp:</h4>
                      <p className="text-sm">{currentSituation.responses[selectedColor as 'green' | 'yellow' | 'red'].strategy}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : gameCompleted ? (
            <Card className="p-8 text-center">
              <CardContent className="space-y-6">
                <h2 className="text-2xl font-bold">Spiel beendet! 🎉</h2>
                <div className="text-lg">
                  <p>Du hast <span className="font-bold text-primary">{score} Punkte</span> gesammelt!</p>
                  <p className="mt-2">
                    "Fantastisch! Du hast deine Gefühle erkannt und gelernt, wie du mit ihnen umgehen kannst! 🌟 Jedes Gefühl ist wichtig und richtig."
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