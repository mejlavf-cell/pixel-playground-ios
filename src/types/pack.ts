export interface QuestionPack {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  price: number;
  isFree: boolean;
}

export interface PackState {
  ownedPackIds: string[];
  selectedPackIds: string[];
}

export const DEFAULT_PACK: QuestionPack = {
  id: "starter-pack",
  title: "Starter Pack",
  description: "Základní balíček se 100 otázkami z různých kategorií.",
  questionCount: 100,
  price: 0,
  isFree: true,
};

/** All available packs. New packs are added here. */
export const ALL_PACKS: QuestionPack[] = [DEFAULT_PACK];
