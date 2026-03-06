import { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { AnswerWheel } from "@/components/game/AnswerWheel";
import { Timer } from "@/components/game/Timer";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { SCORING, PLAYER_COLORS } from "@/types/game";
import { playSound } from "@/lib/sounds";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const PENALTY = 10;

export function GameScreen() {
  const { currentQuestion, players, currentPlayerIndex, submitAnswer, endTurn, roundAnswers, turnTime, invalidateRound } = useGame();
  const [timeLeft, setTimeLeft] = useState(turnTime);
  const [turnEnded, setTurnEnded] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [roundInvalidated, setRoundInvalidated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCountdownRef = useRef<number>(0);
  const player = players[currentPlayerIndex];
  const color = PLAYER_COLORS[player.colorIndex];

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          setTurnEnded(true);
          setTimeExpired(true);
          playSound("dramaticEnd");
          return 0;
        }
        // Countdown sounds for last 5 seconds
        if (prev <= 6 && prev > 1) {
          playSound("countdown");
        }
        return prev - 1;
      });
    }, 1000);

    return stopTimer;
  }, [stopTimer]);

  useEffect(() => {
    if (roundAnswers.correct >= 5 && !turnEnded) {
      stopTimer();
      setTurnEnded(true);
      playSound("win");
    }
  }, [roundAnswers.correct, turnEnded, stopTimer]);

  const handleAnswer = (index: number): boolean => {
    const isCorrect = submitAnswer(index);
    if (isCorrect) {
      playSound("correct", roundAnswers.correct);
    } else {
      playSound("wrong");
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - PENALTY);
        if (next <= 0) {
          stopTimer();
          setTurnEnded(true);
          setTimeExpired(true);
          playSound("dramaticEnd");
        }
        return next;
      });
    }
    return isCorrect;
  };

  const handleEndTurn = () => {
    playSound("click");
    stopTimer();
    setTurnEnded(true);
    endTurn(timeExpired || roundInvalidated);
  };

  const handleAIExplain = () => {
    playSound("click");
    stopTimer();
    setTurnEnded(true);
    setShowAIExplanation(true);
    setRoundInvalidated(true);
    invalidateRound();
  };

  if (!currentQuestion) return null;

  const points = (timeExpired || roundInvalidated) ? 0 : (SCORING[roundAnswers.correct] || 0);

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{ background: `url(${color.bgImage}) center/cover no-repeat` }}
    >
      <ScoreBoard players={players} currentPlayerIndex={currentPlayerIndex} />

      <div className="px-4 py-2">
        <div className="bg-card/60 rounded-xl px-4 py-3">
          <p className="text-foreground text-center font-bold text-sm leading-tight">
            {currentQuestion.question}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-2 relative">
        <div className="absolute top-1 left-2">
          <Timer
            totalSeconds={turnTime}
            remainingSeconds={timeLeft}
            onTick={() => {}}
            running={!turnEnded}
          />
        </div>
        {/* AI button */}
        {!showAIExplanation && !turnEnded && (
          <button
            onClick={handleAIExplain}
            className="absolute top-2 right-2 flex items-center gap-1 bg-card/70 hover:bg-card/90 text-foreground rounded-lg px-2.5 py-1.5 text-xs font-bold backdrop-blur-sm transition-colors z-10"
            title="AI vysvětlí odpovědi (kolo se nebude počítat)"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI
          </button>
        )}
        <div className="w-full px-0">
          <AnswerWheel
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={turnEnded}
            correctCount={roundAnswers.correct}
          />
        </div>
      </div>

      {/* AI Explanation overlay */}
      <AnimatePresence>
        {showAIExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col overflow-hidden"
          >
            <div className="px-4 pt-4 pb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-foreground font-display font-bold text-lg">AI Vysvětlení</h2>
            </div>
            <p className="px-4 text-muted-foreground text-xs mb-2">
              Toto kolo se nepočítá do skóre.
            </p>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {currentQuestion.answers.map((answer, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-2.5 border ${
                    answer.correct
                      ? "bg-green-900/40 border-green-500/30"
                      : "bg-red-900/40 border-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${answer.correct ? "text-green-400" : "text-red-400"}`}>
                      {answer.correct ? "✓ Správně" : "✗ Špatně"}
                    </span>
                    <span className="text-foreground font-semibold text-sm">{answer.text}</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {answer.correct
                      ? `„${answer.text}" je správná odpověď na otázku „${currentQuestion.question}".`
                      : `„${answer.text}" není správná odpověď. Neodpovídá kritériím otázky.`
                    }
                  </p>
                </div>
              ))}
            </div>
            <div className="px-4 pb-6 pt-2">
              <button
                onClick={handleEndTurn}
                className="btn-game-plastic w-full"
              >
                Pokračovat (0 bodů)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pb-6 pt-2">
        {turnEnded && !showAIExplanation ? (
          <div className="text-center mb-3">
            <p className="text-foreground font-display text-lg font-bold">
              {roundInvalidated ? "Kolo zrušeno (AI)" : roundAnswers.correct === 5 ? "Všech 5 správných!" : "Čas vypršel!"}
            </p>
            <p className="text-primary font-bold">+{points} bodů</p>
          </div>
        ) : null}

        {!showAIExplanation && (
          <button
            onClick={handleEndTurn}
            className="btn-game-plastic w-full"
          >
            {turnEnded ? "Pokračovat" : `Odeslat (${roundAnswers.correct}/5)`}
          </button>
        )}
      </div>
    </div>
  );
}
