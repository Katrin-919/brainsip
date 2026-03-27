import { useState } from "react";
import { FerdyHeader } from "@/components/FerdyHeader";
import { useAuth } from "@/hooks/useAuth";
import { useGameProgress } from "@/hooks/useGameProgress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, Trophy, Lightbulb, CheckCircle2, XCircle } from "lucide-react";

interface Question {
  question: string;
  answerA: string;
  answerB: string;
  solutionOriented: "A" | "B";
}

type GamePhase = "start" | "playing" | "feedback" | "results";

const FERDY_GIF = "https://kbbcixkekoqoukzzdkxk.supabase.co/storage/v1/object/public/images/ferdy_halelu.gif";

const Denkweiser = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { completeGame } = useGameProgress();

  const isLoggedIn = !!user;
  const displayName = user?.email?.split("@")[0] || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("start");
  const [isGameLoading, setIsGameLoading] = useState(false);

  // ── derived ──────────────────────────────────────────────
  const currentQ = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const isCorrect = selectedAnswer !== null && currentQ && selectedAnswer === currentQ.solutionOriented;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  // ── helpers ───────────────────────────────────────────────
  const resultEmoji = () => {
    if (scorePercent >= 80) return "🎉";
    if (scorePercent >= 60) return "👍";
    return "💪";
  };

  const resultText = () => {
    if (scorePercent >= 80) return "Ausgezeichnet! Du bist ein echter Lösungsprofi!";
    if (scorePercent >= 60) return "Gut gemacht! Du denkst bereits lösungsorientiert!";
    return "Das war ein guter Start! Mit etwas Übung wirst du noch besser!";
  };

  // ── actions ───────────────────────────────────────────────
  const loadQuestions = async () => {
    setIsGameLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz-questions");
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.content && Array.isArray(data.content)) {
        setQuestions(data.content);
        setCurrentIndex(0);
        setCorrectCount(0);
        setSelectedAnswer(null);
        setPhase("playing");
      } else {
        throw new Error("Ungültige Antwort von der API");
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Fehler", description: "Fragen konnten nicht geladen werden.", variant: "destructive" });
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleSelect = (answer: "A" | "B") => {
    if (phase !== "playing") return;
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    if (!selectedAnswer || !currentQ) return;
    const correct = selectedAnswer === currentQ.solutionOriented;
    if (correct) setCorrectCount((c) => c + 1);
    setPhase("feedback");
  };

  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setPhase("playing");
    } else {
      // Game done — save progress
      const finalCorrect = correctCount + (selectedAnswer === currentQ?.solutionOriented ? 1 : 0);
      try {
        await completeGame({
          game_name: "Denkweiser",
          game_category: "problem_solving",
          score: Math.round((finalCorrect / questions.length) * 100),
          success: finalCorrect >= questions.length * 0.6,
        });
      } catch (_) {
        /* non-blocking */
      }
      setPhase("results");
    }
  };

  const resetGame = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setPhase("start");
  };

  // ── loading screen ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #FFF8F0 0%, #EEF6FF 100%)" }}>
      <FerdyHeader isLoggedIn={isLoggedIn} displayName={displayName} />

      <main className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate("/loesungsorientierung")}
            className="flex items-center gap-2 text-sm font-semibold mb-6 hover:text-primary transition-colors"
            style={{ color: "#7A5C40" }}
          >
            <ArrowLeft size={16} /> Zurück zur Übersicht
          </button>

          <div className="grid md:grid-cols-12 gap-6">
            {/* ── LEFT INFO PANEL ── */}
            <div className="md:col-span-4 space-y-4">
              {/* Ferdy */}
              <div
                className="rounded-3xl overflow-hidden shadow-lg"
                style={{ background: "linear-gradient(135deg,#FFF3E8,#FFF8F0)" }}
              >
                <div
                  className="w-full"
                  style={{
                    height: "220px",
                    backgroundImage: `url('${FERDY_GIF}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
              </div>

              {/* Info card */}
              <Card className="p-5 rounded-3xl border-0" style={{ boxShadow: "0 4px 20px rgba(249,115,22,0.1)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={18} style={{ color: "#F97316" }} />
                  <h3 className="font-bold text-foreground" style={{ fontFamily: "'Baloo 2', cursive" }}>
                    Denkweiser
                  </h3>
                </div>

                <p className="text-sm text-foreground/65 leading-relaxed mb-4">
                  Wähle in jeder Situation die <strong>lösungsorientierte</strong> Antwort – die, die alle Beteiligten
                  voranbringt.
                </p>

                <div className="rounded-2xl p-3 mb-4 text-sm" style={{ background: "#FFF3E8" }}>
                  <p className="font-semibold mb-1" style={{ color: "#C2470A" }}>
                    💡 Tipp
                  </p>
                  <p className="text-foreground/70">
                    Frag dich: <em>"Welche Option bringt alle am besten weiter?"</em>
                  </p>
                </div>

                <ul className="text-xs text-foreground/60 space-y-1.5">
                  {[
                    "Lies die Situation genau",
                    "Wähle A oder B",
                    "Bestätige deine Antwort",
                    "10 Fragen · direkt Feedback",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#F97316" }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Score during game */}
              {phase !== "start" && phase !== "results" && (
                <Card
                  className="p-4 rounded-3xl border-0 text-center"
                  style={{ boxShadow: "0 4px 20px rgba(249,115,22,0.1)" }}
                >
                  <p className="text-xs font-semibold text-foreground/50 mb-1">Punkte bisher</p>
                  <p className="text-3xl font-extrabold" style={{ fontFamily: "'Baloo 2', cursive", color: "#F97316" }}>
                    {correctCount}
                    <span className="text-base text-foreground/30">/{currentIndex}</span>
                  </p>
                </Card>
              )}
            </div>

            {/* ── RIGHT GAME AREA ── */}
            <div className="md:col-span-8">
              <Card
                className="rounded-3xl border-0 overflow-hidden"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
              >
                {/* Progress bar */}
                {(phase === "playing" || phase === "feedback") && (
                  <div className="h-2 w-full" style={{ background: "#FFF3E8" }}>
                    <div
                      className="h-2 transition-all duration-500"
                      style={{ width: `${progress}%`, background: "linear-gradient(90deg,#F97316,#FACC15)" }}
                    />
                  </div>
                )}

                <div className="p-8">
                  {/* ── START ── */}
                  {phase === "start" && (
                    <div className="text-center space-y-6 py-4">
                      <div className="text-6xl">🧠</div>
                      <h2
                        className="text-2xl font-extrabold text-foreground"
                        style={{ fontFamily: "'Baloo 2', cursive" }}
                      >
                        Bereit für den Denkweiser?
                      </h2>
                      <p className="text-foreground/65 max-w-md mx-auto leading-relaxed">
                        10 Alltagssituationen warten auf dich. Zeig, dass du lösungsorientiert denken kannst!
                      </p>
                      {isGameLoading ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                          <p className="text-sm text-foreground/50">Lade spannende Fragen...</p>
                        </div>
                      ) : (
                        <Button
                          onClick={loadQuestions}
                          size="lg"
                          className="rounded-full px-10 font-bold text-white"
                          style={{ background: "#F97316", boxShadow: "0 6px 20px rgba(249,115,22,0.4)" }}
                        >
                          Spiel starten 🚀
                        </Button>
                      )}
                    </div>
                  )}

                  {/* ── PLAYING ── */}
                  {(phase === "playing" || phase === "feedback") && currentQ && (
                    <div className="space-y-6">
                      {/* Question counter */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: "#FFF3E8", color: "#C2470A" }}
                        >
                          Frage {currentIndex + 1} von {questions.length}
                        </span>
                        {phase === "feedback" && (
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                              isCorrect ? "text-green-700" : "text-red-700"
                            }`}
                            style={{ background: isCorrect ? "#DCFCE7" : "#FEE2E2" }}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 size={12} /> Richtig!
                              </>
                            ) : (
                              <>
                                <XCircle size={12} /> Nicht ganz
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Question */}
                      <div className="rounded-2xl p-5" style={{ background: "#F8FAFF" }}>
                        <p className="text-lg font-bold text-foreground leading-relaxed">{currentQ.question}</p>
                      </div>

                      {/* Answer options */}
                      <div className="space-y-3">
                        {(["A", "B"] as const).map((letter) => {
                          const text = letter === "A" ? currentQ.answerA : currentQ.answerB;
                          const isSelected = selectedAnswer === letter;
                          const isThisCorrect = currentQ.solutionOriented === letter;

                          let borderColor = "#E5E7EB";
                          let bg = "white";
                          let labelBg = "#F3F4F6";
                          let labelColor = "#6B7280";

                          if (phase === "feedback") {
                            if (isThisCorrect) {
                              borderColor = "#22C55E";
                              bg = "#F0FFF4";
                              labelBg = "#22C55E";
                              labelColor = "white";
                            } else if (isSelected && !isThisCorrect) {
                              borderColor = "#EF4444";
                              bg = "#FFF5F5";
                              labelBg = "#EF4444";
                              labelColor = "white";
                            }
                          } else if (isSelected) {
                            borderColor = "#F97316";
                            bg = "#FFF8F0";
                            labelBg = "#F97316";
                            labelColor = "white";
                          }

                          return (
                            <button
                              key={letter}
                              onClick={() => handleSelect(letter)}
                              disabled={phase === "feedback"}
                              className="w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 flex items-start gap-4"
                              style={{
                                borderColor,
                                background: bg,
                                cursor: phase === "feedback" ? "default" : "pointer",
                              }}
                            >
                              <span
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 mt-0.5"
                                style={{ background: labelBg, color: labelColor }}
                              >
                                {letter}
                              </span>
                              <span className="text-foreground leading-relaxed flex-1">{text}</span>
                              {phase === "feedback" && isThisCorrect && (
                                <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#22C55E" }} />
                              )}
                              {phase === "feedback" && isSelected && !isThisCorrect && (
                                <XCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback message */}
                      {phase === "feedback" && (
                        <div
                          className="rounded-2xl p-4 text-sm font-semibold"
                          style={{
                            background: isCorrect ? "#DCFCE7" : "#FEF3C7",
                            color: isCorrect ? "#15803D" : "#92400E",
                          }}
                        >
                          {isCorrect
                            ? "✅ Super! Das ist die lösungsorientierte Antwort – du denkst vorwärts!"
                            : `💡 Die lösungsorientierte Antwort war ${currentQ.solutionOriented}. Gut zu wissen für das nächste Mal!`}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex justify-between items-center pt-2">
                        <div /> {/* spacer */}
                        {phase === "playing" ? (
                          <Button
                            onClick={handleConfirm}
                            disabled={!selectedAnswer}
                            className="rounded-full px-8 font-bold text-white"
                            style={{
                              background: selectedAnswer ? "#F97316" : undefined,
                              boxShadow: selectedAnswer ? "0 4px 14px rgba(249,115,22,0.4)" : undefined,
                            }}
                          >
                            Bestätigen
                          </Button>
                        ) : (
                          <Button
                            onClick={handleNext}
                            className="rounded-full px-8 font-bold text-white flex items-center gap-2"
                            style={{ background: "#F97316", boxShadow: "0 4px 14px rgba(249,115,22,0.4)" }}
                          >
                            {currentIndex + 1 === questions.length ? "Auswertung sehen" : "Weiter"}
                            <ArrowRight size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── RESULTS ── */}
                  {phase === "results" && (
                    <div className="text-center space-y-6 py-4">
                      <div className="text-7xl">{resultEmoji()}</div>

                      <div>
                        <h2
                          className="text-2xl font-extrabold text-foreground mb-1"
                          style={{ fontFamily: "'Baloo 2', cursive" }}
                        >
                          Auswertung
                        </h2>
                        <p className="text-foreground/60">
                          Du hast {correctCount} von {questions.length} Fragen richtig beantwortet
                        </p>
                      </div>

                      {/* Score ring */}
                      <div className="flex justify-center">
                        <div
                          className="w-36 h-36 rounded-full flex flex-col items-center justify-center"
                          style={{
                            background: `conic-gradient(#F97316 ${scorePercent * 3.6}deg, #FFF3E8 0deg)`,
                            boxShadow: "0 0 0 8px #FFF3E8",
                          }}
                        >
                          <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                            <span
                              className="text-4xl font-extrabold"
                              style={{ fontFamily: "'Baloo 2', cursive", color: "#F97316" }}
                            >
                              {scorePercent}%
                            </span>
                            <Trophy size={14} style={{ color: "#FACC15" }} />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl p-5 max-w-md mx-auto" style={{ background: "#FFF3E8" }}>
                        <p className="font-bold text-foreground">{resultText()}</p>
                      </div>

                      <div className="flex flex-wrap gap-3 justify-center">
                        <Button
                          onClick={resetGame}
                          variant="outline"
                          className="rounded-full px-8 font-bold flex items-center gap-2 border-2"
                          style={{ borderColor: "#F97316", color: "#F97316" }}
                        >
                          <RotateCcw size={15} /> Nochmal spielen
                        </Button>
                        <Button
                          onClick={() => navigate("/loesungsorientierung")}
                          className="rounded-full px-8 font-bold text-white"
                          style={{ background: "#F97316", boxShadow: "0 4px 14px rgba(249,115,22,0.4)" }}
                        >
                          Andere Spiele entdecken
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

export default Denkweiser;
