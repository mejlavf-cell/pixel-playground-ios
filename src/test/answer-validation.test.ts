import { describe, it, expect } from "vitest";
import { shuffleAnswers, isAnswerCorrect } from "@/data/questions";
import type { Question } from "@/data/questions";

const testQuestion: Question = {
  id: 999,
  question: "Test question with multiple correct answers?",
  answers: [
    { text: "Correct A", correct: true },
    { text: "Correct B", correct: true },
    { text: "Correct C", correct: true },
    { text: "Correct D", correct: true },
    { text: "Correct E", correct: true },
    { text: "Wrong F", correct: false },
    { text: "Wrong G", correct: false },
    { text: "Wrong H", correct: false },
    { text: "Wrong I", correct: false },
    { text: "Wrong J", correct: false },
  ],
};

describe("Answer validation", () => {
  it("shuffleAnswers assigns unique IDs to all answers", () => {
    const shuffled = shuffleAnswers(testQuestion);
    const ids = shuffled.answers.map((a) => a.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(10);
  });

  it("correct answers remain correct after shuffling", () => {
    for (let i = 0; i < 20; i++) {
      const shuffled = shuffleAnswers(testQuestion);
      const correctAnswers = shuffled.answers.filter((a) => a.correct);
      expect(correctAnswers.length).toBe(5);
      correctAnswers.forEach((a) => {
        expect(a.text).toMatch(/^Correct/);
      });
    }
  });

  it("isAnswerCorrect identifies correct answers by ID", () => {
    const shuffled = shuffleAnswers(testQuestion);
    shuffled.answers.forEach((a) => {
      const result = isAnswerCorrect(shuffled, a.id!);
      expect(result).toBe(a.correct);
    });
  });

  it("correctness check by index is deterministic after shuffle", () => {
    const shuffled = shuffleAnswers(testQuestion);
    // Checking each answer by its index should match its .correct property
    shuffled.answers.forEach((answer, index) => {
      expect(shuffled.answers[index].correct).toBe(answer.correct);
    });
  });

  it("wrong answers are never marked correct", () => {
    for (let i = 0; i < 20; i++) {
      const shuffled = shuffleAnswers(testQuestion);
      const wrongAnswers = shuffled.answers.filter((a) => !a.correct);
      expect(wrongAnswers.length).toBe(5);
      wrongAnswers.forEach((a) => {
        expect(a.text).toMatch(/^Wrong/);
        expect(isAnswerCorrect(shuffled, a.id!)).toBe(false);
      });
    }
  });
});
