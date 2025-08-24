import { Button } from "@/components/ui/button";

export const FerdyHero = () => {
  const scrollToGames = () => {
    const gamesSection = document.getElementById('games');
    gamesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-[80vh] flex items-center relative overflow-hidden mt-20 px-4 md:px-12">
      {/* Background with Ferdy image */}
      <div className="absolute inset-0">
        <img 
          src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_startseite.png"
          alt="Ferdy der Fuchs in einer Waldszene"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-md lg:max-w-lg">
        <div className="bg-white/95 backdrop-blur-[2px] p-6 md:p-8 rounded-2xl ferdy-shadow-card">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight animate-fade-in-left">
            Abenteuer mit Ferdy dem Fuchs
          </h1>
          
          <div className="space-y-3 mb-6 animate-fade-in-left-delay">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Tauche ein in eine Welt voller Spaß, Rätsel und Lernaction mit deinem neuen Freund Ferdy dem Fuchs.
            </p>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Entdecke, wie Lernen zu einem echten Abenteuer wird.
            </p>
          </div>

          <Button 
            onClick={scrollToGames}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-4 text-base font-bold animate-fade-in-left-delay-2 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            Jetzt loslegen!
          </Button>
        </div>
      </div>
    </section>
  );
};