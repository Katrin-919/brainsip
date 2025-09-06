import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FerdyHeader } from "@/components/FerdyHeader";
import { Loader2, MessageSquare, Ear, Handshake } from "lucide-react";
import { LoginPromptModal } from "@/components/LoginPromptModal";
import { useState } from "react";

const Konfliktloesung = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('');

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

  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || 'Nutzer';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const games = [
    {
      title: "Streitschlichter",
      hint: "Konflikte fair lösen",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/konfliktspiel1.png",
      route: "/streitschlichter"
    },
    {
      title: "Sag's mal anders",
      hint: "Worte klug wählen",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/konfliktspiel2.png",
      route: "/sags-mal-anders"
    },
    {
      title: "Ich-Botschaften",
      hint: "Gefühle klar sagen",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ichbotschaftBild.png",
      route: "/ich-botschaften"
    },
    {
      title: "Gefühlsradar",
      hint: "Emotionen erkennen", 
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/gefuehlsradar_bild.png",
      route: "/gefuehlsradar"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader />
      
      <main className="mt-20">
        {/* Hero Section */}
        <section className="ferdy-gradient-section py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                  Wie sage ich, was ich denke – ohne andere zu verletzen?
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In dieser Kategorie lernst du, wie du Konflikte fair löst, freundlich sprichst und deine Gefühle klar ausdrückst. 
                  Worte können Streit beenden – oder ihn schlimmer machen. Mit Ferdy übst du, wie man mit anderen gut klarkommt.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button 
                    onClick={() => scrollToSection('features')}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-4 text-base font-bold hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                    style={{ boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    Jetzt entdecken
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-8 ferdy-shadow-card">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_both hands up.png" 
                    alt="Ferdy mit beiden Händen oben" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="text-left mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Deine Superkraft: klare Worte
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
                Gute Kommunikation bedeutet zuhören, Gefühle benennen und respektvoll bleiben – auch wenn's knifflig wird.
                Hier trainierst du Techniken, mit denen Gespräche fairer und leichter werden.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Ich-Botschaften</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      So sagst du, was du fühlst und brauchst – ohne Vorwürfe. Das macht Gespräche ruhiger und verständlicher.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Ear className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Aktives Zuhören</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Nachfragen, zusammenfassen, verstehen: Du zeigst, dass du wirklich zuhörst – und ihr findet schneller Lösungen.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Handshake className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Respektvoll sprechen</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Freundlich bleiben, Grenzen achten, fair argumentieren – so klappt Teamwork und ihr bleibt im guten Miteinander.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section id="games" className="ferdy-gradient-section py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
                Übe Kommunikation im Spiel
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {games.map((game, index) => (
                <Card 
                  key={index}
                  className="p-6 text-center cursor-pointer hover:scale-105 transition-all duration-300 ferdy-shadow-card relative"
                  onClick={() => {
                    if (!user) {
                      setSelectedGame(game.title);
                      setShowLoginModal(true);
                    } else {
                      navigate(game.route);
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-white relative">
                      <img 
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">{game.hint}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LoginPromptModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        gameName={selectedGame}
      />
    </div>
  );
};

export default Konfliktloesung;