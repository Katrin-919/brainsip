import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FerdyHeader } from '@/components/FerdyHeader';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function SagsMalAnders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [badSentence, setBadSentence] = useState<string>('Lade...');
  const [userInput, setUserInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  const loadBadSentence = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-bad-sentence');
      
      if (error) {
        console.error('Error loading sentence:', error);
        setBadSentence('Fehler beim Laden.');
        return;
      }

      setBadSentence(data?.sentence || 'Fehler beim Laden.');
    } catch (error) {
      console.error('Error:', error);
      setBadSentence('Fehler beim Laden.');
    }
  };

  // Load initial sentence on component mount
  useEffect(() => {
    loadBadSentence();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Lade...</div>
      </div>
    );
  }

  const checkRewrite = async () => {
    if (userInput.trim().length < 5) {
      setPopupMessage('Bitte schreibe eine etwas längere Antwort.');
      setShowPopup(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('check-rewrite', {
        body: {
          original: badSentence,
          rewrite: userInput
        }
      });

      if (error) {
        console.error('Error checking rewrite:', error);
        setPopupMessage('Technischer Fehler. Bitte versuche es erneut.');
      } else {
        setPopupMessage(data?.feedback || 'Fehler bei der Bewertung.');
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Technischer Fehler. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setUserInput('');
    loadBadSentence();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <FerdyHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-blue-200/60 rounded-3xl shadow-2xl p-6 flex flex-col lg:flex-row gap-6 min-h-[600px]">
          
          {/* Left Info Panel */}
          <aside className="lg:w-2/5 bg-white rounded-2xl shadow-lg p-6 relative">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                ℹ️ Spiel-Info
              </h3>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                „Sag's mal anders" – Worum geht's?
              </h2>
              
              <p className="text-sm text-slate-700 leading-relaxed">
                Manchmal rutscht uns ein Satz heraus, der andere verletzt. 
                In diesem Spiel übst du, unfreundliche Formulierungen in freundliche, wertschätzende Sprache zu verwandeln.
              </p>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-800">So spielst du</h3>
                <ul className="text-sm space-y-1 text-slate-700 list-disc list-inside">
                  <li>Lies den roten Beispielsatz.</li>
                  <li>Formuliere ihn freundlich und respektvoll um.</li>
                  <li>Klicke auf <strong>„Antwort abschicken"</strong> und lies das Feedback.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-800">💡 Tipp</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Nutze Ich‑Botschaften, vermeide Vorwürfe und bleib konkret: 
                  „Ich wünsche mir …", „Können wir …?", „Mir hilft es, wenn …".
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/konfliktloesung')}
              className="absolute bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Zurück
            </Button>
          </aside>

          {/* Right Game Panel */}
          <section className="lg:w-3/5 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-6">
            
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/f402e6b2-cfe9-4c7d-9969-484f52c0ccec.png" 
                alt="Schlauer Fuchs" 
                className="w-44 h-auto rounded-2xl"
              />
            </div>

            <h1 className="text-3xl font-bold text-center text-slate-800">
              Sag's mal anders
            </h1>

            <p className="text-base text-slate-700 text-center max-w-2xl">
              Formuliere den folgenden Satz freundlich um:
            </p>

            <div className="w-full max-w-2xl bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-red-700">
                {badSentence}
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Deine freundliche Version hier..."
                className="min-h-32 text-base border-2 border-slate-300 focus:border-blue-500"
              />
            </div>

            <Button
              onClick={checkRewrite}
              disabled={userInput.trim().length === 0 || isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-base"
            >
              {isSubmitting ? 'Wird bewertet...' : 'Antwort abschicken'}
            </Button>
          </section>
        </div>
      </main>

      {/* Popup */}
      {showPopup && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClosePopup}
          />
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 z-50 w-11/12 max-w-md text-center shadow-2xl">
            <p className="text-slate-800 mb-6 leading-relaxed">
              {popupMessage}
            </p>
            <Button
              onClick={handleClosePopup}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Schließen
            </Button>
          </div>
        </>
      )}
    </div>
  );
}