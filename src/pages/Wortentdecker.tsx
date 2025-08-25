import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FerdyHeader } from "@/components/FerdyHeader";

const Wortentdecker = () => {
  const [generatedWord, setGeneratedWord] = useState<string>("");
  const [alternativeUses, setAlternativeUses] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateWord = async () => {
    setIsLoading(true);
    setGeneratedWord("");
    setAlternativeUses("");
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-single-word');
      
      if (error) {
        console.error('Error generating word:', error);
        setGeneratedWord("Fehler beim Laden");
        return;
      }

      if (data?.word) {
        setGeneratedWord(data.word);
      } else {
        setGeneratedWord("Kein Wort gefunden");
      }
    } catch (error) {
      console.error('Error generating word:', error);
      setGeneratedWord("Fehler beim Laden");
    } finally {
      setIsLoading(false);
    }
  };

  const countIdeas = () => {
    const text = alternativeUses.trim();
    const items = text ? text.split(/\n|,|;|\.|\s{2,}/).filter(Boolean) : [];
    const count = items.length;
    
    let resultText = `Anzahl deiner Ideen: ${count}`;
    
    if (count >= 15) {
      resultText += " 🎉 BONUSPUNKTE! Super kreativ!";
    }
    
    setResult(resultText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <FerdyHeader />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Instructions */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>ℹ️</span>
                <span>Spiel-Info</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                „Wortentdecker" – Worum geht's?
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Deine Aufgabe: Für ein zufällig angezeigtes Wort denkst du dir so viele alternative Nutzungsideen wie möglich aus – je verrückter, kreativer oder cleverer, desto besser.
              </p>

              <div>
                <p className="text-muted-foreground mb-2">
                  <strong>Beispiel:</strong> Das Wort lautet „Regenschirm".
                </p>
                <p className="text-muted-foreground mb-2">Wofür kann man ihn nutzen?</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Als Stütze für eine improvisierte Zeltplane</li>
                  <li>Als Angelrute (mit etwas Fantasie 😉)</li>
                  <li>Als Schutz vor Regen</li>
                  <li>Als Kostümzubehör für einen Zauberer</li>
                  <li>Als Werkzeug, um eine Katze vom Baum zu retten</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">So spielst du</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Klicke auf <strong>„Wort generieren"</strong></li>
                  <li>Überlege dir viele alternative Verwendungen</li>
                  <li>Schreibe sie unten ins Textfeld</li>
                  <li>Klicke auf <strong>„Anzahl zählen"</strong></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">💡 Tipp</h3>
                <p className="text-sm text-muted-foreground">
                  Trau dich, ungewöhnliche, lustige oder sogar leicht verrückte Ideen zu notieren – manchmal sind gerade die am genialsten.
                </p>
              </div>

              <Link to="/loesungsorientierung">
                <Button variant="outline" className="mt-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Right Column - Game */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <video 
                  src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_sing.mp4" 
                  autoPlay
                  loop
                  muted
                  className="w-56 h-72 mx-auto rounded-lg object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <h1 className="text-lg font-bold text-foreground mb-6 text-left">
                Stell dir vor, es gibt unendliche Möglichkeiten für den angezeigten Gegenstand …
              </h1>

              <div className="space-y-4">
                <Button 
                  onClick={generateWord}
                  disabled={isLoading}
                  className="w-full"
                >
                  <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Wort generieren
                </Button>

                {generatedWord && (
                  <div className="text-2xl font-bold text-center py-4 text-foreground">
                    {generatedWord}
                  </div>
                )}

                <Textarea
                  value={alternativeUses}
                  onChange={(e) => setAlternativeUses(e.target.value)}
                  placeholder="Was kannst du mit diesem Gegenstand alles machen? ..."
                  className="min-h-[120px]"
                />

                <Button 
                  onClick={countIdeas}
                  variant="secondary"
                  className="w-full"
                >
                  Anzahl zählen
                </Button>

                {result && (
                  <div className="text-center font-bold text-foreground mt-4">
                    {result}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wortentdecker;