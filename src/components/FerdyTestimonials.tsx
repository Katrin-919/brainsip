const testimonials = [
  {
    name: 'Lisa, 9 Jahre',
    quote: 'Ferdy ist mein bester Freund! Die Rätsel machen so viel Spaß und ich lerne jeden Tag etwas Neues!'
  },
  {
    name: 'Max, 11 Jahre', 
    quote: 'Seit ich mit Ferdy übe, kann ich viel besser mit meiner Schwester reden, wenn wir uns streiten.'
  },
  {
    name: 'Emma, 10 ahre',
    quote: 'Die Geschichten von Ferdy sind so spannend! Und die Spiele helfen mir, nicht so schnell aufzugeben.'
  }
];

export const FerdyTestimonials = () => {
  return (
    <section id="testimonials" className="bg-muted py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
            Was unsere kleinen{' '}
            <span className="text-blue-600">Abenteurer</span>{' '}
            sagen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white border-2 border-blue-200 rounded-2xl p-6 relative ferdy-shadow-card hover:ferdy-shadow-card-hover ferdy-transition"
            >
              {/* Quote marks */}
              <div className="absolute -top-3 left-4 text-4xl text-blue-400 font-bold leading-none">
                "
              </div>
              <div className="absolute -bottom-4 right-4 text-4xl text-blue-400 font-bold leading-none">
                "
              </div>

              {/* Content */}
              <div className="pt-4 pb-2">
                <div className="font-bold text-foreground mb-3">
                  {testimonial.name}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};