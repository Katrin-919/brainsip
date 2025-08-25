import { useState } from "react";
import { FerdyHeader } from "@/components/FerdyHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Erzaehlzauber = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";

  const [terms, setTerms] = useState<string[]>(["Begriff 1", "Begriff 2", "Begriff 3"]);
  const [story, setStory] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateTerms = async () => {
    setIsGenerating(true);
    setResult("");
    setStory("");
    setTerms(["Begriff 1", "Begriff 2", "Begriff 3"]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-story-terms');
      
      if (error) {
        throw error;
      }

      if (data?.terms && Array.isArray(data.terms) && data.terms.length >= 3) {
        setTerms(data.terms.slice(0, 3));
      } else {
        throw new Error("Nicht genügend Begriffe erhalten");
      }
    } catch (error) {
      console.error('Error generating terms:', error);
      toast({
        title: "Fehler",
        description: "Begriffe konnten nicht generiert werden. Versuche es später nochmal.",
        variant: "destructive",
      });
      setTerms(["Hund", "Regenbogen", "Schokolade"]);
    } finally {
      setIsGenerating(false);
    }
  };

  const checkStory = () => {
    const text = story.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    
    let usedTerms = 0;
    terms.forEach(term => {
      if (term && term !== `Begriff ${terms.indexOf(term) + 1}`) {
        const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(text)) {
          usedTerms++;
        }
      }
    });

    let message = `Wortanzahl: ${wordCount} · verwendete Begriffe: ${usedTerms}/3`;
    
    if (wordCount >= 50 && usedTerms === 3) {
      message += " 🎉 Top! Mindestlänge erreicht & alle Begriffe eingebaut.";
    } else if (usedTerms < 3) {
      message += " – baue bitte alle drei Begriffe ein.";
    } else if (wordCount < 50) {
      message += " – schreibe bitte mindestens 50 Wörter.";
    }
    
    setResult(message);
  };

  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Instructions */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-primary mb-4">Spiel-Info</h3>
              <h2 className="text-xl font-bold mb-4">„Erzählzauber" – Worum geht's?</h2>
              <p className="mb-4 text-muted-foreground">
                Du bekommst drei zufällige Begriffe angezeigt. Deine Aufgabe ist es, daraus eine kurze Geschichte zu erfinden –
                lustig, spannend oder völlig verrückt. So trainierst du freies Schreiben, Sprache und Kreativität.
                Für Bonuspunkte schreibe <strong>mindestens 50 Wörter</strong> und verwende alle drei Begriffe in deiner Geschichte.
              </p>

              <h3 className="text-lg font-semibold mb-2">Beispiel</h3>
              <p className="mb-4 text-muted-foreground">
                Begriffe: <em>Drache</em>, <em>Eiscreme</em>, <em>Schule</em><br/>
                „An einem heißen Tag landete ein Drache auf dem Schulhof und verteilte Eiscreme in den verrücktesten Sorten …
                sogar Frau Müller lachte!"
              </p>

              <h3 className="text-lg font-semibold mb-2">So spielst du</h3>
              <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">
                <li>Klicke auf <strong>„Begriffe generieren"</strong>.</li>
                <li>Erfinde eine Geschichte, in der alle drei Wörter vorkommen.</li>
                <li>Schreibe mindestens 50 Wörter.</li>
                <li>Klicke auf <strong>„Fertig"</strong> für die Auswertung.</li>
              </ol>

              <h3 className="text-lg font-semibold mb-2">Tipp</h3>
              <p className="mb-4 text-muted-foreground">
                Beugungen sind okay (z. B. „Hund", „Hunde", „Hündchen"). Je kreativer die Kombination, desto besser.
              </p>

              <Button 
                variant="outline" 
                onClick={() => navigate("/loesungsorientierung")}
                className="w-full"
              >
                Zurück
              </Button>
            </div>
          </div>

          {/* Right Column - Game */}
          <div className="space-y-6">
            <div className="text-center">
              <img 
                src="/lovable-uploads/f402e6b2-cfe9-4c7d-9969-484f52c0ccec.png" 
                alt="Schlauer Fuchs" 
                className="w-[220px] h-[280px] mx-auto rounded-lg object-cover"
              />
            </div>

            <h1 className="text-xl font-bold text-center mb-6">
              Erfinde eine Geschichte mit diesen drei Begriffen …
            </h1>

            <Button 
              onClick={generateTerms} 
              disabled={isGenerating}
              className="w-full mb-4"
            >
              {isGenerating ? "Generiere..." : "Begriffe generieren"}
            </Button>

            <div className="flex gap-3 flex-wrap">
              {terms.map((term, index) => (
                <Card key={index} className="flex-1 min-w-[160px]">
                  <CardContent className="p-4 text-center">
                    <div className="font-bold text-lg">
                      {term}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Schreibe hier deine Geschichte …"
              className="min-h-[200px] resize-y"
            />

            <Button 
              onClick={checkStory}
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Fertig
            </Button>

            {result && (
              <div className="text-center font-bold text-sm bg-muted p-4 rounded-lg">
                {result}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Erzaehlzauber;