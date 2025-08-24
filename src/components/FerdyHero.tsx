import { Button } from "@/components/ui/button";

export const FerdyHero = () => {
  const scrollToGames = () => {
    const gamesSection = document.getElementById('games');
    gamesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-[80vh] flex items-center relative overflow-hidden mt-20 px-4 md:px-12">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 ferdy-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-secondary/10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-xl lg:max-w-2xl">
        <div className="bg-white/85 backdrop-blur-sm p-8 md:p-10 rounded-2xl ferdy-shadow-card">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight animate-fade-in-left">
            Abenteuer mit Ferdy dem Fuchs
          </h1>
          
          <div className="space-y-4 mb-8 animate-fade-in-left-delay">
            <p className="text-lg md:text-xl text-foreground leading-relaxed">
              Tauche ein in eine Welt voller Spaß, Rätsel und Lernaction mit deinem neuen Freund Ferdy dem Fuchs.
            </p>
            <p className="text-lg md:text-xl text-foreground leading-relaxed">
              Entdecke, wie Lernen zu einem echten Abenteuer wird.
            </p>
          </div>

          <Button 
            onClick={scrollToGames}
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-bold animate-fade-in-left-delay-2 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            Jetzt loslegen!
          </Button>
        </div>
      </div>

      {/* Decorative fox illustration placeholder */}
      <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20 animate-bounce" />
    </section>
  );
};