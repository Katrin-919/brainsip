
import { useState } from "react";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SumUp = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const submitReview = async () => {
    const trimmedInput = userInput.trim();
    const wordCount = trimmedInput.split(/\s+/).length;

    if (wordCount < 50) {
      toast({
        title: "Zu wenig Text",
        description: "Bitte trage mindestens 50 Wörter ein.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('check-mindset-content', {
        body: { content: trimmedInput }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.fixedMindsetCorrect && data?.growthMindsetCorrect && data?.isOnTopic) {
        toast({
          title: "Sehr gut!",
          description: data.feedback || "Deine Eingabe ist gültig und wurde erfolgreich übermittelt.",
          variant: "default",
        });
        setUserInput("");
      } else {
        toast({
          title: "Nicht ganz richtig",
          description: data.feedback || "Bitte überprüfe deinen Text auf Sinnhaftigkeit und stelle sicher, dass du beide Mindset-Arten erklärst.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking content:', error);
      toast({
        title: "Fehler",
        description: "Es gab einen Fehler bei der Überprüfung. Bitte versuche es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  
                  <h2 className="text-xl font-bold text-foreground">„SumUp" – Worum geht's?</h2>
                  
                  <p className="text-muted-foreground">
                    Schau dir das Video an. Es erklärt dir, was ein <strong>Growth Mindset</strong> und was ein <strong>Fixed Mindset</strong> ist. 
                    Deine Aufgabe ist es, genau hinzuhören und danach in deinen eigenen Worten zusammenzufassen, was du gelernt hast.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">Warum ist das wichtig?</p>
                    <p className="text-sm text-muted-foreground">
                      Wenn du über Mindsets nachdenkst und versuchst, sie mit eigenen Worten zu erklären, 
                      verankerst du das Wissen viel besser in deinem Gehirn.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">So spielst du</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Schaue dir das Video aufmerksam an</li>
                      <li>• Schreibe mindestens 50 Wörter</li>
                      <li>• Erkläre beide Mindset-Arten</li>
                      <li>• Klicke auf <strong>„Absenden"</strong> für die Bewertung</li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span>💡</span>
                      <span className="font-semibold text-foreground">Tipp</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Erkläre sowohl <em>Growth Mindset</em> als auch <em>Fixed Mindset</em> in deinen eigenen Worten!
                    </p>
                  </div>

                  <Button 
                    onClick={() => navigate('/mindset')}
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
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_main.png"
                    alt="Ferdy der Fuchs"
                    className="w-60 h-75 mx-auto rounded-lg object-cover"
                  />
                </div>

                {/* Video Container */}
                <div className="mb-8">
                  <div className="aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg">
                    <iframe 
                      src="https://player.vimeo.com/video/952100315" 
                      width="100%" 
                      height="100%" 
                      frameBorder="0"
                      allow="autoplay; fullscreen" 
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Input Section */}
                <div className="max-w-3xl mx-auto">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Trage hier ein, was du aus dem Video zum Thema Growth Mindset und Fixed Mindset gelernt hast..."
                    className="min-h-[250px] resize-y text-base w-full"
                  />
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    Aktuelle Wortanzahl: {userInput.trim().split(/\s+/).filter(word => word.length > 0).length} / 50 mindestens
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-8">
                  <Button 
                    onClick={submitReview}
                    disabled={isSubmitting}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 px-8 py-4"
                  >
                    {isSubmitting ? "Wird überprüft..." : "Absenden"}
                  </Button>
                </div>

              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SumUp;
