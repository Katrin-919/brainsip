import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";

interface FerdyHeaderProps {
  isLoggedIn?: boolean;
  displayName?: string;
}

export const FerdyHeader = ({ isLoggedIn = false, displayName }: FerdyHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleAuthAction = (action: "login" | "register" | "logout") => {
    if (action === "logout") signOut();
    else navigate("/auth");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: "Startseite", action: () => navigate("/") },
    { label: "Spiele",     action: () => scrollToSection("games") },
    { label: "Über Ferdy", action: () => scrollToSection("about") },
    { label: "Für Eltern", action: () => scrollToSection("parents") },
    { label: "Feedback",   action: () => scrollToSection("testimonials") },
    ...(isLoggedIn ? [{ label: "Mein Profil", action: () => navigate("/profile") }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-200 bg-orange-100">
            <img
              src="https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_goodbye.png"
              alt="Ferdy der Fuchs"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Baloo 2', cursive", color: "hsl(var(--primary))" }}
          >
            Ferdy der Fuchs
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-orange-50 transition-all duration-200"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm font-semibold text-foreground/70">
                Hallo, {displayName} 👋
              </span>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white"
                onClick={() => handleAuthAction("logout")}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full font-semibold text-foreground/70"
                onClick={() => handleAuthAction("login")}
              >
                Login
              </Button>
              <Button
                size="sm"
                className="rounded-full font-bold px-5"
                style={{ background: "hsl(var(--primary))", boxShadow: "var(--shadow-button)" }}
                onClick={() => handleAuthAction("register")}
              >
                Kostenlos starten 🚀
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-orange-50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} className="text-primary" /> : <Menu size={22} className="text-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-orange-100 px-4 py-4 space-y-1 animate-fade-in-up">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="w-full text-left px-4 py-3 rounded-xl font-semibold text-foreground hover:bg-orange-50 hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-orange-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <Button className="w-full rounded-full" onClick={() => handleAuthAction("logout")}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" className="w-full rounded-full" onClick={() => handleAuthAction("login")}>
                  Login
                </Button>
                <Button className="w-full rounded-full font-bold" onClick={() => handleAuthAction("register")}>
                  Kostenlos starten 🚀
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
