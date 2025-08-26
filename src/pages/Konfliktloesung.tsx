import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FerdyHeader } from "@/components/FerdyHeader";
import { Loader2, MessageSquare, Ear, Handshake } from "lucide-react";

const Konfliktloesung = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
      image: "/lovable-uploads/38c62239-4005-4abd-94da-fc290e476600.png", // Using ferdy image as placeholder
      route: "/streitschlichter"
    },
    {
      title: "Sag's mal anders",
      hint: "Worte klug wählen",
      image: "/lovable-uploads/38c62239-4005-4abd-94da-fc290e476600.png", // Using ferdy image as placeholder
      route: "/sags-mal-anders"
    },
    {
      title: "Ich-Botschaften",
      hint: "Gefühle klar sagen",
      image: "/lovable-uploads/38c62239-4005-4abd-94da-fc290e476600.png", // Using ferdy image as placeholder
      route: "/ich-botschaften"
    },
    {
      title: "Gefühlsradar",
      hint: "Emotionen erkennen",
      image: "/lovable-uploads/38c62239-4005-4abd-94da-fc290e476600.png", // Using ferdy image as placeholder
      route: "/gefuehlsradar"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <FerdyHeader />
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Wie sage ich, was ich denke – ohne andere zu verletzen?
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                In dieser Kategorie lernst du, wie du Konflikte fair löst, freundlich sprichst und deine Gefühle klar ausdrückst. 
                Worte können Streit beenden – oder ihn schlimmer machen. Mit Ferdy übst du, wie man mit anderen gut klarkommt.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => scrollToSection('features')} 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Jetzt entdecken
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-card rounded-3xl p-8 shadow-xl">
                <img 
                  src="/lovable-uploads/38c62239-4005-4abd-94da-fc290e476600.png" 
                  alt="Ferdy mit beiden Händen oben" 
                  className="w-80 h-80 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Deine Superkraft: klare Worte
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl leading-relaxed">
              Gute Kommunikation bedeutet zuhören, Gefühle benennen und respektvoll bleiben – auch wenn's knifflig wird.
              Hier trainierst du Techniken, mit denen Gespräche fairer und leichter werden.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Ich-Botschaften</h3>
                    <p className="text-muted-foreground">
                      So sagst du, was du fühlst und brauchst – ohne Vorwürfe. Das macht Gespräche ruhiger und verständlicher.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Ear className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Aktives Zuhören</h3>
                    <p className="text-muted-foreground">
                      Nachfragen, zusammenfassen, verstehen: Du zeigst, dass du wirklich zuhörst – und ihr findet schneller Lösungen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Handshake className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Respektvoll sprechen</h3>
                    <p className="text-muted-foreground">
                      Freundlich bleiben, Grenzen achten, fair argumentieren – so klappt Teamwork und ihr bleibt im guten Miteinander.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Übe Kommunikation im Spiel
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <Card 
                key={index}
                className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                onClick={() => navigate(game.route)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-foreground group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{game.title}</h3>
                  <p className="text-muted-foreground text-sm">{game.hint}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Konfliktloesung;