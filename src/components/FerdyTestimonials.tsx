import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Lisa, 9 Jahre",
    quote: "Ferdy ist mein bester Freund! Die Rätsel machen so viel Spaß und ich lerne jeden Tag etwas Neues!",
    avatar: "🦊",
    stars: 5,
    color: "from-orange-50 to-amber-50 border-orange-200",
  },
  {
    name: "Max, 11 Jahre",
    quote: "Seit ich mit Ferdy übe, kann ich viel besser mit meiner Schwester reden, wenn wir uns streiten.",
    avatar: "🌟",
    stars: 5,
    color: "from-blue-50 to-sky-50 border-blue-200",
  },
  {
    name: "Emma, 10 Jahre",
    quote: "Die Geschichten von Ferdy sind so spannend! Und die Spiele helfen mir, nicht so schnell aufzugeben.",
    avatar: "💫",
    stars: 5,
    color: "from-pink-50 to-rose-50 border-pink-200",
  },
];

export const FerdyTestimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28" style={{ background: "hsl(35 50% 93%)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="ferdy-badge mx-auto mb-4">💬 Feedback</div>
          <h2 className="text-3xl md:text-5xl text-foreground" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Was unsere kleinen <span className="text-primary">Abenteurer</span> sagen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative bg-gradient-to-br ${t.color} border rounded-3xl p-7 animate-fade-in-up ferdy-transition hover:-translate-y-2`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Quote icon */}
              <Quote size={28} className="text-foreground/10 absolute top-5 right-5" fill="currentColor" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} size={14} fill="hsl(var(--ferdy-yellow))" color="hsl(var(--ferdy-yellow))" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 leading-relaxed mb-5 text-base italic">"{t.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <span className="font-bold text-foreground">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
