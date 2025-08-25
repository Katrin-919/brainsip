import { useState } from "react";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SolutionStory = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState("Klicke auf \"Aufgabe generieren\", um zu starten.");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";

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

  const generateQuestion = async () => {
    setIsGenerating(true);
    setUserAnswer("");
    setShowScore(false);
    setCorrectAnswer("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-story-terms', {
        body: { type: 'solutionstory' }
      });

      if (error) throw error;

      if (data?.question) {
        setQuestion(data.question);
        setCorrectAnswer(data.answer || "");
      } else {
        setQuestion("Fehler beim Laden der Aufgabe.");
        setCorrectAnswer("");
      }
    } catch (err) {
      console.error('Fehler beim Generieren:', err);
      setQuestion("Fehler beim Laden der Aufgabe.");
      setCorrectAnswer("");
      toast({
        title: "Fehler",
        description: "Aufgabe konnte nicht generiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const evaluateAnswer = () => {
    const userText = userAnswer.trim();
    if (!userText) {
      toast({
        title: "Hinweis",
        description: "Bitte gib eine Antwort ein.",
        variant: "destructive",
      });
      return;
    }

    const newQuestionsAttempted = questionsAttempted + 1;
    setQuestionsAttempted(newQuestionsAttempted);

    let gotIt = false;
    if (correctAnswer) {
      const u = userText.toLowerCase();
      const c = correctAnswer.toLowerCase();
      gotIt = (u === c) || (u.length > 10 && c.includes(u.slice(0, Math.min(u.length, 40))));
    }

    if (gotIt) {
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
      toast({
        title: "Richtig!",
        description: "Gute Arbeit!",
        variant: "default",
      });
    } else if (correctAnswer) {
      toast({
        title: "Beispielantwort",
        description: correctAnswer,
        duration: 8000,
      });
    } else {
      toast({
        title: "Hinweis",
        description: "Noch keine Beispielantwort verfügbar. Klicke zuerst \"Aufgabe generieren\".",
        variant: "destructive",
      });
    }

    const newScore = 20;
    setScore(newScore);
    setShowScore(true);
    setUserAnswer("");
  };

  const showAnswer = () => {
    if (correctAnswer) {
      toast({
        title: "Beispielantwort",
        description: correctAnswer,
        duration: 8000,
      });
    } else {
      toast({
        title: "Hinweis",
        description: "Noch keine Beispielantwort geladen. Klicke zuerst \"Aufgabe generieren\".",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
      
      <main className="mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left Column - Game Info */}
            <Card className="p-6 h-fit">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  ℹ️ Spiel-Info
                </h3>
                
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    "SolutionStory" – Worum geht's?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Du bekommst alltagsnahe Aufgaben mit <strong>begrenzten Ressourcen</strong>. Das heißt, es gibt irgendwo einen Engpass oder ein knappes Gut.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Deine Mission: clever planen, Prioritäten setzen und mit Einfallsreichtum eine gute Lösung finden.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">So spielst du</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Klicke auf <strong>"Aufgabe generieren"</strong></li>
                    <li>Lies die Situation aufmerksam</li>
                    <li>Schreibe deine Lösung <em>knapp und konkret</em> ins Feld</li>
                    <li>Klicke auf <strong>"Fertig"</strong> – und vergleiche mit der Beispielantwort</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Was kannst du lernen?</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Ressourcen klug einsetzen (Zeit, Geld, Material, Hilfe)</li>
                    <li>Hindernisse pragmatisch umschiffen (Plan B/C)</li>
                    <li>Fair & realistisch bleiben (keine \"Zauber\"-Annahmen)</li>
                    <li>Konkrete Schritte benennen (wer macht was bis wann?)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    💡 Tipp
                  </h3>
                  <p className="text-muted-foreground italic">
                    Frag dich: \"Was ist jetzt der <strong>nächstbeste</strong> machbare Schritt mit dem, was ich habe?\"
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  Zurück
                </Button>
              </div>
            </Card>

            {/* Right Column - Game Interface */}
            <Card className="p-6">
              <div className="space-y-6">
                
                {/* Ferdy Image */}
                <div className="text-center">
                  <img 
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_dance2.gif"
                    alt="Ferdi"
                    className="w-56 h-56 object-cover rounded-xl mx-auto"
                  />
                </div>

                <h1 className="text-xl font-bold text-foreground text-center">
                  Plane clever mit wenig Ressourcen
                </h1>

                {/* Question Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-h-[120px]">
                  <p className="text-foreground leading-relaxed">{question}</p>
                </div>

                {/* Generate Button */}
                <div className="text-center">
                  <Button 
                    onClick={generateQuestion}
                    disabled={isGenerating}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
                  >
                    {isGenerating ? "Wird generiert..." : "Aufgabe generieren"}
                  </Button>
                </div>

                {/* Answer Input */}
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Schreibe hier deine Lösungsidee …"
                  className="min-h-[160px] resize-y"
                />

                {/* Control Buttons */}
                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={evaluateAnswer}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
                  >
                    Fertig
                  </Button>
                  <Button 
                    onClick={showAnswer}
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3"
                  >
                    Antwort anzeigen
                  </Button>
                </div>

                {/* Score Display */}
                {showScore && (
                  <div className="text-center bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-semibold text-foreground">
                      Aktuelle Punktzahl: {score}/20 ({correctAnswers}/{questionsAttempted} richtig)
                    </p>
                  </div>
                )}

              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SolutionStory;