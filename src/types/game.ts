export interface Player {
  id: string;
  name: string;
  colorIndex: number;
  score: number;
}

export const PLAYER_COLORS = [
  { name: "Fialová", bg: "hsl(270 60% 50%)", light: "hsl(270 60% 70%)" },
  { name: "Růžová", bg: "hsl(330 70% 55%)", light: "hsl(330 70% 75%)" },
  { name: "Oranžová", bg: "hsl(30 95% 55%)", light: "hsl(30 95% 75%)" },
  { name: "Modrá", bg: "hsl(210 80% 50%)", light: "hsl(210 80% 70%)" },
  { name: "Zelená", bg: "hsl(145 70% 40%)", light: "hsl(145 70% 60%)" },
  { name: "Červená", bg: "hsl(0 80% 55%)", light: "hsl(0 80% 75%)" },
  { name: "Tyrkysová", bg: "hsl(180 70% 45%)", light: "hsl(180 70% 65%)" },
  { name: "Žlutá", bg: "hsl(50 90% 50%)", light: "hsl(50 90% 70%)" },
];

export const SCORING = [0, 1, 3, 5, 7, 10]; // index = correct count

export type GameScreen = "home" | "setup" | "playerTransition" | "game" | "winner";
