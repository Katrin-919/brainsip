import { CheckCircle } from "lucide-react";

const FERDY_DANCE_GIF =
  "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_dancearound.gif";

const highlights = [
  "Spielerisch wichtige Lebenskompetenzen lernen",
  "Emotionale Intelligenz entwickeln",
  "Kreative Problemlösung üben",
  "Konflikte friedlich meistern",
];

export const FerdyAbout = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative flex justify-center animate-fade-in-left order-2 md:order-1">
            <div
              className="absolute w-72 h-72 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, hsl(199 89% 48%), transparent)",
                top: "10%",
                left: "10%",
              }}
            />
            <div className="relative z-10 animate-float">
              {/* GIF as CSS background to avoid any loading issues */}
              <div
                className="w-72 h-72 md:w-80 md:h-80 rounded-3xl shadow-2xl"
                style={{
                  backgroundImage: `url('${FERDY_DANCE_GIF}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
            {/* Stats card */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-orange-100 animate-pop-in">
              <div
                className="text-3xl font-extrabold"
                style={{ color: "hsl(25 95% 53%)", fontFamily: "'Baloo 2', cursive" }}
              >
                16+
              </div>
              <div className="text-xs font-semibold text-foreground/60">Lernspiele</div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6 animate-fade-in-right order-1 md:order-2">
            <div className="ferdy-badge">🦊 Über Ferdy</div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-foreground"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Wer ist Ferdy der Fuchs?
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Ferdy ist ein neugieriger, schlauer Fuchs, der Kinder auf ihren Lernabenteuern begleitet. Mit Geschichten,
              Rätseln und Spielen zeigt er, wie man Probleme mutig anpackt und Gefühle versteht.
            </p>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={20} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(142 71% 45%)" }} />
                  <span className="text-foreground/80 font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
