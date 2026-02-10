import React, { createContext, useContext, useState, useCallback } from "react";
import { Player, GameScreen, SCORING } from "@/types/game";
import { Question, getRandomQuestions, shuffleAnswers } from "@/data/questions";

interface GameState {
  screen: GameScreen;
  players: Player[];
  targetScore: number;
  currentPlayerIndex: number;
  currentQuestion: Question | null;
  usedQuestionIds: number[];
  roundAnswers: { correct: number };
  winner: Player | null;
}

interface GameContextType extends GameState {
  setScreen: (screen: GameScreen) => void;
  setPlayers: (players: Player[]) => void;
  setTargetScore: (score: number) => void;
  startGame: () => void;
  startTurn: () => void;
  submitAnswer: (answerIndex: number) => boolean;
  endTurn: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    screen: "home",
    players: [],
    targetScore: 50,
    currentPlayerIndex: 0,
    currentQuestion: null,
    usedQuestionIds: [],
    roundAnswers: { correct: 0 },
    winner: null,
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

  const startGame = useCallback(() => {
    setState((s) => ({
      ...s,
      screen: "playerTransition",
      currentPlayerIndex: 0,
      usedQuestionIds: [],
      players: s.players.map((p) => ({ ...p, score: 0 })),
      winner: null,
    }));
  }, []);

  const startTurn = useCallback(() => {
    setState((s) => {
      const available = getRandomQuestions(20).filter(
        (q) => !s.usedQuestionIds.includes(q.id)
      );
      const question = available.length > 0 ? shuffleAnswers(available[0]) : shuffleAnswers(getRandomQuestions(1)[0]);
      return {
        ...s,
        screen: "game",
        currentQuestion: question,
        usedQuestionIds: [...s.usedQuestionIds, question.id],
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

  const endTurn = useCallback(() => {
    setState((s) => {
      const points = SCORING[s.roundAnswers.correct] || 0;
      const updatedPlayers = s.players.map((p, i) =>
        i === s.currentPlayerIndex ? { ...p, score: p.score + points } : p
      );

      const currentPlayer = updatedPlayers[s.currentPlayerIndex];
      if (currentPlayer.score >= s.targetScore) {
        return {
          ...s,
          players: updatedPlayers,
          winner: currentPlayer,
          screen: "winner",
        };
      }

      const nextIndex = (s.currentPlayerIndex + 1) % s.players.length;
      return {
        ...s,
        players: updatedPlayers,
        currentPlayerIndex: nextIndex,
        screen: "playerTransition",
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState({
      screen: "home",
      players: [],
      targetScore: 50,
      currentPlayerIndex: 0,
      currentQuestion: null,
      usedQuestionIds: [],
      roundAnswers: { correct: 0 },
      winner: null,
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        setScreen,
        setPlayers,
        setTargetScore,
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
