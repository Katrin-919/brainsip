import { FerdyHeader } from "@/components/FerdyHeader";
import { FerdyHero } from "@/components/FerdyHero";
import { FerdyAbout } from "@/components/FerdyAbout";
import { FerdyGames } from "@/components/FerdyGames";
import { FerdyParents } from "@/components/FerdyParents";
import { FerdyTestimonials } from "@/components/FerdyTestimonials";
import { FerdyCTA } from "@/components/FerdyCTA";

const Index = () => {
  // TODO: Implement actual authentication state
  const isLoggedIn = false;
  const displayName = "";

  return (
    <div className="min-h-screen bg-background">
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />
      <main>
        <FerdyHero />
        <FerdyAbout />
        <FerdyGames />
        <FerdyParents />
        <FerdyTestimonials />
        <FerdyCTA />
      </main>
    </div>
  );
};

export default Index;
