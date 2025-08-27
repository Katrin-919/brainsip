import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Star } from "lucide-react";

const games = [
  {
    id: 'loesungsorientierung',
    title: 'Lösungsorientierung',
    description: 'Löse knifflige Rätsel und werde Meister der Problemlösung!',
    image: 'https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/loesungsorientierung.png',
    available: true,
    premium: false,
    route: '/loesungsorientierung'
  },
  {
    id: 'mindset',
    title: 'Mindset',
    description: 'Stärke deine Denkweise mit spannenden interaktiven Spielen!',
    image: 'https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/mindset.jpg',
    available: true,
    premium: false,
    route: '/mindset'
  },
  {
    id: 'konfliktloesung',
    title: 'Konfliktlösung',
    description: 'Hol dir smarte Tipps, um Konflikte im Alltag noch besser zu lösen!',
    image: 'https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/konflikt.png',
    available: true,
    premium: true,
    price: '2,99 €',
    route: '/konfliktloesung'
  },
  {
    id: 'emotionale-intelligenz',
    title: 'Emotionale Intelligenz',
    description: 'Verstehe und steuere deine Emotionen wie ein Profi!',
    image: 'https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/emotional.png',
    available: true,
    premium: true,
    price: '2,99 €',
    route: '/gefuehlsradar'
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
              className={`border-0 overflow-hidden ferdy-shadow-card hover:ferdy-shadow-card-hover hover:-translate-y-2 hover:scale-105 ferdy-transition group relative ${
                game.premium 
                  ? 'bg-gradient-to-br from-gray-100 to-gray-200 opacity-75 hover:opacity-90' 
                  : 'bg-white'
              }`}
            >
              {/* Premium Badge */}
              {game.premium && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                    <Lock className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}

              {/* Free Badge */}
              {!game.premium && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                    <Star className="w-3 h-3 mr-1" />
                    Kostenlos
                  </Badge>
                </div>
              )}

              {/* Game Image */}
              <div className={`h-48 bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center border-b-4 border-accent overflow-hidden ${
                game.premium ? 'grayscale' : ''
              }`}>
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Premium Overlay */}
                {game.premium && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Lock className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-bold text-lg">{game.price}</div>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <h3 className={`text-xl font-bold mb-2 group-hover:text-accent ferdy-transition ${
                  game.premium ? 'text-gray-600' : 'text-foreground'
                }`}>
                  {game.title}
                </h3>
                
                <p className={`mb-6 leading-relaxed ${
                  game.premium ? 'text-gray-500' : 'text-muted-foreground'
                }`}>
                  {game.description}
                </p>

                <Button 
                  className="w-full rounded-full font-bold group-hover:scale-105 ferdy-transition"
                  variant={game.premium ? "outline" : "default"}
                  onClick={() => {
                    if (game.available && game.route !== '#') {
                      window.location.href = game.route;
                    }
                  }}
                >
                  {game.premium ? `Kaufen für ${game.price}` : 'Kostenlos spielen'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};