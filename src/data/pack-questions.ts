/**
 * Maps pack IDs to question ID ranges.
 * Each pack "owns" a set of question IDs from the main questions array.
 * New packs can reference new question IDs added to questions.ts.
 */
export const PACK_QUESTION_MAP: Record<string, number[]> = {
  "starter-pack": Array.from({ length: 100 }, (_, i) => i + 1),
};
