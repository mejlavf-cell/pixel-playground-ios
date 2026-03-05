import { usePacks } from "@/context/PackContext";
import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_PACK } from "@/types/pack";
import { playSound } from "@/lib/sounds";
import { Music, Brain, Sparkles, ShoppingCart } from "lucide-react";

const PACK_ICONS: Record<string, React.ReactNode> = {
  "starter-pack": <Sparkles className="w-7 h-7 text-yellow-400" />,
  "music-pack": <Music className="w-7 h-7 text-pink-400" />,
  "hard-pack": <Brain className="w-7 h-7 text-purple-400" />,
};

interface PacksScreenProps {
  onClose: () => void;
}

export function PacksScreen({ onClose }: PacksScreenProps) {
  const { packs, isSelected, togglePackSelection, noPacksSelected } = usePacks();

  return (
    <div className="min-h-[100dvh] game-bg-image flex flex-col px-4 py-6 overflow-y-auto">
      <button
        onClick={() => {
          playSound("click");
          onClose();
        }}
        className="text-muted-foreground text-sm mb-4 self-start"
      >
        ← Zpět do nastavení
      </button>

      <h2 className="font-display text-2xl font-bold text-foreground mb-2">
        Balíčky otázek
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Vyber balíčky, ze kterých se budou losovat otázky.
      </p>

      {noPacksSelected && (
        <p className="text-destructive text-sm font-bold mb-4">
          Vyber alespoň jeden balíček!
        </p>
      )}

      <div className="space-y-3 flex-1">
        {packs.map((pack) => {
          const isDefault = pack.id === DEFAULT_PACK.id;
          const icon = PACK_ICONS[pack.id] ?? <Sparkles className="w-7 h-7 text-muted-foreground" />;

          return (
            <div
              key={pack.id}
              className="bg-card/60 backdrop-blur rounded-2xl p-4 flex items-start gap-4"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                {icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground text-sm">{pack.title}</span>
                  {pack.isFree && (
                    <span className="text-[10px] font-bold uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                      Zdarma
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs mb-2">{pack.description}</p>
                <span className="text-muted-foreground text-xs">{pack.questionCount} otázek</span>

                {/* Actions row */}
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={isSelected(pack.id)}
                      onCheckedChange={() => {
                        playSound("click");
                        togglePackSelection(pack.id);
                      }}
                    />
                    <span className="text-xs text-foreground">Aktivní</span>
                  </label>

                  {!isDefault && (
                    <button
                      className="flex items-center gap-1.5 text-xs font-bold bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-colors"
                      onClick={() => {
                        playSound("click");
                        // TODO: Purchase logic
                      }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Koupit
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
