import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Clock } from 'lucide-react';
import { useGameProgress } from '@/hooks/useGameProgress';

interface GameLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameCategory: 'mindset' | 'communication' | 'problem_solving' | 'conflict_resolution' | 'emotional_intelligence';
  onPurchase?: () => void;
}

const GameLimitModal = ({ isOpen, onClose, gameCategory, onPurchase }: GameLimitModalProps) => {
  const { purchaseAdditionalPlays } = useGameProgress();

  const handlePurchase = async () => {
    const result = await purchaseAdditionalPlays(gameCategory, 1);
    if (result.success) {
      onPurchase?.();
      onClose();
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      'mindset': 'Mindset',
      'communication': 'Kommunikation',
      'problem_solving': 'Problemlösung',
      'conflict_resolution': 'Konfliktlösung',
      'emotional_intelligence': 'Emotionale Intelligenz'
    };
    return names[category] || category;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tägliches Limit erreicht
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Du hast heute bereits dein kostenloses Spiel in der Kategorie
            </p>
            <p className="font-semibold text-lg">
              {getCategoryDisplayName(gameCategory)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              gespielt.
            </p>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Weiterspielen für nur 2,99€
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Kaufe ein zusätzliches Spiel für heute und setze dein Lernabenteuer fort!
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Sofortiger Zugang</li>
              <li>• Punkte sammeln</li>
              <li>• Fortschritt verfolgen</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Später
            </Button>
            <Button onClick={handlePurchase} className="flex-1">
              Für 2,99€ kaufen
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Morgen steht dir wieder ein kostenloses Spiel zur Verfügung!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameLimitModal;