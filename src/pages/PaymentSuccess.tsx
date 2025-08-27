import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const sessionId = searchParams.get('session_id');
  const category = searchParams.get('category');
  const plays = searchParams.get('plays');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setVerifying(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) throw error;

      if (data.success) {
        setVerified(true);
        toast.success('Zahlung erfolgreich! Zusätzliche Spiele wurden hinzugefügt.');
      } else {
        toast.error('Zahlung konnte nicht verifiziert werden.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Fehler bei der Zahlungsverifikation');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {verifying ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            ) : verified ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <AlertCircle className="h-16 w-16 text-yellow-500" />
            )}
          </div>
          <CardTitle>
            {verifying 
              ? "Zahlung wird überprüft..." 
              : verified 
                ? "Zahlung erfolgreich!" 
                : "Zahlung ausstehend"
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Du hast erfolgreich {plays} zusätzliche Spiele für die Kategorie "{category}" erworben!
              </p>
            </div>
          )}
          
          {!verifying && !verified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Die Zahlung wird noch verarbeitet. Bitte versuche es in wenigen Minuten erneut.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
              disabled={verifying}
            >
              Zurück zu den Spielen
            </Button>
            
            {!verifying && !verified && (
              <Button 
                onClick={verifyPayment} 
                variant="outline" 
                className="w-full"
              >
                Status erneut prüfen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;