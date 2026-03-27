import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FerdyHero = () => {
  const navigate = useNavigate();

  const scrollToGames = () => {
    const gamesSection = document.getElementById("games");
    gamesSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartClick = () => {
    navigate("/loesungsorientierung");
  };

  return (
    <section className="min-h-[80vh] flex items-center relative overflow-hidden mt-20 px-0 md:px-12">
      {/* Background with Ferdy image as CSS background */}
      <div
        className="absolute inset-0"
        style={{
          background: `url('https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_startseite.png') no-repeat left center / 110% auto`,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to bottom, rgba(163, 197, 211, 0.3), rgba(163, 197, 211, 0.1))",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-[40%] ml-12">
        <div className="bg-white/85 p-6 md:p-8 rounded-2xl" style={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}>
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
            onClick={handleStartClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-4 text-base font-bold animate-fade-in-left-delay-2 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            style={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)" }}
          >
            Jetzt loslegen!
          </Button>
        </div>
      </div>
    </section>
  );
};
