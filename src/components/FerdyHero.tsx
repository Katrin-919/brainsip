import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";

export const FerdyHero = () => {
  const navigate = useNavigate();

  const scrollToGames = () => {
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">

      {/* Warm gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, hsl(35 80% 96%) 0%, hsl(199 80% 93%) 50%, hsl(142 60% 93%) 100%)",
        }}
      />

      {/* Decorative dots */}
      <div className="absolute inset-0 ferdy-dots-bg opacity-60" />

      {/* Floating blobs */}
      <div
        className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 animate-float-slow"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent)" }}
      />
      <div
        className="absolute bottom-20 left-10 w-56 h-56 rounded-full opacity-15 animate-float"
        style={{ background: "radial-gradient(circle, hsl(var(--secondary)), transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 w-full">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* === Left: Text Content === */}
          <div className="space-y-6 animate-fade-in-left">

            {/* Badge */}
            <div className="ferdy-badge animate-pop-in">
              <Sparkles size={14} />
              Lernen mit Spaß & Abenteuer!
            </div>

            {/* Headline */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground"
              style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800 }}
            >
              Lernaben&shy;teuer mit{" "}
              <span className="animate-shimmer-text">Ferdy dem Fuchs</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              Tauche ein in eine Welt voller Rätsel, Gefühle und Entdeckungen –
              und werde mit jedem Spiel ein Stückchen klüger. 🦊
            </p>

            {/* Star ratings */}
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="hsl(var(--ferdy-yellow))" color="hsl(var(--ferdy-yellow))" />
              ))}
              <span className="text-sm font-semibold text-foreground/60 ml-1">
                Über 500 Kinder spielen bereits mit Ferdy
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                className="rounded-full px-8 font-bold text-base animate-pulse-ring"
                style={{
                  background: "hsl(var(--primary))",
                  boxShadow: "var(--shadow-button)",
                }}
                onClick={() => navigate("/loesungsorientierung")}
              >
                Jetzt loslegen! 🚀
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-bold text-base border-2 border-primary/30 text-primary hover:bg-primary hover:text-white"
                onClick={scrollToGames}
              >
                Alle Spiele entdecken
              </Button>
            </div>
          </div>

          {/* === Right: Ferdy Image === */}
          <div className="relative flex justify-center items-center animate-fade-in-right">
            {/* Glow circle behind ferdy */}
            <div
              className="absolute w-80 h-80 rounded-full opacity-30"
              style={{
                background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)",
              }}
            />

            {/* Ferdy image */}
            <div className="relative z-10 animate-float">
              <img
                src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_startseite.png"
                alt="Ferdy der Fuchs"
                className="w-full max-w-md object-contain drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 20px 40px rgba(249,115,22,0.3))" }}
              />
            </div>

            {/* Floating mini cards */}
            <div
              className="absolute top-8 -left-4 bg-white rounded-2xl px-4 py-3 shadow-lg animate-float-slow"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="text-2xl mb-0.5">🧠</div>
              <div className="text-xs font-bold text-foreground">16 Spiele</div>
            </div>
            <div
              className="absolute bottom-12 -right-2 bg-white rounded-2xl px-4 py-3 shadow-lg animate-float-slow"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-2xl mb-0.5">⭐</div>
              <div className="text-xs font-bold text-foreground">Kostenlos starten</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="hsl(35 50% 93%)"
          />
        </svg>
      </div>
    </section>
  );
};
