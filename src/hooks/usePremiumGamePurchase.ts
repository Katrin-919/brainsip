import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePremiumGamePurchase = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const purchasePremiumGame = async (gameCategory: string) => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Du musst angemeldet sein, um Premium-Spiele zu kaufen.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { data, error } = await supabase.functions.invoke('purchase-additional-plays', {
        body: {
          game_category: gameCategory,
          additional_plays: 1
        }
      });

      if (error) {
        console.error('Error purchasing premium game:', error);
        toast({
          title: "Fehler beim Kauf",
          description: "Es gab ein Problem beim Öffnen des Bezahlvorgangs.",
          variant: "destructive",
        });
        return { success: false };
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error('Error purchasing premium game:', error);
      toast({
        title: "Fehler beim Kauf",
        description: "Es gab ein Problem beim Öffnen des Bezahlvorgangs.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return { purchasePremiumGame };
};