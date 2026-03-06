// Game context provider
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Player, GameScreen, SCORING } from "@/types/game";
import { Question, getRandomQuestions, shuffleAnswers, isAnswerCorrect } from "@/data/questions";
import { PACK_QUESTION_MAP } from "@/data/pack-questions";
import { usePacks } from "@/context/PackContext";

interface GameState {
  screen: GameScreen;
  players: Player[];
  targetScore: number;
  turnTime: number;
  currentPlayerIndex: number;
  currentRoundIndex: number;
  currentQuestion: Question | null;
  roundQuestion: Question | null;
  usedQuestionIds: number[];
  roundAnswers: { correct: number };
  winner: Player | null;
  /** Track if someone reached target this round, to let others finish */
  roundFinishPending: boolean;
  /** ID of the player who first triggered the final round */
  finalRoundTriggeredByPlayerId: string | null;
  /** Lock target score once final round starts */
  targetScoreLocked: boolean;
  /** Tied players requiring a tiebreaker */
  tiedPlayers: Player[];
}

interface GameContextType extends GameState {
  setScreen: (screen: GameScreen) => void;
  setPlayers: (players: Player[]) => void;
  setTargetScore: (score: number) => void;
  setTurnTime: (seconds: number) => void;
  startGame: () => void;
  startTurn: () => void;
  submitAnswer: (answerIndex: number) => boolean;
  endTurn: (timeExpired?: boolean) => void;
  resetGame: () => void;
  invalidateRound: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { selectedPackIds } = usePacks();
  const [state, setState] = useState<GameState>({
    screen: "home",
    players: [],
    targetScore: 50,
    turnTime: 60,
    currentPlayerIndex: 0,
    currentRoundIndex: 0,
    currentQuestion: null,
    roundQuestion: null,
    usedQuestionIds: [],
    roundAnswers: { correct: 0 },
    winner: null,
    roundFinishPending: false,
    finalRoundTriggeredByPlayerId: null,
    targetScoreLocked: false,
    tiedPlayers: [],
  });

  // Keep a ref to state for synchronous reads in submitAnswer
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const setScreen = useCallback((screen: GameScreen) => {
    setState((s) => ({ ...s, screen }));
  }, []);

  const setPlayers = useCallback((players: Player[]) => {
    setState((s) => ({ ...s, players }));
  }, []);

  const setTargetScore = useCallback((targetScore: number) => {
    setState((s) => s.targetScoreLocked ? s : { ...s, targetScore });
  }, []);

  const setTurnTime = useCallback((turnTime: number) => {
    setState((s) => ({ ...s, turnTime }));
  }, []);

  const startGame = useCallback(() => {
    setState((s) => ({
      ...s,
      screen: "playerTransition",
      currentPlayerIndex: 0,
      currentRoundIndex: 0,
      usedQuestionIds: [],
      players: s.players.map((p) => ({ ...p, score: 0 })),
      winner: null,
      roundFinishPending: false,
      finalRoundTriggeredByPlayerId: null,
      targetScoreLocked: false,
      tiedPlayers: [],
    }));
  }, []);

  const startTurn = useCallback(() => {
    const allowedIds = selectedPackIds.flatMap((pid) => PACK_QUESTION_MAP[pid] ?? []);
    setState((s) => {
      // New round (first player) → pick a new question
      if (s.currentPlayerIndex === 0 || !s.currentQuestion) {
        const available = getRandomQuestions(100, allowedIds).filter(
          (q) => !s.usedQuestionIds.includes(q.id)
        );
        const base = available.length > 0 ? available[0] : getRandomQuestions(1, allowedIds)[0];
        const question = shuffleAnswers(base);
        return {
          ...s,
          screen: "game",
          currentQuestion: question,
          roundQuestion: base,
          usedQuestionIds: [...s.usedQuestionIds, base.id],
          roundAnswers: { correct: 0 },
        };
      }
      // Same round, different player → reshuffle same question
      return {
        ...s,
        screen: "game",
        currentQuestion: shuffleAnswers(s.roundQuestion ?? s.currentQuestion),
        roundAnswers: { correct: 0 },
      };
    });
  }, [selectedPackIds]);

  const submitAnswer = useCallback((answerIndex: number): boolean => {
    // Read correctness directly from current state snapshot — not inside setState
    const currentQ = stateRef.current.currentQuestion;
    if (!currentQ) return false;
    const isCorrect = currentQ.answers[answerIndex]?.correct === true;
    if (isCorrect) {
      setState((s) => ({
        ...s,
        roundAnswers: { correct: s.roundAnswers.correct + 1 },
      }));
    }
    return isCorrect;
  }, []);

  const endTurn = useCallback((timeExpired?: boolean) => {
    setState((s) => {
      const points = timeExpired ? 0 : (SCORING[s.roundAnswers.correct] || 0);
      const updatedPlayers = s.players.map((p, i) =>
        i === s.currentPlayerIndex ? { ...p, score: p.score + points } : p
      );

      const currentPlayer = updatedPlayers[s.currentPlayerIndex];
      const reachedTarget = currentPlayer.score >= s.targetScore;

      // Track who first triggered the final round
      let finalTriggeredBy = s.finalRoundTriggeredByPlayerId;
      let pendingNow = s.roundFinishPending;
      let locked = s.targetScoreLocked;

      if (reachedTarget && !pendingNow) {
        pendingNow = true;
        finalTriggeredBy = currentPlayer.id;
        locked = true;
      } else if (reachedTarget) {
        pendingNow = true;
      }

      const nextIndex = (s.currentPlayerIndex + 1) % s.players.length;
      const isRoundEnd = nextIndex === 0; // wrapped around = end of round

      // If round ends and someone reached the target → determine winner or tiebreaker
      if (isRoundEnd && pendingNow) {
        const sorted = [...updatedPlayers].sort((a, b) => b.score - a.score);
        const highScore = sorted[0].score;
        const tied = sorted.filter((p) => p.score === highScore);

        if (tied.length > 1) {
          return {
            ...s,
            players: updatedPlayers,
            currentRoundIndex: s.currentRoundIndex + 1,
            tiedPlayers: tied,
            screen: "tiebreaker" as GameScreen,
            roundFinishPending: false,
            finalRoundTriggeredByPlayerId: finalTriggeredBy,
            targetScoreLocked: locked,
          };
        }

        return {
          ...s,
          players: updatedPlayers,
          currentRoundIndex: s.currentRoundIndex + 1,
          winner: sorted[0],
          screen: "winner",
          roundFinishPending: false,
          finalRoundTriggeredByPlayerId: finalTriggeredBy,
          targetScoreLocked: locked,
          tiedPlayers: [],
        };
      }

      return {
        ...s,
        players: updatedPlayers,
        currentPlayerIndex: nextIndex,
        currentRoundIndex: isRoundEnd ? s.currentRoundIndex + 1 : s.currentRoundIndex,
        screen: "playerTransition",
        roundFinishPending: pendingNow,
        finalRoundTriggeredByPlayerId: finalTriggeredBy,
        targetScoreLocked: locked,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState({
      screen: "home",
      players: [],
      targetScore: 50,
      turnTime: 60,
      currentPlayerIndex: 0,
      currentRoundIndex: 0,
      currentQuestion: null,
      roundQuestion: null,
      usedQuestionIds: [],
      roundAnswers: { correct: 0 },
      winner: null,
      roundFinishPending: false,
      finalRoundTriggeredByPlayerId: null,
      targetScoreLocked: false,
      tiedPlayers: [],
    });
  }, []);

  const invalidateRound = useCallback(() => {
    // Restart the entire round for all players: reset to first player of current round
    setState((s) => ({
      ...s,
      currentPlayerIndex: 0,
      currentQuestion: null,
      roundQuestion: null,
      roundAnswers: { correct: 0 },
      screen: "playerTransition",
    }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        setScreen,
        setPlayers,
        setTargetScore,
        setTurnTime,
        startGame,
        startTurn,
        submitAnswer,
        endTurn,
        resetGame,
        invalidateRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
