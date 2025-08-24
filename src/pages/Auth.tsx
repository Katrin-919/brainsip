import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import ferdyFox from '@/assets/ferdy-fox.png';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen ferdy-gradient-hero flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-3xl ferdy-shadow-card p-8">
        <div className="text-center">
          <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
            <img src={ferdyFox} alt="Ferdy der Fuchs" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {isLogin ? 'Willkommen zurück!' : 'Jetzt registrieren!'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-foreground">
              E-Mail-Adresse
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Mail eingeben"
              required
              className="mt-2 ferdy-transition"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Passwort
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort eingeben"
              required
              className="mt-2 ferdy-transition"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-full ferdy-transition"
          >
            {loading ? 'Bitte warten...' : (isLogin ? 'Anmelden' : 'Registrieren')}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          {isLogin ? 'Noch kein Konto?' : 'Bereits ein Konto?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold hover:underline ferdy-transition"
          >
            {isLogin ? 'Jetzt registrieren' : 'Jetzt anmelden'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;