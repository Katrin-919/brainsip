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
  feedback: string;
}

// SVG Face Parts Components
const EyesComponent = ({ emotion }: { emotion: string }) => {
  switch (emotion) {
    case "Freude":
      return (
        <svg width="50" height="25" viewBox="0 0 50 25">
          <circle cx="12" cy="12" r="8" fill="#4A5568" />
          <circle cx="38" cy="12" r="8" fill="#4A5568" />
          <circle cx="12" cy="12" r="3" fill="white" />
          <circle cx="38" cy="12" r="3" fill="white" />
          <path d="M 4 8 Q 12 4 20 8" stroke="#2D3748" strokeWidth="2" fill="none" />
          <path d="M 30 8 Q 38 4 46 8" stroke="#2D3748" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Trauer":
      return (
        <svg width="50" height="30" viewBox="0 0 50 30">
          <circle cx="12" cy="15" r="8" fill="#4A5568" />
          <circle cx="38" cy="15" r="8" fill="#4A5568" />
          <circle cx="12" cy="15" r="3" fill="white" />
          <circle cx="38" cy="15" r="3" fill="white" />
          <path d="M 12 23 L 14 28" stroke="#6B9BD2" strokeWidth="2" />
          <path d="M 38 23 L 40 28" stroke="#6B9BD2" strokeWidth="2" />
        </svg>
      );
    case "Wut":
      return (
        <svg width="50" height="25" viewBox="0 0 50 25">
          <circle cx="12" cy="12" r="6" fill="#E53E3E" />
          <circle cx="38" cy="12" r="6" fill="#E53E3E" />
          <circle cx="12" cy="12" r="2" fill="white" />
          <circle cx="38" cy="12" r="2" fill="white" />
        </svg>
      );
    case "Überraschung":
      return (
        <svg width="50" height="30" viewBox="0 0 50 30">
          <circle cx="12" cy="15" r="10" fill="#4A5568" />
          <circle cx="38" cy="15" r="10" fill="#4A5568" />
          <circle cx="12" cy="15" r="5" fill="white" />
          <circle cx="38" cy="15" r="5" fill="white" />
          <circle cx="12" cy="15" r="2" fill="black" />
          <circle cx="38" cy="15" r="2" fill="black" />
        </svg>
      );
    case "Müdigkeit":
      return (
        <svg width="50" height="20" viewBox="0 0 50 20">
          <path d="M 2 10 Q 12 15 22 10" stroke="#4A5568" strokeWidth="3" fill="none" />
          <path d="M 28 10 Q 38 15 48 10" stroke="#4A5568" strokeWidth="3" fill="none" />
        </svg>
      );
    case "Verwirrung":
      return (
        <svg width="50" height="25" viewBox="0 0 50 25">
          <circle cx="12" cy="12" r="6" fill="#4A5568" />
          <circle cx="38" cy="12" r="8" fill="#4A5568" />
          <circle cx="12" cy="12" r="2" fill="white" />
          <circle cx="38" cy="12" r="4" fill="white" />
        </svg>
      );
    default:
      return <div className="w-12 h-6 bg-gray-400 rounded"></div>;
  }
};

const MouthComponent = ({ emotion }: { emotion: string }) => {
  switch (emotion) {
    case "Freude":
      return (
        <svg width="40" height="25" viewBox="0 0 40 25">
          <path d="M 5 8 Q 20 20 35 8" stroke="#2D3748" strokeWidth="3" fill="none" />
          <path d="M 8 10 Q 20 18 32 10" stroke="#E53E3E" strokeWidth="2" fill="#E53E3E" />
        </svg>
      );
    case "Trauer":
      return (
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path d="M 5 15 Q 15 5 25 15" stroke="#2D3748" strokeWidth="3" fill="none" />
        </svg>
      );
    case "Wut":
      return (
        <svg width="35" height="15" viewBox="0 0 35 15">
          <path d="M 5 10 L 30 10" stroke="#2D3748" strokeWidth="4" />
          <path d="M 8 6 L 15 10 L 8 14" stroke="#2D3748" strokeWidth="2" fill="none" />
          <path d="M 27 6 L 20 10 L 27 14" stroke="#2D3748" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Überraschung":
      return (
        <svg width="25" height="30" viewBox="0 0 25 30">
          <ellipse cx="12.5" cy="15" rx="10" ry="12" stroke="#2D3748" strokeWidth="3" fill="#2D3748" />
          <ellipse cx="12.5" cy="15" rx="6" ry="8" fill="#E53E3E" />
        </svg>
      );
    case "Müdigkeit":
      return (
        <svg width="30" height="15" viewBox="0 0 30 15">
          <path d="M 5 10 L 25 10" stroke="#2D3748" strokeWidth="2" />
        </svg>
      );
    case "Verwirrung":
      return (
        <svg width="25" height="25" viewBox="0 0 25 25">
          <path d="M 5 15 Q 12.5 8 20 15 Q 12.5 22 5 15" stroke="#2D3748" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Banane":
      return (
        <svg width="40" height="15" viewBox="0 0 40 15">
          <path d="M 5 7 Q 20 2 35 10" stroke="#FFD700" strokeWidth="6" fill="none" />
          <circle cx="30" cy="9" r="1" fill="#8B4513" />
        </svg>
      );
    case "Regenbogen":
      return (
        <svg width="40" height="20" viewBox="0 0 40 20">
          <path d="M 5 15 Q 20 5 35 15" stroke="#FF0000" strokeWidth="2" fill="none" />
          <path d="M 7 16 Q 20 8 33 16" stroke="#FFA500" strokeWidth="2" fill="none" />
          <path d="M 9 17 Q 20 11 31 17" stroke="#FFFF00" strokeWidth="2" fill="none" />
        </svg>
      );
    default:
      return <div className="w-8 h-4 bg-gray-400 rounded"></div>;
  }
};

const EyebrowsComponent = ({ emotion }: { emotion: string }) => {
  switch (emotion) {
    case "Freude":
      return (
        <svg width="60" height="15" viewBox="0 0 60 15">
          <path d="M 5 12 Q 15 5 25 8" stroke="#8B4513" strokeWidth="3" fill="none" />
          <path d="M 35 8 Q 45 5 55 12" stroke="#8B4513" strokeWidth="3" fill="none" />
        </svg>
      );
    case "Trauer":
      return (
        <svg width="60" height="15" viewBox="0 0 60 15">
          <path d="M 5 8 Q 15 12 25 10" stroke="#8B4513" strokeWidth="3" fill="none" />
          <path d="M 35 10 Q 45 12 55 8" stroke="#8B4513" strokeWidth="3" fill="none" />
        </svg>
      );
    case "Wut":
      return (
        <svg width="60" height="20" viewBox="0 0 60 20">
          <path d="M 5 15 L 25 5" stroke="#8B4513" strokeWidth="4" />
          <path d="M 35 5 L 55 15" stroke="#8B4513" strokeWidth="4" />
        </svg>
      );
    case "Überraschung":
      return (
        <svg width="60" height="15" viewBox="0 0 60 15">
          <path d="M 5 10 Q 15 3 25 5" stroke="#8B4513" strokeWidth="3" fill="none" />
          <path d="M 35 5 Q 45 3 55 10" stroke="#8B4513" strokeWidth="3" fill="none" />
        </svg>
      );
    case "Müdigkeit":
      return (
        <svg width="60" height="12" viewBox="0 0 60 12">
          <path d="M 5 9 Q 15 6 25 9" stroke="#8B4513" strokeWidth="2" fill="none" />
          <path d="M 35 9 Q 45 6 55 9" stroke="#8B4513" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Verwirrung":
      return (
        <svg width="60" height="18" viewBox="0 0 60 18">
          <path d="M 5 10 Q 15 6 25 12" stroke="#8B4513" strokeWidth="3" fill="none" />
          <path d="M 35 12 Q 45 8 55 6" stroke="#8B4513" strokeWidth="3" fill="none" />
        </svg>
      );
    case "Hut":
      return (
        <svg width="60" height="20" viewBox="0 0 60 20">
          <rect x="10" y="5" width="40" height="4" fill="#654321" />
          <rect x="20" y="1" width="20" height="8" fill="#8B4513" />
          <circle cx="30" cy="3" r="2" fill="#FFD700" />
        </svg>
      );
    case "Sonnenbrille":
      return (
        <svg width="60" height="15" viewBox="0 0 60 15">
          <rect x="5" y="6" width="20" height="8" rx="4" fill="#333" />
          <rect x="35" y="6" width="20" height="8" rx="4" fill="#333" />
          <path d="M 25 10 L 35 10" stroke="#333" strokeWidth="2" />
        </svg>
      );
    default:
      return <div className="w-12 h-3 bg-gray-400 rounded"></div>;
  }
};

const emotions: Emotion[] = [
  {
    name: "Freude",
    description: "Ein fröhliches, glückliches Gefühl",
    color: "#FFD700",
    feedback: "Super! Das ist Freude! Das siehst du an den lachenden Augen und dem breiten Lächeln."
  },
  {
    name: "Trauer",
    description: "Ein trauriges, niedergeschlagenes Gefühl",
    color: "#87CEEB",
    feedback: "Richtig! Das ist Trauer. Die hängenden Mundwinkel und Tränen zeigen die Traurigkeit."
  },
  {
    name: "Wut",
    description: "Ein ärgerliches, zorniges Gefühl",
    color: "#FF6B6B",
    feedback: "Genau! Das ist Wut! Die zusammengezogenen Augenbrauen und der grimmige Mund zeigen Ärger."
  },
  {
    name: "Überraschung",
    description: "Ein erstauntes, überraschtes Gefühl",
    color: "#98FB98",
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
  const pointerDragIdRef = useRef<string | null>(null);
  const pointerOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // Drop zone refs for precise snapping
  const eyebrowsZoneRef = useRef<HTMLDivElement>(null);
  const eyesZoneRef = useRef<HTMLDivElement>(null);
  const mouthZoneRef = useRef<HTMLDivElement>(null);
  const partRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Initialize face parts for current emotion
  useEffect(() => {
    // Set page title for better context
    document.title = "Gefühlsradar: Gesichtspuzzle Emotionen";

    if (currentEmotion < emotions.length) {
      const correctEmotion = emotions[currentEmotion].name;
      
      // Create all available parts for more fun selection
      const allParts: FacePart[] = [
        // Correct parts for current emotion
        {
          id: `eyes-${correctEmotion}`,
          type: 'eyes',
          emotion: correctEmotion,
          x: 50,
          y: 480,
          placed: false,
          correctX: 307,
          correctY: 180
        },
        {
          id: `eyebrows-${correctEmotion}`,
          type: 'eyebrows',
          emotion: correctEmotion,
          x: 150,
          y: 480,
          placed: false,
          correctX: 302,
          correctY: 140
        },
        {
          id: `mouth-${correctEmotion}`,
          type: 'mouth',
          emotion: correctEmotion,
          x: 250,
          y: 480,
          placed: false,
          correctX: 316,
          correctY: 240
        },
        // Different eye variations
        {
          id: 'eyes-sad',
          type: 'eyes',
          emotion: 'Trauer',
          x: 350,
          y: 480,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyes-angry',
          type: 'eyes',
          emotion: 'Wut',
          x: 450,
          y: 480,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyes-tired',
          type: 'eyes',
          emotion: 'Müdigkeit',
          x: 550,
          y: 480,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyes-confused',
          type: 'eyes',
          emotion: 'Verwirrung',
          x: 650,
          y: 480,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        // Different mouth variations
        {
          id: 'mouth-sad',
          type: 'mouth',
          emotion: 'Trauer',
          x: 50,
          y: 540,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'mouth-angry',
          type: 'mouth',
          emotion: 'Wut',
          x: 150,
          y: 540,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'mouth-surprised',
          type: 'mouth',
          emotion: 'Überraschung',
          x: 250,
          y: 540,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'mouth-tired',
          type: 'mouth',
          emotion: 'Müdigkeit',
          x: 350,
          y: 540,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'mouth-confused',
          type: 'mouth',
          emotion: 'Verwirrung',
          x: 450,
          y: 540,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'mouth-banana',
          type: 'mouth',
          emotion: 'Banane',
          x: 550,
          y: 540,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'mouth-rainbow',
          type: 'mouth',
          emotion: 'Regenbogen',
          x: 650,
          y: 540,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        // Different eyebrow variations
        {
          id: 'eyebrows-sad',
          type: 'eyebrows',
          emotion: 'Trauer',
          x: 50,
          y: 600,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyebrows-angry',
          type: 'eyebrows',
          emotion: 'Wut',
          x: 150,
          y: 600,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyebrows-surprised',
          type: 'eyebrows',
          emotion: 'Überraschung',
          x: 250,
          y: 600,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyebrows-tired',
          type: 'eyebrows',
          emotion: 'Müdigkeit',
          x: 350,
          y: 600,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyebrows-confused',
          type: 'eyebrows',
          emotion: 'Verwirrung',
          x: 450,
          y: 600,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyebrows-hat',
          type: 'eyebrows',
          emotion: 'Hut',
          x: 550,
          y: 600,
          placed: false,
          correctX: 0,
          correctY: 0
        },
        {
          id: 'eyebrows-sunglasses',
          type: 'eyebrows',
          emotion: 'Sonnenbrille',
          x: 650,
          y: 600,
          placed: false,
          correctX: 0,
          correctY: 0
        }
      ];
      
      setFaceParts(allParts);
    }
  }, [currentEmotion]);

  // Check if puzzle is complete (only correct parts need to be placed)
  useEffect(() => {
    const correctEmotion = emotions[currentEmotion].name;
    const correctParts = faceParts.filter(part => 
      part.emotion === correctEmotion && 
      (part.id.includes(`eyes-${correctEmotion}`) || 
       part.id.includes(`eyebrows-${correctEmotion}`) || 
       part.id.includes(`mouth-${correctEmotion}`))
    );
    
    if (correctParts.length === 3 && correctParts.every(part => part.placed)) {
      setTimeout(() => {
        setGamePhase('question');
      }, 500);
    }
  }, [faceParts, currentEmotion]);

  // Pointer/touch support
  const handlePointerDown = (e: React.PointerEvent, partId: string) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const part = faceParts.find(p => p.id === partId);
    if (!part || part.placed) return;
    
    e.preventDefault();
    pointerDragIdRef.current = partId;
    setDraggedPart(partId);
    
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    pointerOffsetRef.current = { dx: pointerX - part.x, dy: pointerY - part.y };
  };

  // Global pointer events for reliable dragging
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const draggingId = pointerDragIdRef.current;
      if (!draggingId) return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = Math.max(0, Math.min(rect.width - 80, e.clientX - rect.left - pointerOffsetRef.current.dx));
      const y = Math.max(0, Math.min(rect.height - 80, e.clientY - rect.top - pointerOffsetRef.current.dy));
      
      setFaceParts(prev => prev.map(part => (
        part.id === draggingId && !part.placed ? { ...part, x, y } : part
      )));
    };

    const handleUp = (e: PointerEvent) => {
      const draggingId = pointerDragIdRef.current;
      pointerDragIdRef.current = null;
      if (!draggingId) return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const partEl = partRefs.current[draggingId] || null;
      const partElRect = partEl?.getBoundingClientRect();
      
      setFaceParts(prev => prev.map(part => {
        if (part.id !== draggingId) return part;
        
      // Check if this part should be placed (correct emotion and type)
      const correctEmotion = emotions[currentEmotion].name;
      const isCorrectPart = part.emotion === correctEmotion && 
        (part.id.includes(`eyes-${correctEmotion}`) || 
         part.id.includes(`eyebrows-${correctEmotion}`) || 
         part.id.includes(`mouth-${correctEmotion}`));
      
      if (!isCorrectPart) {
        // Wrong part - just update position
        const boundedX = Math.max(0, Math.min(rect.width - 80, e.clientX - rect.left - pointerOffsetRef.current.dx));
        const boundedY = Math.max(0, Math.min(rect.height - 80, e.clientY - rect.top - pointerOffsetRef.current.dy));
        return { ...part, x: boundedX, y: boundedY };
      }

      // Determine correct drop zone element for this part
      const zoneEl = part.type === 'eyes' ? eyesZoneRef.current : part.type === 'eyebrows' ? eyebrowsZoneRef.current : mouthZoneRef.current;
      const zoneRect = zoneEl?.getBoundingClientRect();
      if (zoneRect) {
        // Use the center of the dragged part to test if it's inside the correct zone
        const cx = partElRect ? partElRect.left + partElRect.width / 2 : e.clientX;
        const cy = partElRect ? partElRect.top + partElRect.height / 2 : e.clientY;
        const inside = cx >= zoneRect.left && cx <= zoneRect.right && cy >= zoneRect.top && cy <= zoneRect.bottom;
        if (inside) {
          const centerX = zoneRect.left - rect.left + zoneRect.width / 2;
          const centerY = zoneRect.top - rect.top + zoneRect.height / 2;
          const halfW = partElRect ? partElRect.width / 2 : 20;
          const halfH = partElRect ? partElRect.height / 2 : 12;
          const newX = centerX - halfW;
          const newY = centerY - halfH;
          return { ...part, x: newX, y: newY, correctX: newX, correctY: newY, placed: true };
        }
      }
        const boundedX = Math.max(0, Math.min(rect.width - 80, e.clientX - rect.left - pointerOffsetRef.current.dx));
        const boundedY = Math.max(0, Math.min(rect.height - 80, e.clientY - rect.top - pointerOffsetRef.current.dy));
        return { ...part, x: boundedX, y: boundedY };
      }));
      
      setDraggedPart(null);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    
    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
  }, []);

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
                      className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl min-h-[600px] overflow-hidden touch-none select-none"
                    >
                      {/* Ferdy's base face */}
                      <div className="absolute inset-0 flex items-start justify-center pt-10">
                        <div className="relative">
                          <div className="w-80 h-80 bg-orange-400 rounded-full border-4 border-orange-600 relative">
                            {/* Ears */}
                            <div className="absolute -top-6 -left-4 w-12 h-16 bg-orange-400 rounded-full border-2 border-orange-600 transform -rotate-12"></div>
                            <div className="absolute -top-6 -right-4 w-12 h-16 bg-orange-400 rounded-full border-2 border-orange-600 transform rotate-12"></div>
                            
                            {/* Nose */}
                            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black rounded-full"></div>
                            
                            {/* Drop zones (visible guides) - adjusted for bigger face */}
                            <div ref={eyesZoneRef} className="absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1 w-24 h-12 border-2 border-dashed border-gray-400 rounded opacity-50"></div>
                            <div ref={eyebrowsZoneRef} className="absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-1 w-28 h-8 border-2 border-dashed border-gray-400 rounded opacity-50"></div>
                            <div ref={mouthZoneRef} className="absolute top-44 left-1/2 transform -translate-x-1/2 -translate-y-1 w-20 h-12 border-2 border-dashed border-gray-400 rounded opacity-50"></div>
                          </div>
                        </div>
                      </div>

                      {/* Face parts */}
                      {faceParts.map(part => (
                        <div
                          key={part.id}
                          ref={(el) => { partRefs.current[part.id] = el; }}
                          className={`absolute cursor-grab active:cursor-grabbing transition-all duration-200 ${
                            part.placed ? 'scale-110' : 'hover:scale-105'
                          }`}
                          style={{
                            left: part.x,
                            top: part.y,
                            transform: part.placed ? 'scale(1.1)' : 'scale(1)',
                            zIndex: draggedPart === part.id ? 1000 : 1
                          }}
                          onPointerDown={(e) => handlePointerDown(e, part.id)}
                        >
                          <div className={`p-3 rounded-lg bg-white/90 shadow-lg border-2 transition-all ${
                            draggedPart === part.id ? 'border-primary border-4 shadow-xl' : 'border-gray-300'
                          } ${part.placed ? 'bg-green-50 border-green-400' : ''}`}>
                            {part.type === 'eyes' && <EyesComponent emotion={part.emotion} />}
                            {part.type === 'mouth' && <MouthComponent emotion={part.emotion} />}
                            {part.type === 'eyebrows' && <EyebrowsComponent emotion={part.emotion} />}
                          </div>
                          
                          {!part.placed && (
                            <div className="text-xs text-center mt-1 bg-white/80 rounded px-2 py-1">
                              {part.type === 'eyes' && 'Augen'}
                              {part.type === 'mouth' && 'Mund'}
                              {part.type === 'eyebrows' && 'Augenbrauen'}
                            </div>
                          )}
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
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1">
                            <EyebrowsComponent emotion={emotions[currentEmotion].name} />
                          </div>
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1">
                            <EyesComponent emotion={emotions[currentEmotion].name} />
                          </div>
                          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1">
                            <MouthComponent emotion={emotions[currentEmotion].name} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {getOtherEmotions().map((emotion) => (
                        <Button
                          key={emotion}
                          onClick={() => handleAnswerSelect(emotion)}
                          variant="outline"
                          className="p-4 text-lg hover:bg-primary/10"
                        >
                          {emotion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {gamePhase === 'feedback' && (
                  <div className="space-y-6 text-center">
                    <div className={`text-6xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? '✅' : '❌'}
                    </div>
                    
                    <h2 className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? 'Richtig!' : 'Nicht ganz...'}
                    </h2>
                    
                    <p className="text-foreground">
                      {isCorrect 
                        ? emotions[currentEmotion].feedback
                        : `Das war ${emotions[currentEmotion].name}. ${emotions[currentEmotion].feedback}`
                      }
                    </p>

                    <Button onClick={handleNextRound} className="px-8 py-3">
                      {currentEmotion < emotions.length - 1 ? 'Weiter' : 'Spiel beenden'}
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