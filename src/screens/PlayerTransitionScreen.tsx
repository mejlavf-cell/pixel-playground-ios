import { useGame } from "@/context/GameContext";
import { PLAYER_COLORS } from "@/types/game";

export function PlayerTransitionScreen() {
  const { players, currentPlayerIndex, startTurn, roundFinishPending } = useGame();
  const player = players[currentPlayerIndex];
  const color = PLAYER_COLORS[player.colorIndex];

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${color.bg}, ${color.light})` }}
    >
      {/* Pattern background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[8rem] leading-none select-none pointer-events-none overflow-hidden">
        {color.pattern.repeat(20)}
      </div>

      <p className="text-foreground/70 text-sm mb-4 font-bold relative z-10">Na tahu je:</p>
      <h1 className="font-display text-4xl font-bold text-foreground mb-2 animate-bounce-in relative z-10">
        {player.name}
      </h1>
      <div className="text-4xl mb-4 relative z-10">{color.pattern.slice(0, 2)}</div>
      <p className="text-foreground/60 text-sm mb-2 relative z-10">Skóre: {player.score}</p>

      {roundFinishPending && (
        <p className="text-foreground/80 text-xs mb-2 bg-card/30 rounded-lg px-3 py-1 relative z-10">
          ⚡ Někdo dosáhl cíle! Poslední šance!
        </p>
      )}
      
      <button
        onClick={startTurn}
        className="btn-game animate-pulse-glow mt-8 min-w-[180px] relative z-10"
      >
        ▶ Začít!
      </button>

      <p className="text-foreground/40 text-xs mt-6 relative z-10">
        Předej telefon hráči {player.name}
      </p>
    </div>
  );
}
