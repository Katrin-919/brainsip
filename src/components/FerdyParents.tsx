import { BookOpen, Shield, Users, TrendingUp } from "lucide-react";

const PARENTS_DONUT = "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/parents_donut.png";

const features = [
  {
    icon: BookOpen,
    title: "Pädagogisch wertvoll",
    description: "Von Expert:innen entwickelt und an kindliche Lernprozesse angepasst.",
    bg: "#FFF3E8",
    fg: "#C2470A",
  },
  {
    icon: Shield,
    title: "Sicher & geschützt",
    description: "Werbefreie und kindgerechte Umgebung – ohne Ablenkungen.",
    bg: "#E0F4FD",
    fg: "#0478A8",
  },
  {
    icon: Users,
    title: "Gemeinsam lernen",
    description: "Aktivitäten für die ganze Familie – Eltern können mitspielen.",
    bg: "#E8F9EE",
    fg: "#1A7D3E",
  },
  {
    icon: TrendingUp,
    title: "Fortschritt sehen",
    description: "Verfolgen Sie die Lernentwicklung Ihres Kindes in Echtzeit.",
    bg: "#F0EAFE",
    fg: "#6B3AC2",
  },
];

export const FerdyParents = () => {
  return (
    <section id="parents" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="ferdy-badge mx-auto mb-4">👨‍👩‍👧 Für Eltern</div>
          <h2 className="text-3xl md:text-5xl text-foreground mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Für Eltern und Erziehungsberechtigte
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Ferdy der Fuchs wurde entwickelt, um Kindern wichtige Lebenskompetenzen spielerisch beizubringen – und
            unterstützt die sozial-emotionale Entwicklung.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left cards */}
          <div className="space-y-5">
            {features.slice(0, 2).map((f, i) => (
              <div
                key={f.title}
                className="ferdy-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: f.bg, color: f.fg }}
                >
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg mb-2 text-foreground" style={{ fontFamily: "'Baloo 2', cursive" }}>
                  {f.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Center donut image via CSS background */}
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div
              className="w-full max-w-xs aspect-square rounded-3xl shadow-2xl"
              style={{
                backgroundImage: `url('${PARENTS_DONUT}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Right cards */}
          <div className="space-y-5">
            {features.slice(2).map((f, i) => (
              <div
                key={f.title}
                className="ferdy-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${(i + 2) * 0.15}s` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: f.bg, color: f.fg }}
                >
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg mb-2 text-foreground" style={{ fontFamily: "'Baloo 2', cursive" }}>
                  {f.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
