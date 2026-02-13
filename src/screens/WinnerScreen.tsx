import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { PLAYER_COLORS } from "@/types/game";
import { Confetti } from "@/components/game/Confetti";
import { playSound } from "@/lib/sounds";
import { CrownLogo } from "@/components/game/CrownLogo";

export function WinnerScreen() {
  const { winner, players, resetGame } = useGame();

  useEffect(() => {
    playSound("win");
  }, []);

  if (!winner) return null;

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winnerColor = PLAYER_COLORS[winner.colorIndex];

  return (
    <div
      className="min-h-[100dvh] game-bg-player flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ '--player-gradient': `linear-gradient(135deg, ${winnerColor.bg}, ${winnerColor.light})` } as React.CSSProperties}
    >
      <Confetti count={40} />
      
      <CrownLogo size="small" />
      <h1 className="font-display text-3xl font-bold text-foreground mb-1 animate-bounce-in mt-4">
        Vítěz!
      </h1>
      <h2 className="font-display text-4xl font-bold text-foreground mb-2 animate-bounce-in">
        {winner.name}
      </h2>
      <p className="text-foreground/80 text-lg font-bold mb-8">{winner.score} bodů</p>

      {/* Full leaderboard */}
      <div className="bg-card/30 rounded-2xl p-4 w-full max-w-xs mb-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-3">Konečné pořadí</h3>
        {sorted.map((player, i) => {
          const color = PLAYER_COLORS[player.colorIndex];
          return (
            <div
              key={player.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg mb-1"
              style={{ backgroundColor: `${color.bg}40` }}
            >
              <span className="text-foreground font-bold flex items-center gap-2">
                <span>{i + 1}.</span>
                {player.name}
              </span>
              <span className="text-foreground font-display font-bold">{player.score}</span>
            </div>
          );
        })}
      </div>

      <button onClick={() => { playSound("click"); resetGame(); }} className="btn-game-plastic">
        Nová hra
      </button>
    </div>
  );
}
