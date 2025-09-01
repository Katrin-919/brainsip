import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName?: string;
}

export const LoginPromptModal = ({ isOpen, onClose, gameName }: LoginPromptModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Bitte alle Felder ausfüllen');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (isPasswordReset) {
        result = await resetPassword(email);
      } else {
        result = isLogin 
          ? await signIn(email, password)
          : await signUp(email, password);
      }
      
      if (!result.error) {
        onClose();
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setIsLoading(false);
    setIsPasswordReset(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {isPasswordReset ? 'Passwort zurücksetzen' : (gameName ? `${gameName} spielen` : 'Anmeldung erforderlich')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            {isPasswordReset 
              ? 'Gib deine E-Mail-Adresse ein, um ein neues Passwort anzufordern.'
              : 'Du musst angemeldet sein, um Spiele zu spielen.'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {!isPasswordReset && (
              <div>
                <Input
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Lädt...' : (isPasswordReset ? 'E-Mail senden' : (isLogin ? 'Anmelden' : 'Registrieren'))}
            </Button>
          </form>

          <div className="text-center space-y-2">
            {!isPasswordReset && (
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="block text-sm text-primary hover:underline mx-auto"
              >
                {isLogin 
                  ? 'Noch kein Account? Jetzt registrieren' 
                  : 'Bereits registriert? Anmelden'
                }
              </button>
            )}
            
            {isLogin && !isPasswordReset && (
              <button
                type="button"
                onClick={() => setIsPasswordReset(true)}
                className="block text-sm text-primary hover:underline mx-auto"
              >
                Passwort vergessen?
              </button>
            )}
            
            {isPasswordReset && (
              <button
                type="button"
                onClick={() => {
                  setIsPasswordReset(false);
                  setIsLogin(true);
                }}
                className="block text-sm text-primary hover:underline mx-auto"
              >
                Zurück zur Anmeldung
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};