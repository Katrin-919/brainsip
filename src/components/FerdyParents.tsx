export const FerdyParents = () => {
  const features = [
    {
      title: 'Pädagogisch wertvoll',
      description: 'Von Expert:innen entwickelt und an kindliche Lernprozesse angepasst.',
      position: 'top-left'
    },
    {
      title: 'Sicher & geschützt', 
      description: 'Werbefreie und kindgerechte Umgebung.',
      position: 'top-right'
    },
    {
      title: 'Gemeinsam lernen',
      description: 'Aktivitäten für die ganze Familie.',
      position: 'bottom-left'
    },
    {
      title: 'Fortschritt sehen',
      description: 'Verfolgen Sie die Lernentwicklung Ihres Kindes.',
      position: 'bottom-right'
    }
  ];

  return (
    <section id="parents" className="ferdy-gradient-section py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Für Eltern und Erziehungsberechtigte
          </h2>
          <p className="text-lg md:text-xl text-foreground leading-relaxed max-w-4xl mx-auto">
            Ferdy der Fuchs wurde entwickelt, um Kindern wichtige Lebenskompetenzen spielerisch beizubringen.
            Unsere Inhalte fördern nicht nur den Spaß am Lernen, sondern unterstützen auch die sozial-emotionale 
            Entwicklung Ihres Kindes.
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-8 h-[400px]">
          {/* Top Left */}
          <div className="bg-white rounded-2xl p-6 ferdy-shadow-card flex flex-col justify-center">
            <h3 className="text-xl font-bold text-foreground mb-3">
              {features[0].title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {features[0].description}
            </p>
          </div>

          {/* Center - Donut Image */}
          <div className="row-span-2 flex items-center justify-center">
            <div className="w-full max-w-md aspect-square bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center ferdy-shadow-card">
              <span className="text-8xl">📚</span>
            </div>
          </div>

          {/* Top Right */}
          <div className="bg-white rounded-2xl p-6 ferdy-shadow-card flex flex-col justify-center">
            <h3 className="text-xl font-bold text-foreground mb-3">
              {features[1].title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {features[1].description}
            </p>
          </div>

          {/* Bottom Left */}
          <div className="bg-white rounded-2xl p-6 ferdy-shadow-card flex flex-col justify-center">
            <h3 className="text-xl font-bold text-foreground mb-3">
              {features[2].title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {features[2].description}
            </p>
          </div>

          {/* Bottom Right */}
          <div className="bg-white rounded-2xl p-6 ferdy-shadow-card flex flex-col justify-center">
            <h3 className="text-xl font-bold text-foreground mb-3">
              {features[3].title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {features[3].description}
            </p>
          </div>
        </div>

        {/* Mobile/Tablet Stacked Layout */}
        <div className="lg:hidden space-y-6">
          {/* Image first on mobile */}
          <div className="flex justify-center">
            <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center ferdy-shadow-card">
              <span className="text-8xl">📚</span>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 ferdy-shadow-card">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};