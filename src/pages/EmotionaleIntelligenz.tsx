import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LoginPromptModal } from "@/components/LoginPromptModal";
import { useState } from "react";

const EmotionaleIntelligenz = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('');
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
      title: "Gefühlsampel",
      hint: "Gefühle regulieren & verstehen",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/emotion-traffic-light.jpg",
      route: "/gefuehlsampel"
    },
    {
      title: "Gefühlsradar", 
      hint: "Emotionen erkennen & deuten",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/empathy.jpg",
      route: "/gefuehlsradar"
    },
    {
      title: "Coming Soon",
      hint: "Bald verfügbar", 
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/coming-soon.jpg",
      route: "#"
    },
    {
      title: "Coming Soon",
      hint: "Bald verfügbar",
      image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/coming-soon.jpg", 
      route: "#"
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
                  Emotionale Intelligenz
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Lerne deine Gefühle zu verstehen und zu regulieren! Emotionale Intelligenz hilft dir dabei, mit deinen Emotionen umzugehen und andere besser zu verstehen. Mit Ferdy entdeckst du die Welt der Gefühle.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button 
                    onClick={() => scrollToSection('intro')}
                    size="lg"
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 py-4 text-base font-bold hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                    style={{ boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    Jetzt entdecken
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-8 ferdy-shadow-card">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_emotion.gif"
                    alt="Ferdy mit Emotionen"
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
                Was ist emotionale Intelligenz?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
                Emotionale Intelligenz bedeutet, deine eigenen Gefühle zu verstehen und mit ihnen umgehen zu können. Du lernst auch, die Gefühle anderer zu erkennen und respektvoll damit umzugehen.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-heart text-2xl text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Gefühle erkennen</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Lerne deine Emotionen zu benennen und zu verstehen, was sie dir sagen möchten.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-brain text-2xl text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Gefühle regulieren</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Entdecke Strategien, um mit starken Gefühlen umzugehen und dich zu beruhigen.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 ferdy-shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-users text-2xl text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Empathie entwickeln</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Verstehe die Gefühle anderer und lerne, mitfühlend zu reagieren.
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
                Starte dein Emotions-Training
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {games.map((game, index) => (
                <Card 
                  key={index}
                  className="p-6 text-center cursor-pointer hover:scale-105 transition-all duration-300 ferdy-shadow-card relative"
                  onClick={() => {
                    if (game.route === "#") return;
                    if (!isLoggedIn) {
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

export default EmotionaleIntelligenz;