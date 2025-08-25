import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Losungsorientierung = () => {
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
      title: "DenkWeiser",
      hint: "Ideen sammeln & vergleichen",
      image: "/lovable-uploads/f402e6b2-cfe9-4c7d-9969-484f52c0ccec.png",
      route: "/denkweiser"
    },
    {
      title: "ErzählZauber", 
      hint: "Geschichten & Lösungen verknüpfen",
      image: "/lovable-uploads/f402e6b2-cfe9-4c7d-9969-484f52c0ccec.png",
      route: "/erzaehlzauber"
    },
    {
      title: "WortEntdecker",
      hint: "Begriffe ordnen & erklären", 
      image: "/lovable-uploads/f402e6b2-cfe9-4c7d-9969-484f52c0ccec.png",
      route: "/wortentdecker"
    },
    {
      title: "TaktikTüftler",
      hint: "Strategien planen & testen",
      image: "/lovable-uploads/f402e6b2-cfe9-4c7d-9969-484f52c0ccec.png", 
      route: "/taktiktueftler"
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
                  Finde den Schlüssel zu cleveren Lösungen
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Hier lernst du, wie du knifflige Rätsel spielerisch löst – indem du dein Denken auf neue, spannende Weise einsetzt.
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
                <div className="aspect-square flex items-center justify-center">
                  <img 
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_dancearound.gif"
                    alt="Ferdy jubelt"
                    className="w-full h-full object-contain rounded-2xl"
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
                Entdecke coole Tricks und Werkzeuge!
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
                Unsere Methoden helfen dir, Probleme aus verschiedenen Blickwinkeln zu betrachten und kreative Lösungswege zu finden.
                Mit Ferdys Werkzeugkiste wird Denken zum Abenteuer.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-lightbulb text-2xl text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Kreatives Denken</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Lerne, wie du über den Tellerrand hinausschaust, neue Perspektiven entdeckst und mutig ausprobierst.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-puzzle-piece text-2xl text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Problemlösung</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Entwickle Strategien, um selbst die kniffligsten Herausforderungen Schritt für Schritt zu meistern.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-magnifying-glass-chart text-2xl text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Analytisches Denken</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Schärfe deinen Blick für Details, erkenne Zusammenhänge schneller und treffe clevere Entscheidungen.
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
                Starte dein Lernabenteuer
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
                    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden">
                      <img 
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-contain"
                        style={{
                          clipPath: `polygon(${25 + index * 25}% 0%, ${50 + index * 25}% 0%, ${50 + index * 25}% 100%, ${25 + index * 25}% 100%)`,
                          objectPosition: `${-index * 25}% 0%`
                        }}
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

export default Losungsorientierung;