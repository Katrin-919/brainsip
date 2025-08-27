import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface FerdyHeaderProps {
  isLoggedIn?: boolean;
  displayName?: string;
}

export const FerdyHeader = ({ isLoggedIn = false, displayName }: FerdyHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleAuthAction = (action: 'login' | 'register' | 'logout') => {
    if (action === 'logout') {
      signOut();
    } else {
      navigate('/auth');
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/90 backdrop-blur-md px-4 md:px-12 py-4 shadow-lg">
      <div className="flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_goodbye.png"
            alt="Ferdy der Fuchs"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="text-xl md:text-2xl font-extrabold text-secondary-foreground uppercase tracking-wide">
            Ferdy der Fuchs
          </span>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-8">
          <button 
            onClick={() => navigate('/')}
            className="text-secondary-foreground font-semibold hover:text-accent hover:-translate-y-1 transition-all duration-300"
          >
            Startseite
          </button>
          <button 
            onClick={() => scrollToSection('games')}
            className="text-secondary-foreground font-semibold hover:text-accent hover:-translate-y-1 transition-all duration-300"
          >
            Spiele
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-secondary-foreground font-semibold hover:text-accent hover:-translate-y-1 transition-all duration-300"
          >
            Über Ferdy
          </button>
          <button 
            onClick={() => scrollToSection('parents')}
            className="text-secondary-foreground font-semibold hover:text-accent hover:-translate-y-1 transition-all duration-300"
          >
            Für Eltern
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')}
            className="text-secondary-foreground font-semibold hover:text-accent hover:-translate-y-1 transition-all duration-300"
          >
            Feedback
          </button>
          {isLoggedIn && (
            <button 
              onClick={() => navigate('/profile')}
              className="text-secondary-foreground font-semibold hover:text-accent hover:-translate-y-1 transition-all duration-300"
            >
              Mein Profil
            </button>
          )}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex gap-3 items-center">
          {isLoggedIn ? (
            <>
              <span className="text-secondary-foreground font-semibold mr-3">
                Willkommen, {displayName}
              </span>
              <Button 
                variant="default" 
                className="rounded-full"
                onClick={() => handleAuthAction('logout')}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={() => handleAuthAction('register')}
              >
                Registrieren
              </Button>
              <Button 
                variant="default" 
                className="rounded-full"
                onClick={() => handleAuthAction('login')}
              >
                Login
              </Button>
            </>
          )}
        </div>

        {/* Hamburger Menu - Mobile */}
        <button 
          className="md:hidden text-secondary-foreground text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-secondary rounded-lg p-4">
          <nav className="flex flex-col gap-4 mb-4">
            <button 
              onClick={() => navigate('/')}
              className="text-secondary-foreground font-semibold text-left"
            >
              Startseite
            </button>
            <button 
              onClick={() => scrollToSection('games')}
              className="text-secondary-foreground font-semibold text-left"
            >
              Spiele
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-secondary-foreground font-semibold text-left"
            >
              Über Ferdy
            </button>
            <button 
              onClick={() => scrollToSection('parents')}
              className="text-secondary-foreground font-semibold text-left"
            >
              Für Eltern
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-secondary-foreground font-semibold text-left"
            >
              Feedback
            </button>
            {isLoggedIn && (
              <button 
                onClick={() => navigate('/profile')}
                className="text-secondary-foreground font-semibold text-left"
              >
                Mein Profil
              </button>
            )}
          </nav>
          
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <span className="text-secondary-foreground font-semibold">
                  Willkommen, {displayName}
                </span>
                <Button 
                  variant="default" 
                  className="rounded-full w-full"
                  onClick={() => handleAuthAction('logout')}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="rounded-full w-full"
                  onClick={() => handleAuthAction('register')}
                >
                  Registrieren
                </Button>
                <Button 
                  variant="default" 
                  className="rounded-full w-full"
                  onClick={() => handleAuthAction('login')}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
