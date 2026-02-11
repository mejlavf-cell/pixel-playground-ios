import { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { AnswerWheel } from "@/components/game/AnswerWheel";
import { Timer } from "@/components/game/Timer";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { SCORING } from "@/types/game";

const TOTAL_TIME = 60;
const PENALTY = 10;

export function GameScreen() {
  const { currentQuestion, players, currentPlayerIndex, submitAnswer, endTurn, roundAnswers } = useGame();
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [turnEnded, setTurnEnded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          return 0;
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
    }
  }, [roundAnswers.correct, turnEnded, stopTimer]);

  const handleAnswer = (index: number): boolean => {
    const isCorrect = submitAnswer(index);
    if (!isCorrect) {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - PENALTY);
        if (next <= 0) {
          stopTimer();
          setTurnEnded(true);
        }
        return next;
      });
    }
    return isCorrect;
  };

  const handleEndTurn = () => {
    stopTimer();
    setTurnEnded(true);
    endTurn();
  };

  if (!currentQuestion) return null;

  const points = SCORING[roundAnswers.correct] || 0;

  return (
    <div className="min-h-[100dvh] game-gradient flex flex-col">
      {/* Scoreboard */}
      <ScoreBoard players={players} currentPlayerIndex={currentPlayerIndex} />

      {/* Question */}
      <div className="px-4 py-2">
        <div className="bg-card/60 rounded-xl px-4 py-3">
          <p className="text-foreground text-center font-bold text-sm leading-tight">
            {currentQuestion.question}
          </p>
        </div>
      </div>

      {/* Main area: timer + wheel */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 relative">
        {/* Timer pinned top-left */}
        <div className="absolute top-1 left-2">
          <Timer
            totalSeconds={TOTAL_TIME}
            remainingSeconds={timeLeft}
            onTick={() => {}}
            running={!turnEnded}
          />
        </div>
        {/* Wheel centered, full width */}
        <div className="w-full px-2">
          <AnswerWheel
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={turnEnded}
            correctCount={roundAnswers.correct}
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="px-4 pb-6 pt-2">
        {turnEnded ? (
          <div className="text-center mb-3">
            <p className="text-foreground font-display text-lg font-bold">
              {roundAnswers.correct === 5 ? "🎉 Všech 5 správných!" : `⏱ Čas vypršel!`}
            </p>
            <p className="text-primary font-bold">+{points} bodů</p>
          </div>
        ) : null}

        <button
          onClick={handleEndTurn}
          className="btn-game w-full"
        >
          {turnEnded ? "Pokračovat →" : `Odeslat (${roundAnswers.correct}/5) →`}
        </button>
      </div>
    </div>
  );
}
