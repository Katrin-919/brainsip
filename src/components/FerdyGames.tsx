import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import emotionaleIntelligenzImg from "@/assets/emotionale-intelligenz.png";
import { ArrowRight } from "lucide-react";

const games = [
  {
    id: "loesungsorientierung",
    title: "Lösungsorientierung",
    description: "Löse knifflige Rätsel und werde Meister der Problemlösung!",
    image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/loesungsorientierung.png",
    route: "/loesungsorientierung",
    emoji: "🧩",
    color: "from-orange-100 to-amber-50",
    tag: "Denken",
    tagClass: "bg-orange-100 text-orange-600",
  },
  {
    id: "mindset",
    title: "Mindset",
    description: "Stärke deine Denkweise mit spannenden interaktiven Spielen!",
    image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/mindset.jpg",
    route: "/mindset",
    emoji: "💡",
    color: "from-yellow-100 to-amber-50",
    tag: "Wachstum",
    tagClass: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "konfliktloesung",
    title: "Konfliktlösung",
    description: "Hol dir smarte Tipps, um Konflikte im Alltag noch besser zu lösen!",
    image: "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/konflikt.png",
    route: "/konfliktloesung",
    emoji: "🤝",
    color: "from-blue-100 to-sky-50",
    tag: "Kommunikation",
    tagClass: "bg-blue-100 text-blue-600",
  },
  {
    id: "emotionale-intelligenz",
    title: "Emotionale Intelligenz",
    description: "Lerne deine Gefühle zu verstehen und zu regulieren!",
    image: null,
    route: "/emotionale-intelligenz",
    emoji: "❤️",
    color: "from-pink-100 to-rose-50",
    tag: "Gefühle",
    tagClass: "bg-pink-100 text-pink-600",
  },
];

export const FerdyGames = () => {
  const navigate = useNavigate();

  return (
    <section id="games" className="py-20 md:py-28" style={{ background: "hsl(35 50% 93%)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Heading */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="ferdy-badge mx-auto mb-4">🎮 Lernspiele</div>
          <h2 className="text-3xl md:text-5xl text-foreground mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Deine Lernabenteuer
          </h2>
          <p className="text-lg text-foreground/60 max-w-xl mx-auto">
            Spannende Spiele, die Spaß machen – und dabei echte Lebenskompetenzen trainieren.
          </p>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, i) => (
            <div
              key={game.id}
              className="ferdy-card group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => navigate(game.route)}
            >
              {/* Image area */}
              <div
                className={`relative h-44 bg-gradient-to-br ${game.color} flex items-center justify-center overflow-hidden`}
              >
                {game.image ? (
                  <img
                    src={game.id === "emotionale-intelligenz" ? emotionaleIntelligenzImg : game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={emotionaleIntelligenzImg}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {/* Emoji badge */}
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-lg">
                  {game.emoji}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 ${game.tagClass}`}
                >
                  {game.tag}
                </div>
                <h3
                  className="text-lg mb-2 text-foreground group-hover:text-primary transition-colors"
                  style={{ fontFamily: "'Baloo 2', cursive" }}
                >
                  {game.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed mb-4">{game.description}</p>
                <div className="flex items-center text-primary text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                  Entdecken <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All button */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-primary/30 text-primary hover:bg-primary hover:text-white font-bold px-8"
            onClick={() => document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })}
          >
            Alle 16 Spiele ansehen →
          </Button>
        </div>
      </div>
    </section>
  );
};
