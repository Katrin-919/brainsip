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
                  
                  <h2 className="text-xl font-bold text-foreground">„Erzählzauber" – Worum geht's?</h2>
                  
                  <p className="text-muted-foreground">
                    Du bekommst drei zufällige Begriffe angezeigt. Deine Aufgabe ist es, daraus eine Geschichte zu erfinden –
                    lustig, spannend oder völlig verrückt. So trainierst du freies Schreiben, Sprache und Kreativität.
                    Schreibe <strong>mindestens 50 Wörter</strong> und verwende alle drei Begriffe in deiner Geschichte.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">Beispiel:</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Begriffe: <em>Drache</em>, <em>Eiscreme</em>, <em>Schule</em><br/>
                      „An einem heißen Tag landete ein Drache auf dem Schulhof und verteilte Eiscreme in den verrücktesten Sorten …
                      sogar Frau Müller lachte!"
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">So spielst du</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Klicke auf <strong>„Begriffe generieren"</strong>.</li>
                      <li>• Erfinde eine Geschichte, in der alle drei Wörter vorkommen.</li>
                      <li>• Schreibe mindestens 50 Wörter.</li>
                      <li>• Klicke auf <strong>„Fertig"</strong> für die Auswertung.</li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span>💡</span>
                      <span className="font-semibold text-foreground">Tipp</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Beugungen sind okay (z. B. „Hund", „Hunde", „Hündchen"). Je kreativer die Kombination, desto besser.
                    </p>
                  </div>

                  <Button 
                    onClick={() => navigate("/loesungsorientierung")}
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
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_blink.gif"
                    alt="Ferdy Maskottchen"
                    className="w-56 h-72 mx-auto rounded-lg object-cover"
                  />
                </div>

                <div className="text-center space-y-6">
                  <h1 className="text-lg font-bold text-foreground leading-relaxed">
                    Erfinde eine Geschichte mit diesen drei Begriffen …
                  </h1>

                  <Button 
                    onClick={generateTerms} 
                    disabled={isGenerating}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isGenerating ? "Generiere..." : "Begriffe generieren"}
                  </Button>

                  <div className="flex gap-3 flex-wrap justify-center">
                    {terms.map((term, index) => (
                      <Card key={index} className="flex-1 min-w-[160px] max-w-[180px]">
                        <CardContent className="p-4 text-center">
                          <div className="font-bold text-lg text-foreground">
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
                    className="min-h-[200px] resize-y text-left"
                  />

                  <Button 
                    onClick={checkStory}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Fertig
                  </Button>

                  {result && (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="font-bold text-sm text-foreground">
                        {result}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Erzaehlzauber;
