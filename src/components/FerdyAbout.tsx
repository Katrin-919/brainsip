export const FerdyAbout = () => {
  return (
    <section id="about" className="ferdy-gradient-section py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
              Wer ist Ferdy der Fuchs?
            </h2>
            
            <div className="space-y-4 text-foreground leading-relaxed">
              <p className="text-lg">
                Ferdy ist ein neugieriger, schlauer Fuchs, der Kinder auf ihren Lernabenteuern begleitet. 
                Mit seinen großen Augen und dem buschigen Schwanz ist er immer bereit, neue Herausforderungen 
                zu meistern und wichtige Fähigkeiten zu entdecken.
              </p>
              
              <p className="text-lg">
                Unser fuchsstarker Freund hilft dir, spielerisch zu lernen – mit Geschichten, Rätseln und 
                Aufgaben, die richtig Spaß machen. Er zeigt dir, wie du Probleme mutig anpackst, ruhig bleibst, 
                wenn's knifflig wird, und mehrere Ideen findest, statt nur eine. Mal knobelst du, mal erzählst 
                du Geschichten, mal baust du kreative Lösungen – und jedes Mal wirst du ein Stückchen besser.
              </p>
            </div>
          </div>

          {/* Ferdy dancing GIF */}
          <div className="bg-white rounded-3xl p-8 ferdy-shadow-card">
            <div className="aspect-square flex items-center justify-center">
              <img 
                src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_dancearound.gif"
                alt="Ferdy tanzt herum"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};