import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FerdyHeader } from "@/components/FerdyHeader";
import { Loader2 } from "lucide-react";
import { useGameProgress } from "@/hooks/useGameProgress";

interface FacePart {
  id: string;
  type: 'eyes' | 'mouth' | 'eyebrows';
  emotion: string;
  x: number;
  y: number;
  placed: boolean;
  correctX: number;
  correctY: number;
}

interface Emotion {
  name: string;
  description: string;
  color: string;
  parts: {
    eyes: string;
    mouth: string;
    eyebrows: string;
  };
  feedback: string;
}

const emotions: Emotion[] = [
  {
    name: "Freude",
    description: "Ein fröhliches, glückliches Gefühl",
    color: "#FFD700",
    parts: {
      eyes: "😊",
      mouth: "😄",
      eyebrows: "😊"
    },
    feedback: "Super! Das ist Freude! Das siehst du an den lachenden Augen und dem breiten Lächeln."
  },
  {
    name: "Trauer",
    description: "Ein trauriges, niedergeschlagenes Gefühl",
    color: "#87CEEB",
    parts: {
      eyes: "😢",
      mouth: "😞",
      eyebrows: "😔"
    },
    feedback: "Richtig! Das ist Trauer. Die hängenden Mundwinkel und Tränen zeigen die Traurigkeit."
  },
  {
    name: "Wut",
    description: "Ein ärgerliches, zorniges Gefühl",
    color: "#FF6B6B",
    parts: {
      eyes: "😡",
      mouth: "😠",
      eyebrows: "😤"
    },
    feedback: "Genau! Das ist Wut! Die zusammengezogenen Augenbrauen und der grimmige Mund zeigen Ärger."
  },
  {
    name: "Überraschung",
    description: "Ein erstauntes, überraschtes Gefühl",
    color: "#98FB98",
    parts: {
      eyes: "😮",
      mouth: "😯",
      eyebrows: "😲"
    },
    feedback: "Perfekt! Das ist Überraschung! Die großen runden Augen und der offene Mund zeigen Erstaunen."
  }
];

const Gefuehlsradar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { completeGame } = useGameProgress();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";
  
  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [faceParts, setFaceParts] = useState<FacePart[]>([]);
  const [gamePhase, setGamePhase] = useState<'puzzle' | 'question' | 'feedback' | 'complete'>('puzzle');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedPart, setDraggedPart] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize face parts for current emotion
  useEffect(() => {
    if (currentEmotion < emotions.length) {
      const emotion = emotions[currentEmotion];
      const parts: FacePart[] = [
        {
          id: 'eyes',
          type: 'eyes',
          emotion: emotion.name,
          x: Math.random() * 200 + 50,
          y: Math.random() * 100 + 400,
          placed: false,
          correctX: 200,
          correctY: 120
        },
        {
          id: 'eyebrows',
          type: 'eyebrows',
          emotion: emotion.name,
          x: Math.random() * 200 + 350,
          y: Math.random() * 100 + 400,
          placed: false,
          correctX: 200,
          correctY: 80
        },
        {
          id: 'mouth',
          type: 'mouth',
          emotion: emotion.name,
          x: Math.random() * 200 + 650,
          y: Math.random() * 100 + 400,
          placed: false,
          correctX: 200,
          correctY: 200
        }
      ];
      setFaceParts(parts);
    }
  }, [currentEmotion]);

  // Check if puzzle is complete
  useEffect(() => {
    if (faceParts.length > 0 && faceParts.every(part => part.placed)) {
      setTimeout(() => {
        setGamePhase('question');
      }, 500);
    }
  }, [faceParts]);

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

  const handleDragStart = (e: React.DragEvent, partId: string) => {
    console.log('Drag started for:', partId);
    setDraggedPart(partId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', partId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('Drop event triggered');
    
    if (!draggedPart) {
      console.log('No dragged part found');
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      console.log('No canvas rect found');
      return;
    }

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log('Drop position:', x, y);

    setFaceParts(prev => prev.map(part => {
      if (part.id === draggedPart) {
        // Check if close to correct position (within 80px for easier targeting)
        const distanceX = Math.abs(x - part.correctX);
        const distanceY = Math.abs(y - part.correctY);
        console.log(`Distance for ${part.id}:`, distanceX, distanceY);
        
        if (distanceX < 80 && distanceY < 80) {
          // Snap to correct position
          console.log(`Snapping ${part.id} to correct position`);
          return { ...part, x: part.correctX, y: part.correctY, placed: true };
        } else {
          // Move to drop position
          console.log(`Moving ${part.id} to drop position`);
          return { ...part, x, y };
        }
      }
      return part;
    }));

    setDraggedPart(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('Drag ended');
    setDraggedPart(null);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === emotions[currentEmotion].name;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 25);
    }
    setGamePhase('feedback');
    setShowFeedback(true);
  };

  const handleNextRound = () => {
    if (currentEmotion < emotions.length - 1) {
      setCurrentEmotion(prev => prev + 1);
      setGamePhase('puzzle');
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Game complete
      setGamePhase('complete');
      if (user) {
        completeGame({
          game_name: "Gefühlsradar",
          game_category: "emotional_intelligence",
          score: score,
          success: true
        });
      }
    }
  };

  const getOtherEmotions = () => {
    const current = emotions[currentEmotion].name;
    const others = emotions.filter(e => e.name !== current).map(e => e.name);
    return [current, ...others.slice(0, 2)].sort(() => Math.random() - 0.5);
  };

  if (gamePhase === 'complete') {
    return (
      <div className="min-h-screen bg-background">
        <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
        
        <main className="mt-20 px-4 md:px-12 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="p-8 ferdy-shadow-card">
              <div className="space-y-6">
                <div className="text-6xl">🎉</div>
                <h1 className="text-3xl font-bold text-foreground">Fantastisch!</h1>
                <p className="text-lg text-muted-foreground">
                  Du hast alle Gefühl-Puzzles gelöst und dabei {score} Punkte gesammelt!
                </p>
                <p className="text-foreground">
                  Du bist jetzt ein echter Experte im Erkennen von Gefühlen. 
                  Weiter so!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.location.reload()}>
                    Nochmal spielen
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/emotionale-intelligenz')}>
                    Zurück zur Übersicht
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
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
                    <span className="text-2xl">🧩</span>
                    <h3 className="text-lg font-bold text-foreground">Gefühl-Puzzle</h3>
                  </div>
                  
                  <h2 className="text-xl font-bold text-foreground">Wie funktioniert's?</h2>
                  
                  <p className="text-muted-foreground">
                    Ziehe die Gesichtsteile auf Ferdy, um ein Gefühl zu zeigen. 
                    Dann erkenne das Gefühl!
                  </p>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">Spielregeln</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ziehe Augen, Mund und Augenbrauen auf das Gesicht</li>
                      <li>• Die Teile "schnappen" automatisch ein</li>
                      <li>• Erkenne das fertige Gefühl</li>
                      <li>• Sammle Punkte für richtige Antworten</li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span>🎯</span>
                      <span className="font-semibold text-foreground">Fortschritt</span>
                    </div>
                    <p className="text-sm text-foreground">
                      Puzzle {currentEmotion + 1} von {emotions.length}
                    </p>
                    <p className="text-sm text-foreground">
                      Punkte: {score}
                    </p>
                  </div>

                  <Button 
                    onClick={() => navigate('/emotionale-intelligenz')}
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
                {gamePhase === 'puzzle' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-foreground mb-4">
                        Baue das Gesicht zusammen
                      </h1>
                      <p className="text-muted-foreground">
                        Ziehe die Teile auf Ferdys Gesicht, um ein Gefühl zu zeigen
                      </p>
                    </div>

                    {/* Game Canvas */}
                    <div 
                      ref={canvasRef}
                      className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl min-h-[500px] overflow-hidden"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      style={{ 
                        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><circle cx="200" cy="150" r="80" fill="%23FF8C42" stroke="%23FF6B1A" stroke-width="3"/></svg>')`,
                        backgroundSize: '400px 300px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center 20px'
                      }}
                    >
                      {/* Ferdy's base face */}
                      <div className="absolute inset-0 flex items-start justify-center pt-20">
                        <div className="relative">
                          {/* Face outline */}
                          <div className="w-32 h-32 bg-orange-400 rounded-full border-4 border-orange-600 relative">
                            {/* Ears */}
                            <div className="absolute -top-4 -left-2 w-6 h-8 bg-orange-400 rounded-full border-2 border-orange-600 transform -rotate-12"></div>
                            <div className="absolute -top-4 -right-2 w-6 h-8 bg-orange-400 rounded-full border-2 border-orange-600 transform rotate-12"></div>
                            
                            {/* Nose */}
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black rounded-full"></div>
                            
                            {/* Drop zones (invisible) */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-8 border-2 border-dashed border-gray-400 rounded opacity-50"></div>
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-4 border-2 border-dashed border-gray-400 rounded opacity-50"></div>
                            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-10 h-6 border-2 border-dashed border-gray-400 rounded opacity-50"></div>
                          </div>
                        </div>
                      </div>

                      {/* Face parts */}
                      {faceParts.map(part => (
                        <div
                          key={part.id}
                          className={`absolute cursor-move transition-all duration-300 ${
                            part.placed ? 'scale-110' : 'hover:scale-105'
                          }`}
                          style={{
                            left: part.x,
                            top: part.y,
                            transform: part.placed ? 'scale(1.1)' : 'scale(1)'
                          }}
                          draggable={!part.placed}
                          onDragStart={(e) => handleDragStart(e, part.id)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className={`text-3xl p-2 rounded-lg bg-white/80 shadow-lg border-2 ${
                            part.placed ? 'border-green-500 bg-green-50' : 'border-gray-300'
                          }`}>
                            {emotions[currentEmotion].parts[part.type]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {gamePhase === 'question' && (
                  <div className="space-y-6 text-center">
                    <h2 className="text-2xl font-bold text-foreground">
                      Welches Gefühl siehst du?
                    </h2>
                    
                    {/* Show completed face */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-orange-400 rounded-full border-4 border-orange-600 relative">
                          <div className="absolute -top-4 -left-2 w-6 h-8 bg-orange-400 rounded-full border-2 border-orange-600 transform -rotate-12"></div>
                          <div className="absolute -top-4 -right-2 w-6 h-8 bg-orange-400 rounded-full border-2 border-orange-600 transform rotate-12"></div>
                          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black rounded-full"></div>
                          
                          {/* Placed parts */}
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl">
                            {emotions[currentEmotion].parts.eyebrows}
                          </div>
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-2xl">
                            {emotions[currentEmotion].parts.eyes}
                          </div>
                          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-2xl">
                            {emotions[currentEmotion].parts.mouth}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                      {getOtherEmotions().map((emotion, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswerSelect(emotion)}
                          variant="outline"
                          className="text-lg py-6 hover:scale-105 transition-all duration-200"
                          style={{
                            backgroundColor: selectedAnswer === emotion ? emotions.find(e => e.name === emotion)?.color + '20' : undefined
                          }}
                        >
                          {emotion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {gamePhase === 'feedback' && showFeedback && (
                  <div className="space-y-6 text-center">
                    <div className={`text-6xl ${isCorrect ? 'animate-bounce' : 'animate-pulse'}`}>
                      {isCorrect ? '🎉' : '🤔'}
                    </div>
                    
                    <h2 className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                      {isCorrect ? 'Richtig!' : 'Nicht ganz...'}
                    </h2>
                    
                    <p className="text-lg text-foreground max-w-2xl mx-auto">
                      {isCorrect 
                        ? emotions[currentEmotion].feedback
                        : `Das war ${emotions[currentEmotion].name}. ${emotions[currentEmotion].feedback}`
                      }
                    </p>

                    {isCorrect && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 font-semibold">+25 Punkte!</p>
                      </div>
                    )}

                    <Button 
                      onClick={handleNextRound}
                      size="lg"
                      className="px-8"
                    >
                      {currentEmotion < emotions.length - 1 ? 'Nächstes Puzzle' : 'Spiel beenden'}
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

export default Gefuehlsradar;