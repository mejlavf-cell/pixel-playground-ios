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

export const MUSIC_PACK: QuestionPack = {
  id: "music-pack",
  title: "Hudební balíček",
  description: "100 otázek o hudbě – kapely, nástroje, žánry, skladatelé a hity.",
  questionCount: 100,
  price: 0,
  isFree: true,
};

export const HARD_PACK: QuestionPack = {
  id: "hard-pack",
  title: "Náročný balíček",
  description: "100 těžších otázek z vědy, historie, filozofie a dalších oblastí.",
  questionCount: 100,
  price: 0,
  isFree: true,
};

/** All available packs. New packs are added here. */
export const ALL_PACKS: QuestionPack[] = [DEFAULT_PACK, MUSIC_PACK, HARD_PACK];
