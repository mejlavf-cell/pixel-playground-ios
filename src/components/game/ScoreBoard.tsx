import { Player, PLAYER_COLORS } from "@/types/game";

interface ScoreBoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function ScoreBoard({ players, currentPlayerIndex }: ScoreBoardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex gap-1.5 overflow-x-auto px-2 py-1.5 no-scrollbar">
      {sorted.map((player) => {
        const color = PLAYER_COLORS[player.colorIndex];
        const isCurrent = players[currentPlayerIndex]?.id === player.id;
        return (
          <div
            key={player.id}
            className="flex flex-col items-center min-w-[48px] rounded-lg px-1.5 py-1 transition-all"
            style={{
              backgroundColor: isCurrent ? color.bg : "hsl(270 30% 20%)",
              border: isCurrent ? `2px solid ${color.light}` : "2px solid transparent",
            }}
          >
            <span className="text-[10px] font-bold truncate max-w-[48px]" style={{ color: isCurrent ? "white" : color.light }}>
              {player.name}
            </span>
            <span className="text-sm font-display font-bold text-foreground">{player.score}</span>
          </div>
        );
      })}
    </div>
  );
}
