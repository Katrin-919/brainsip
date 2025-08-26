


import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Mindset = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const games = [
    {
      title: "SumUp",
      hint: "Wichtiges sammeln & merken",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/summary.jpg",
      route: "/sumup"
    },
    {
      title: "Paare finden", 
      hint: "Zuordnen & verstehen",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/mindsetpaare.png",
      route: "/paare-finden"
    },
    {
      title: "Mindshift",
      hint: "Gedanken lenken & beruhigen", 
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/thinking.jpg",
      route: "/mindshift"
    },
    {
      title: "Mindmatch",
      hint: "Aussagen vergleichen",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/mindset.jpg", 
      route: "/mindmatch"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
      
      <main className="mt-20">
        {/* Hero Section */}
        <section className="ferdy-gradient-section py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                  Grow Your Mindset Today
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Dein Mindset ist wie ein Superhelden-Anzug: Er hilft dir, mutig zu sein, weiterzulernen und an dich selbst zu glauben! Hier entdeckst du, wie ein Growth Mindset funktioniert – die Haltung: „Ich kann es noch nicht … aber ich kann es lernen!"
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button 
                    onClick={() => scrollToSection('intro')}
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
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_halelu.gif"
                    alt="Ferdy jubelt"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="intro" className="py-20 md:py-32 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="text-left mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Was ist ein Growth Mindset?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
                Mit einem Growth Mindset glaubst du, dass Fähigkeiten durch Übung wachsen. Du lernst aus Fehlern, bleibst drangeblieben und wagst Neues. Mit Ferdy trainierst du genau diese Haltung – Schritt für Schritt.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-seedling text-2xl text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Aus Fehlern lernen</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      „Fehler = Feedback": Du findest heraus, was schon gut klappt und wo du noch nachschärfen kannst.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-person-running text-2xl text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Dranbleiben & üben</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Kleine Schritte, große Wirkung: Mit Übung und Geduld wird's jedes Mal ein bisschen leichter.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-star text-2xl text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Neues wagen</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Neugierig ausprobieren, mutig starten – du entdeckst neue Wege und Ideen, die zu dir passen.
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
                Starte dein Mindset-Training
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {games.map((game, index) => (
                <Card 
                  key={index}
                  className="p-6 text-center cursor-pointer hover:scale-105 transition-all duration-300 ferdy-shadow-card"
                  onClick={() => navigate(game.route)}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-white border-4 border-black">
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
    </div>
  );
};

export default Mindset;

