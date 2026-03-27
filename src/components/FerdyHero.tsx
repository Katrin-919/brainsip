import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star, Gamepad2, Brain, Heart } from "lucide-react";

const FERDY_IMG = "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_startseite.png";

export const FerdyHero = () => {
  const navigate = useNavigate();

  const scrollToGames = () => {
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #FFF8F0 0%, #E8F6FF 50%, #F0FFF4 100%)",
        }}
      />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 ferdy-dots-bg opacity-40" />

      {/* Decorative soft blobs — kept small and behind content */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #F97316, transparent 70%)", transform: "translate(30%, -20%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0EA5E9, transparent 70%)", transform: "translate(-30%, 20%)" }}
      />

      {/* === Main content === */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 py-12 md:py-16">
          {/* ── LEFT: Text ── */}
          <div className="flex-1 space-y-6 text-center md:text-left animate-fade-in-left">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: "#FFF3E8", color: "#C2470A" }}
            >
              <Sparkles size={14} />
              Lernen mit Spaß & Abenteuer!
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight text-foreground"
              style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800 }}
            >
              Lernabenteuer
              <br />
              mit{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #F97316, #FACC15)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Ferdy dem Fuchs
              </span>
            </h1>

            <p className="text-lg text-foreground/65 leading-relaxed max-w-lg mx-auto md:mx-0">
              Rätsel, Gefühle, Abenteuer – spiel dich schlau und werde jeden Tag ein bisschen besser! 🦊
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2 justify-center md:justify-start">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#FACC15" color="#FACC15" />
              ))}
              <span className="text-sm font-semibold text-foreground/55 ml-1">
                500+ Kinder spielen bereits mit Ferdy
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <Button
                size="lg"
                className="rounded-full px-8 font-bold text-base text-white"
                style={{
                  background: "#F97316",
                  boxShadow: "0 6px 20px rgba(249,115,22,0.45)",
                }}
                onClick={() => navigate("/loesungsorientierung")}
              >
                Jetzt loslegen! 🚀
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-bold text-base"
                style={{ borderColor: "#F97316", color: "#F97316" }}
                onClick={scrollToGames}
              >
                Alle Spiele entdecken
              </Button>
            </div>

            {/* Mini feature pills */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              {[
                { icon: <Brain size={14} />, label: "16 Lernspiele", bg: "#FFF3E8", col: "#C2470A" },
                { icon: <Heart size={14} />, label: "Gefühle verstehen", bg: "#FFF0F5", col: "#BE185D" },
                { icon: <Gamepad2 size={14} />, label: "Kostenlos starten", bg: "#F0FFF4", col: "#15803D" },
              ].map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: p.bg, color: p.col }}
                >
                  {p.icon} {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Ferdy image ── */}
          <div
            className="flex-shrink-0 flex items-end justify-center animate-fade-in-right"
            style={{ width: "min(380px, 45vw)", minWidth: "260px" }}
          >
            {/* Glow behind Ferdy */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "320px",
                height: "320px",
                background: "radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%)",
                bottom: "0",
              }}
            />
            {/* Ferdy image — fills container, anchored at bottom */}
            <div
              className="relative animate-float"
              style={{
                width: "100%",
                paddingBottom: "110%" /* tall enough to show full fox */,
                backgroundImage: `url('${FERDY_IMG}')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom center",
                filter: "drop-shadow(0 16px 32px rgba(249,115,22,0.22))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="hsl(35,50%,93%)" />
        </svg>
      </div>
    </section>
  );
};
