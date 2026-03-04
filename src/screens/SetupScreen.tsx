import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { usePacks } from "@/context/PackContext";
import { Player, PLAYER_COLORS } from "@/types/game";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { playSound } from "@/lib/sounds";
import { startMusic, stopMusic } from "@/lib/music";

export function SetupScreen() {
  const { packs, isSelected, togglePackSelection, noPacksSelected } = usePacks();
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
    playSound("click");
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
    playSound("click");
    setLocalPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStart = () => {
    playSound("click");
    stopMusic();
    setPlayers(localPlayers);
    setTargetScore(localTarget);
    setTurnTime(localTurnTime);
    startGame();
  };

  useEffect(() => {
    startMusic();
  }, []);

  return (
    <div className="min-h-[100dvh] game-bg-image flex flex-col px-4 py-6 overflow-y-auto">
      <button onClick={() => { playSound("click"); setScreen("home"); }} className="text-muted-foreground text-sm mb-4 self-start">
        Zpět
      </button>

      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Nastavení hry</h2>

      {/* Target score */}
      <div className="mb-4">
        <label className="text-sm font-bold text-foreground mb-2 block">
          Cílové skóre: <span className="text-primary">{localTarget}</span>
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
          Čas na kolo: <span className="text-primary">{localTurnTime}s</span>
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
          Přidat hráče ({localPlayers.length}/8)
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
            className="btn-game-plastic px-4 py-2 text-sm disabled:opacity-40"
          >
            +
          </button>
        </div>
        
        {/* Color picker */}
        <div className="flex gap-2 flex-wrap">
          {PLAYER_COLORS.map((color, i) => {
            const isUsed = usedColors.includes(i);
            return (
              <button
                key={i}
                disabled={isUsed}
                onClick={() => setSelectedColor(i)}
                className="w-10 h-10 rounded-full border-2 transition-all disabled:opacity-20"
                style={{
                  backgroundColor: color.bg,
                  borderColor: selectedColor === i ? "white" : "transparent",
                  transform: selectedColor === i ? "scale(1.15)" : "scale(1)",
                }}
                title={color.name}
              />
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
              <span className="font-bold text-foreground">{player.name}</span>
              <button onClick={() => removePlayer(player.id)} className="text-foreground/70 font-bold text-lg">
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Question packs */}
      <div className="bg-card/50 rounded-2xl p-4 mb-6">
        <label className="text-sm font-bold text-foreground mb-3 block">
          Balíčky otázek
        </label>
        {noPacksSelected && (
          <p className="text-destructive text-xs mb-2">Vyber alespoň jeden balíček!</p>
        )}
        <div className="space-y-2">
          {packs.map((pack) => (
            <label
              key={pack.id}
              className="flex items-start gap-3 rounded-xl bg-muted/50 px-4 py-3 cursor-pointer"
            >
              <Checkbox
                checked={isSelected(pack.id)}
                onCheckedChange={() => {
                  playSound("click");
                  togglePackSelection(pack.id);
                }}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-foreground text-sm block">{pack.title}</span>
                <span className="text-muted-foreground text-xs block">{pack.description}</span>
                <span className="text-muted-foreground text-xs">{pack.questionCount} otázek</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Start */}
      <button
        onClick={handleStart}
        disabled={localPlayers.length < 1 || noPacksSelected}
        className="btn-game-plastic w-full disabled:opacity-40"
      >
        Start hry
      </button>
    </div>
  );
}
