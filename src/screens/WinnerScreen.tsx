import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { PLAYER_COLORS } from "@/types/game";
import { Confetti } from "@/components/game/Confetti";
import { Crown, RotateCcw } from "lucide-react";
import { playSound } from "@/lib/sounds";

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
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${winnerColor.bg}, ${winnerColor.light})` }}
    >
      <Confetti count={40} />
      
      <Crown className="w-16 h-16 text-primary mb-2 animate-bounce-in" />
      <h1 className="font-display text-3xl font-bold text-foreground mb-1 animate-bounce-in">
        🎉 Vítěz! 🎉
      </h1>
      <h2 className="font-display text-4xl font-bold text-foreground mb-2 animate-bounce-in">
        {winner.name}
      </h2>
      <p className="text-foreground/80 text-lg font-bold mb-8">{winner.score} bodů</p>

      {/* Full leaderboard */}
      <div className="bg-card/30 rounded-2xl p-4 w-full max-w-xs mb-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-3">🏆 Konečné pořadí</h3>
        {sorted.map((player, i) => {
          const color = PLAYER_COLORS[player.colorIndex];
          return (
            <div
              key={player.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg mb-1"
              style={{ backgroundColor: `${color.bg}40` }}
            >
              <span className="text-foreground font-bold flex items-center gap-2">
                <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}</span>
                <span className="text-sm">{color.pattern.slice(0, 2)}</span>
                {player.name}
              </span>
              <span className="text-foreground font-display font-bold">{player.score}</span>
            </div>
          );
        })}
      </div>

      <button onClick={resetGame} className="btn-game flex items-center gap-2">
        <RotateCcw className="w-5 h-5" /> Nová hra
      </button>
    </div>
  );
}
