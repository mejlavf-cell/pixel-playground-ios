import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Player, PLAYER_COLORS } from "@/types/game";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Plus, X, Play } from "lucide-react";

export function SetupScreen() {
  const { setPlayers, setTargetScore, setTurnTime, targetScore, turnTime, startGame, setScreen } = useGame();
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [localTarget, setLocalTarget] = useState(targetScore);
  const [localTurnTime, setLocalTurnTime] = useState(turnTime);

  const usedColors = localPlayers.map((p) => p.colorIndex);
  const availableColors = PLAYER_COLORS.map((_, i) => i).filter((i) => !usedColors.includes(i));

  const addPlayer = () => {
    if (!name.trim() || localPlayers.length >= 8) return;
    const player: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      colorIndex: selectedColor,
      score: 0,
    };
    const updated = [...localPlayers, player];
    setLocalPlayers(updated);
    setName("");
    if (availableColors.length > 1) {
      const next = availableColors.find((c) => c !== selectedColor);
      if (next !== undefined) setSelectedColor(next);
    }
  };

  const removePlayer = (id: string) => {
    setLocalPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStart = () => {
    setPlayers(localPlayers);
    setTargetScore(localTarget);
    setTurnTime(localTurnTime);
    startGame();
  };

  return (
    <div className="min-h-[100dvh] game-gradient flex flex-col px-4 py-6 overflow-y-auto">
      <button onClick={() => setScreen("home")} className="text-muted-foreground text-sm mb-4 self-start">
        ← Zpět
      </button>

      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Nastavení hry</h2>

      {/* Target score */}
      <div className="mb-4">
        <label className="text-sm font-bold text-foreground mb-2 block">
          🎯 Cílové skóre: <span className="text-primary">{localTarget}</span>
        </label>
        <Slider
          value={[localTarget]}
          onValueChange={([v]) => setLocalTarget(v)}
          min={10}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Turn time */}
      <div className="mb-6">
        <label className="text-sm font-bold text-foreground mb-2 block">
          ⏱ Čas na kolo: <span className="text-primary">{localTurnTime}s</span>
        </label>
        <Slider
          value={[localTurnTime]}
          onValueChange={([v]) => setLocalTurnTime(v)}
          min={15}
          max={120}
          step={5}
          className="w-full"
        />
      </div>

      {/* Add player */}
      <div className="bg-card/50 rounded-2xl p-4 mb-4">
        <label className="text-sm font-bold text-foreground mb-2 block">
          👤 Přidat hráče ({localPlayers.length}/8)
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jméno hráče"
            maxLength={12}
            className="bg-muted border-border text-foreground"
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          />
          <button
            onClick={addPlayer}
            disabled={!name.trim() || localPlayers.length >= 8}
            className="btn-game px-4 py-2 text-sm disabled:opacity-40"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Color picker with pattern preview */}
        <div className="flex gap-2 flex-wrap">
          {PLAYER_COLORS.map((color, i) => {
            const isUsed = usedColors.includes(i);
            return (
              <button
                key={i}
                disabled={isUsed}
                onClick={() => setSelectedColor(i)}
                className="w-10 h-10 rounded-full border-2 transition-all disabled:opacity-20 flex items-center justify-center text-[10px]"
                style={{
                  backgroundColor: color.bg,
                  borderColor: selectedColor === i ? "white" : "transparent",
                  transform: selectedColor === i ? "scale(1.15)" : "scale(1)",
                }}
                title={color.pattern}
              >
                {color.pattern.slice(0, 2)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Player list */}
      <div className="space-y-2 mb-6 flex-1">
        {localPlayers.map((player) => {
          const color = PLAYER_COLORS[player.colorIndex];
          return (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ backgroundColor: color.bg }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{color.pattern.slice(0, 2)}</span>
                <span className="font-bold text-foreground">{player.name}</span>
              </div>
              <button onClick={() => removePlayer(player.id)}>
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Start */}
      <button
        onClick={handleStart}
        disabled={localPlayers.length < 1}
        className="btn-game w-full disabled:opacity-40 flex items-center justify-center gap-2"
      >
        <Play className="w-5 h-5" /> Start hry
      </button>
    </div>
  );
}
