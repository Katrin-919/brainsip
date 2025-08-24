import { FerdyHeader } from "@/components/FerdyHeader";
import { FerdyHero } from "@/components/FerdyHero";
import { FerdyAbout } from "@/components/FerdyAbout";
import { FerdyGames } from "@/components/FerdyGames";
import { FerdyParents } from "@/components/FerdyParents";
import { FerdyTestimonials } from "@/components/FerdyTestimonials";
import { FerdyCTA } from "@/components/FerdyCTA";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;
  const displayName = user?.email?.split('@')[0] || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Lade...</p>
        </div>
      </div>
    );
  }

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
