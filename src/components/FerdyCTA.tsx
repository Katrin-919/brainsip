import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const FerdyCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, hsl(25 95% 53%) 0%, hsl(35 100% 60%) 100%)",
        }}
      />
      <div className="absolute inset-0 ferdy-dots-bg opacity-20" />

      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div className="text-white space-y-6 animate-fade-in-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 text-white">
              <Sparkles size={14} /> Jetzt kostenlos starten
            </div>
            <h2
              className="text-3xl md:text-5xl text-white leading-tight"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Bereit für dein Abenteuer mit Ferdy?
            </h2>
            <p className="text-lg text-white/85 leading-relaxed">
              Registriere dich kostenlos und starte noch heute dein erstes Lernabenteuer!
              Ferdy freut sich schon darauf, dich kennenzulernen. 🦊
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                className="rounded-full px-8 font-bold text-base bg-white text-primary hover:bg-white/90"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
                onClick={() => navigate("/auth")}
              >
                Jetzt kostenlos starten 🚀
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-bold text-base border-2 border-white/60 text-white hover:bg-white/10"
                onClick={() => document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })}
              >
                Spiele ansehen
              </Button>
            </div>
          </div>

          {/* Ferdy Party Image */}
          <div className="flex justify-center animate-fade-in-right">
            <div className="relative animate-float">
              <div className="w-72 h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                <img
                  src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_party.png"
                  alt="Ferdy feiert"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Confetti dots */}
              {["🎉", "⭐", "🎊", "✨"].map((emoji, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-float-slow"
                  style={{
                    top: `${[10, -5, 80, 90][i]}%`,
                    left: `${[-10, 90, -15, 95][i]}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
