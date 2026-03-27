import { useState, useEffect } from "react";
import { FerdyHeader } from "@/components/FerdyHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGameProgress } from "@/hooks/useGameProgress";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Wand2, BookOpen, Lightbulb } from "lucide-react";

const FERDY_GIF = "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_blink.gif";

// Grün/Blau Farbpalette (original Ferdy-Farben)
const COLORS = {
  green: "#4CAF50",
  greenLight: "#E8F5E9",
  greenDark: "#2E7D32",
  blue: "#a3c5d3",
  blueLight: "#E3F2FD",
  blueDark: "#0d6e8a",
  teal: "#00897B",
  tealLight: "#E0F2F1",
  bg: "#eef3f7",
};

type Phase = "start" | "writing" | "result";

interface TermStatus {
  term: string;
  used: boolean;
}

const Erzaehlzauber = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { completeGame } = useGameProgress();

  const isLoggedIn = !!user;
  const displayName = user?.email?.split("@")[0] || "";

  const [terms, setTerms] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [phase, setPhase] = useState<Phase>("start");
  const [isGenerating, setIsGenerating] = useState(false);
  const [termStatuses, setTermStatuses] = useState<TermStatus[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Live word count + term checking while writing
  useEffect(() => {
    if (phase !== "writing") return;
    const words = story.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);

    if (terms.length > 0) {
      setTermStatuses(
        terms.map((term) => {
          const regex = new RegExp(`${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
          return { term, used: regex.test(story) };
        }),
      );
    }
  }, [story, terms, phase]);

  const generateTerms = async () => {
    setIsGenerating(true);
    setStory("");
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-story-terms");
      if (error) throw error;
      if (data?.terms && Array.isArray(data.terms) && data.terms.length >= 3) {
        const t = data.terms.slice(0, 3);
        setTerms(t);
        setTermStatuses(t.map((term) => ({ term, used: false })));
        setPhase("writing");
      } else {
        throw new Error("Nicht genügend Begriffe erhalten");
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Fehler", description: "Begriffe konnten nicht generiert werden.", variant: "destructive" });
      const fallback = ["Hund", "Regenbogen", "Schokolade"];
      setTerms(fallback);
      setTermStatuses(fallback.map((term) => ({ term, used: false })));
      setPhase("writing");
    } finally {
      setIsGenerating(false);
    }
  };

  const checkStory = () => {
    const text = story.trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const usedCount = termStatuses.filter((t) => t.used).length;
    const allUsed = usedCount === 3;
    const longEnough = words >= 50;
    const isSuccess = allUsed && longEnough;

    let msg = "";
    if (isSuccess) {
      msg = "🎉 Fantastisch! Du hast alle Begriffe eingebaut und mindestens 50 Wörter geschrieben. Super Geschichte!";
      if (user) {
        completeGame({ game_name: "Erzählzauber", game_category: "communication", score: 100, success: true });
      }
    } else if (!allUsed && !longEnough) {
      msg = `Noch ${3 - usedCount} Begriff${3 - usedCount !== 1 ? "e" : ""} fehlen und du brauchst noch ${50 - words} Wörter mehr.`;
    } else if (!allUsed) {
      msg = `Fast! Noch ${3 - usedCount} Begriff${3 - usedCount !== 1 ? "e" : ""} fehlen in deiner Geschichte.`;
    } else {
      msg = `Gut! Alle Begriffe sind drin – schreibe noch ${50 - words} Wörter mehr.`;
    }

    setResultMsg(msg);
    setSuccess(isSuccess);
    setPhase("result");
  };

  const resetGame = () => {
    setTerms([]);
    setTermStatuses([]);
    setStory("");
    setResultMsg("");
    setSuccess(false);
    setWordCount(0);
    setPhase("start");
  };

  const setResult = (s: string) => setResultMsg(s);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.green }} />
      </div>
    );
  }

  const usedCount = termStatuses.filter((t) => t.used).length;
  const progressPct = Math.min(100, (wordCount / 50) * 100);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />

      <main className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate("/loesungsorientierung")}
            className="flex items-center gap-2 text-sm font-semibold mb-6 transition-colors hover:opacity-70"
            style={{ color: COLORS.blueDark }}
          >
            <ArrowLeft size={16} /> Zurück zur Übersicht
          </button>

          <div className="grid md:grid-cols-12 gap-6">
            {/* ── LEFT PANEL ── */}
            <div className="md:col-span-4 space-y-4">
              {/* Ferdy image */}
              <div className="rounded-3xl overflow-hidden shadow-lg" style={{ background: COLORS.blueLight }}>
                <div
                  className="w-full"
                  style={{
                    height: "240px",
                    backgroundImage: `url('${FERDY_GIF}')`,
                    backgroundSize: "contain",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>

              {/* Info card */}
              <Card className="p-5 rounded-3xl border-0" style={{ boxShadow: "0 4px 20px rgba(76,175,80,0.12)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={18} style={{ color: COLORS.green }} />
                  <h3 className="font-bold text-foreground" style={{ fontFamily: "'Baloo 2', cursive" }}>
                    Erzählzauber
                  </h3>
                </div>
                <p className="text-sm text-foreground/65 leading-relaxed mb-4">
                  Drei zufällige Begriffe – eine Geschichte. Lustig, spannend oder völlig verrückt! Baue alle drei
                  Wörter ein und schreibe mindestens <strong>50 Wörter</strong>.
                </p>

                <div className="rounded-2xl p-3 mb-4 text-sm" style={{ background: COLORS.greenLight }}>
                  <p className="font-semibold mb-1" style={{ color: COLORS.greenDark }}>
                    <span className="mr-1">📖</span> Beispiel
                  </p>
                  <p className="text-foreground/65 text-xs leading-relaxed">
                    <em>Begriffe: Drache, Eiscreme, Schule</em>
                    <br />
                    „An einem heißen Tag landete ein Drache auf dem Schulhof und verteilte Eiscreme …"
                  </p>
                </div>

                <div className="rounded-2xl p-3 text-sm" style={{ background: COLORS.tealLight }}>
                  <p className="font-semibold mb-1 flex items-center gap-1" style={{ color: COLORS.teal }}>
                    <Lightbulb size={13} /> Tipp
                  </p>
                  <p className="text-foreground/65 text-xs">
                    Beugungen zählen auch – „Hund", „Hunde" oder „Hündchen" sind alle gültig!
                  </p>
                </div>
              </Card>

              {/* Live term checker – only during writing */}
              {phase === "writing" && terms.length > 0 && (
                <Card className="p-4 rounded-3xl border-0" style={{ boxShadow: "0 4px 20px rgba(76,175,80,0.1)" }}>
                  <p className="text-xs font-bold mb-3 text-foreground/50 uppercase tracking-wide">Begriffe</p>
                  <div className="space-y-2">
                    {termStatuses.map(({ term, used }) => (
                      <div key={term} className="flex items-center gap-2">
                        {used ? (
                          <CheckCircle2 size={16} style={{ color: COLORS.green }} />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "#CBD5E1" }} />
                        )}
                        <span
                          className={`text-sm font-semibold ${used ? "" : "text-foreground/50"}`}
                          style={used ? { color: COLORS.greenDark } : {}}
                        >
                          {term}
                        </span>
                        {used && (
                          <span className="text-xs ml-auto" style={{ color: COLORS.green }}>
                            ✓ eingebaut
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Word count bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-foreground/50 mb-1">
                      <span>Wörter</span>
                      <span style={{ color: wordCount >= 50 ? COLORS.green : undefined }}>{wordCount} / 50</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "#E2E8F0" }}>
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${progressPct}%`,
                          background:
                            wordCount >= 50
                              ? `linear-gradient(90deg, ${COLORS.green}, ${COLORS.teal})`
                              : `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.blueDark})`,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* ── RIGHT GAME AREA ── */}
            <div className="md:col-span-8">
              <Card
                className="rounded-3xl border-0 overflow-hidden"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
              >
                {/* Top colour bar */}
                <div
                  className="h-2"
                  style={{ background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.blue})` }}
                />

                <div className="p-8">
                  {/* ── START ── */}
                  {phase === "start" && (
                    <div className="text-center space-y-6 py-6">
                      <div className="text-6xl">✨</div>
                      <h2
                        className="text-2xl font-extrabold text-foreground"
                        style={{ fontFamily: "'Baloo 2', cursive" }}
                      >
                        Willkommen beim Erzählzauber!
                      </h2>
                      <p className="text-foreground/60 max-w-md mx-auto leading-relaxed">
                        Drei zufällige Wörter – deine Fantasie macht daraus eine ganze Geschichte. Klick auf den Button
                        und leg los!
                      </p>
                      <Button
                        onClick={generateTerms}
                        disabled={isGenerating}
                        size="lg"
                        className="rounded-full px-10 font-bold text-white flex items-center gap-2 mx-auto"
                        style={{
                          background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.teal})`,
                          boxShadow: "0 6px 20px rgba(76,175,80,0.4)",
                        }}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" /> Generiere Begriffe…
                          </>
                        ) : (
                          <>
                            <Wand2 size={16} /> Begriffe generieren
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* ── WRITING ── */}
                  {phase === "writing" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <h2
                          className="text-xl font-extrabold text-foreground"
                          style={{ fontFamily: "'Baloo 2', cursive" }}
                        >
                          Schreib deine Geschichte!
                        </h2>
                        <button
                          onClick={generateTerms}
                          disabled={isGenerating}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-70"
                          style={{ background: COLORS.blueLight, color: COLORS.blueDark }}
                        >
                          <RefreshCw size={12} className={isGenerating ? "animate-spin" : ""} />
                          Neue Begriffe
                        </button>
                      </div>

                      {/* Term cards */}
                      <div className="flex gap-3 flex-wrap">
                        {termStatuses.map(({ term, used }) => (
                          <div
                            key={term}
                            className="flex-1 min-w-[120px] rounded-2xl p-4 text-center transition-all duration-300"
                            style={{
                              background: used ? COLORS.greenLight : "white",
                              border: `2px solid ${used ? COLORS.green : "#E2E8F0"}`,
                            }}
                          >
                            <div
                              className="font-extrabold text-lg"
                              style={{ fontFamily: "'Baloo 2', cursive", color: used ? COLORS.greenDark : "#334155" }}
                            >
                              {term}
                            </div>
                            {used && (
                              <div className="text-xs mt-1" style={{ color: COLORS.green }}>
                                ✓ eingebaut
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Textarea */}
                      <div>
                        <Textarea
                          value={story}
                          onChange={(e) => setStory(e.target.value)}
                          placeholder="Hier ist deine leere Seite – lass deiner Fantasie freien Lauf …"
                          className="min-h-[220px] resize-y text-base rounded-2xl border-2 focus:outline-none transition-colors"
                          style={{ borderColor: "#E2E8F0", fontFamily: "'Nunito', sans-serif" }}
                        />
                        <div className="flex justify-between mt-2 text-xs text-foreground/40">
                          <span>{usedCount}/3 Begriffe eingebaut</span>
                          <span style={{ color: wordCount >= 50 ? COLORS.green : undefined }}>
                            {wordCount} Wörter {wordCount >= 50 ? "✓" : `(noch ${50 - wordCount} mehr)`}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={checkStory}
                        disabled={story.trim().length < 10}
                        size="lg"
                        className="w-full rounded-full font-bold text-white"
                        style={{
                          background:
                            story.trim().length >= 10
                              ? `linear-gradient(90deg, ${COLORS.green}, ${COLORS.teal})`
                              : undefined,
                          boxShadow: story.trim().length >= 10 ? "0 6px 20px rgba(76,175,80,0.35)" : undefined,
                        }}
                      >
                        Geschichte auswerten ✓
                      </Button>
                    </div>
                  )}

                  {/* ── RESULT ── */}
                  {phase === "result" && (
                    <div className="space-y-6">
                      {/* Result banner */}
                      <div
                        className="rounded-2xl p-5 flex items-start gap-4"
                        style={{ background: success ? COLORS.greenLight : COLORS.blueLight }}
                      >
                        {success ? (
                          <CheckCircle2 size={28} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.green }} />
                        ) : (
                          <AlertCircle size={28} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.blueDark }} />
                        )}
                        <div>
                          <p
                            className="font-bold text-lg"
                            style={{
                              fontFamily: "'Baloo 2', cursive",
                              color: success ? COLORS.greenDark : COLORS.blueDark,
                            }}
                          >
                            {success ? "Wunderbar gemacht!" : "Fast geschafft!"}
                          </p>
                          <p className="text-sm mt-1" style={{ color: success ? COLORS.greenDark : COLORS.blueDark }}>
                            {resultMsg}
                          </p>
                        </div>
                      </div>

                      {/* Term statuses */}
                      <div>
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-wide mb-3">
                          Begriffe-Check
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {termStatuses.map(({ term, used }) => (
                            <div
                              key={term}
                              className="rounded-2xl p-3 text-center"
                              style={{
                                background: used ? COLORS.greenLight : "#FFF5F5",
                                border: `2px solid ${used ? COLORS.green : "#FECACA"}`,
                              }}
                            >
                              <div className="text-lg mb-1">{used ? "✅" : "❌"}</div>
                              <div className="font-bold text-sm" style={{ color: used ? COLORS.greenDark : "#B91C1C" }}>
                                {term}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl p-4 text-center" style={{ background: COLORS.blueLight }}>
                          <p
                            className="text-2xl font-extrabold"
                            style={{ fontFamily: "'Baloo 2', cursive", color: COLORS.blueDark }}
                          >
                            {wordCount}
                          </p>
                          <p className="text-xs font-semibold mt-1" style={{ color: COLORS.blueDark }}>
                            Wörter geschrieben
                          </p>
                        </div>
                        <div className="rounded-2xl p-4 text-center" style={{ background: COLORS.greenLight }}>
                          <p
                            className="text-2xl font-extrabold"
                            style={{ fontFamily: "'Baloo 2', cursive", color: COLORS.greenDark }}
                          >
                            {termStatuses.filter((t) => t.used).length}/3
                          </p>
                          <p className="text-xs font-semibold mt-1" style={{ color: COLORS.greenDark }}>
                            Begriffe eingebaut
                          </p>
                        </div>
                      </div>

                      {/* Your story */}
                      <div>
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-wide mb-2">
                          Deine Geschichte
                        </p>
                        <div
                          className="rounded-2xl p-4 text-sm text-foreground/70 leading-relaxed italic"
                          style={{ background: "#F8FAFF", borderLeft: `4px solid ${COLORS.blue}` }}
                        >
                          {story}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-wrap gap-3">
                        {!success && (
                          <Button
                            onClick={() => setPhase("writing")}
                            variant="outline"
                            className="flex-1 rounded-full font-bold border-2"
                            style={{ borderColor: COLORS.green, color: COLORS.green }}
                          >
                            Geschichte verbessern ✏️
                          </Button>
                        )}
                        <Button
                          onClick={resetGame}
                          className="flex-1 rounded-full font-bold text-white"
                          style={{
                            background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.teal})`,
                            boxShadow: "0 4px 14px rgba(76,175,80,0.4)",
                          }}
                        >
                          {success ? "Neue Geschichte schreiben 🎉" : "Neu starten"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Erzaehlzauber;
