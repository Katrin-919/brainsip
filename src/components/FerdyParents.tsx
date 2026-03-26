import { BookOpen, Shield, Users, TrendingUp } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Pädagogisch wertvoll",
    description: "Von Expert:innen entwickelt und an kindliche Lernprozesse angepasst.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Shield,
    title: "Sicher & geschützt",
    description: "Werbefreie und kindgerechte Umgebung – ohne Ablenkungen.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Gemeinsam lernen",
    description: "Aktivitäten für die ganze Familie – Eltern können mitspielen.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: TrendingUp,
    title: "Fortschritt sehen",
    description: "Verfolgen Sie die Lernentwicklung Ihres Kindes in Echtzeit.",
    color: "bg-purple-100 text-purple-600",
  },
];

export const FerdyParents = () => {
  return (
    <section id="parents" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10">

        {/* Heading */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="ferdy-badge mx-auto mb-4">👨‍👩‍👧 Für Eltern</div>
          <h2
            className="text-3xl md:text-5xl text-foreground mb-4"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Für Eltern und Erziehungsberechtigte
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Ferdy der Fuchs wurde entwickelt, um Kindern wichtige Lebenskompetenzen spielerisch
            beizubringen – und unterstützt die sozial-emotionale Entwicklung.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left feature cards */}
          <div className="space-y-5">
            {features.slice(0, 2).map((f, i) => (
              <div
                key={f.title}
                className="ferdy-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3
                  className="text-lg mb-2 text-foreground"
                  style={{ fontFamily: "'Baloo 2', cursive" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Center image */}
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl opacity-20 blur-3xl"
                style={{ background: "hsl(var(--secondary))" }}
              />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full max-w-xs aspect-square">
                <img
                  src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/parents_donut.png"
                  alt="Ferdy Donut Grafik"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right feature cards */}
          <div className="space-y-5">
            {features.slice(2).map((f, i) => (
              <div
                key={f.title}
                className="ferdy-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${(i + 2) * 0.15}s` }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3
                  className="text-lg mb-2 text-foreground"
                  style={{ fontFamily: "'Baloo 2', cursive" }}
                >
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
