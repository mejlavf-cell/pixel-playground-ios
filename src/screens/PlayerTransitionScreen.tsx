import { useGame } from "@/context/GameContext";
import { PLAYER_COLORS } from "@/types/game";

export function PlayerTransitionScreen() {
  const { players, currentPlayerIndex, startTurn } = useGame();
  const player = players[currentPlayerIndex];
  const color = PLAYER_COLORS[player.colorIndex];

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${color.bg}, ${color.light})` }}
    >
      <p className="text-foreground/70 text-sm mb-4 font-bold">Na tahu je:</p>
      <h1 className="font-display text-4xl font-bold text-foreground mb-8 animate-bounce-in">
        {player.name}
      </h1>
      <p className="text-foreground/60 text-sm mb-2">Skóre: {player.score}</p>
      
      <button
        onClick={startTurn}
        className="btn-game animate-pulse-glow mt-8 min-w-[180px]"
      >
        ▶ Začít!
      </button>

      <p className="text-foreground/40 text-xs mt-6">
        Předej telefon hráči {player.name}
      </p>
    </div>
  );
}
