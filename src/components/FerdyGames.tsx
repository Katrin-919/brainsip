import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const games = [
  {
    id: 'loesungsorientierung',
    title: 'Lösungsorientierung',
    description: 'Löse knifflige Rätsel und werde Meister der Problemlösung!',
    image: 'https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/loesungsorientierung.png',
    available: true,
    route: '/loesungsorientierung'
  },
  {
    id: 'mindset',
    title: 'Mindset',
    description: 'Stärke deine Denkweise mit spannenden interaktiven Spielen!',
    image: 'https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/mindset.jpg',
    available: true,
    route: '/mindset'
  },
  {
    id: 'konfliktloesung',
    title: 'Konfliktlösung',
    description: 'Hol dir smarte Tipps, um Konflikte im Alltag noch besser zu lösen!',
    image: 'https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/konflikt.png',
    available: true,
    route: '/konfliktloesung'
  },
  {
    id: 'emotionale-intelligenz',
    title: 'Emotionale Intelligenz',
    description: 'Modul befindet sich im Aufbau',
    image: 'https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/emotional.png',
    available: false,
    route: '#'
  }
];

export const FerdyGames = () => {
  return (
    <section id="games" className="bg-muted py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 relative">
            Deine Lernabenteuer
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-accent rounded-full" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {games.map((game) => (
            <Card 
              key={game.id}
              className="border-0 overflow-hidden ferdy-shadow-card hover:ferdy-shadow-card-hover hover:-translate-y-2 hover:scale-105 ferdy-transition group relative bg-white"
            >
              {/* Game Image */}
              <div className="h-48 bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center border-b-4 border-accent overflow-hidden">
                {game.id === 'emotionale-intelligenz' ? (
                  <Heart className="w-16 h-16 text-accent" />
                ) : (
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent ferdy-transition text-foreground">
                  {game.title}
                </h3>
                
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  {game.description}
                </p>

                <Button 
                  className="w-full rounded-full font-bold group-hover:scale-105 ferdy-transition"
                  onClick={() => {
                    if (game.available && game.route !== '#') {
                      window.location.href = game.route;
                    }
                  }}
                >
                  Entdecken
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};