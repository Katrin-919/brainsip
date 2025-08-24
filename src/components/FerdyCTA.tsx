import { Button } from "@/components/ui/button";

export const FerdyCTA = () => {
  return (
    <section id="cta" className="ferdy-gradient-section py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Bereit für dein{' '}
              <span className="text-blue-600">Abenteuer</span>{' '}
              mit Ferdy?
            </h2>
            
            <div className="space-y-4 text-foreground leading-relaxed">
              <p className="text-lg">
                Tauche in die Welt von Ferdy dem Fuchs ein und starte noch heute dein erstes Lernabenteuer! 
                Registriere dich kostenlos und entdecke spannende Aktivitäten, die auf dich warten.
              </p>
              
              <p className="text-lg">
                Ferdy freut sich schon darauf, dich kennenzulernen und gemeinsam die Welt des spielerischen 
                Lernens zu erkunden!
              </p>
            </div>

            <div className="pt-4">
              <Button 
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-bold hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                onClick={() => {
                  // TODO: Navigate to registration page
                  console.log('Navigate to registration');
                }}
              >
                Jetzt kostenlos starten
              </Button>
            </div>
          </div>

          {/* Image placeholder */}
          <div className="bg-white rounded-3xl p-8 ferdy-shadow-card">
            <div className="aspect-square bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-8xl">🎉</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};