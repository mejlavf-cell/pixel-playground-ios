// Game context provider
import React, { createContext, useContext, useState, useCallback } from "react";
import { Player, GameScreen, SCORING } from "@/types/game";
import { Question, getRandomQuestions, shuffleAnswers } from "@/data/questions";

interface GameState {
  screen: GameScreen;
  players: Player[];
  targetScore: number;
  turnTime: number;
  currentPlayerIndex: number;
  currentQuestion: Question | null;
  roundQuestion: Question | null;
  usedQuestionIds: number[];
  roundAnswers: { correct: number };
  winner: Player | null;
  /** Track if someone reached target this round, to let others finish */
  roundFinishPending: boolean;
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
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    screen: "home",
    players: [],
    targetScore: 50,
    turnTime: 60,
    currentPlayerIndex: 0,
    currentQuestion: null,
    roundQuestion: null,
    usedQuestionIds: [],
    roundAnswers: { correct: 0 },
    winner: null,
    roundFinishPending: false,
  });

  const setScreen = useCallback((screen: GameScreen) => {
    setState((s) => ({ ...s, screen }));
  }, []);

  const setPlayers = useCallback((players: Player[]) => {
    setState((s) => ({ ...s, players }));
  }, []);

  const setTargetScore = useCallback((targetScore: number) => {
    setState((s) => ({ ...s, targetScore }));
  }, []);

  const setTurnTime = useCallback((turnTime: number) => {
    setState((s) => ({ ...s, turnTime }));
  }, []);

  const startGame = useCallback(() => {
    setState((s) => ({
      ...s,
      screen: "playerTransition",
      currentPlayerIndex: 0,
      usedQuestionIds: [],
      players: s.players.map((p) => ({ ...p, score: 0 })),
      winner: null,
      roundFinishPending: false,
    }));
  }, []);

  const startTurn = useCallback(() => {
    setState((s) => {
      // New round (first player) → pick a new question
      if (s.currentPlayerIndex === 0 || !s.currentQuestion) {
        const available = getRandomQuestions(100).filter(
          (q) => !s.usedQuestionIds.includes(q.id)
        );
        const base = available.length > 0 ? available[0] : getRandomQuestions(1)[0];
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
  }, []);

  const submitAnswer = useCallback((answerIndex: number): boolean => {
    let isCorrect = false;
    setState((s) => {
      if (!s.currentQuestion) return s;
      isCorrect = s.currentQuestion.answers[answerIndex].correct;
      if (isCorrect) {
        return {
          ...s,
          roundAnswers: { correct: s.roundAnswers.correct + 1 },
        };
      }
      return s;
    });
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
      const pendingNow = s.roundFinishPending || reachedTarget;

      const nextIndex = (s.currentPlayerIndex + 1) % s.players.length;
      const isRoundEnd = nextIndex === 0; // wrapped around = end of round

      // If round ends and someone reached the target → winner screen
      if (isRoundEnd && pendingNow) {
        // Find the player with highest score
        const best = [...updatedPlayers].sort((a, b) => b.score - a.score)[0];
        return {
          ...s,
          players: updatedPlayers,
          winner: best,
          screen: "winner",
          roundFinishPending: false,
        };
      }

      return {
        ...s,
        players: updatedPlayers,
        currentPlayerIndex: nextIndex,
        screen: "playerTransition",
        roundFinishPending: pendingNow,
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
      currentQuestion: null,
      roundQuestion: null,
      usedQuestionIds: [],
      roundAnswers: { correct: 0 },
      winner: null,
      roundFinishPending: false,
    });
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
