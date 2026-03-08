import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ALL_PACKS, DEFAULT_PACK } from "@/types/pack";
import { Input } from "@/components/ui/input";
import { playSound } from "@/lib/sounds";
import { ArrowLeft, LogOut, Package, Check, Crown } from "lucide-react";

interface ProfileScreenProps {
  onClose: () => void;
}

export function ProfileScreen({ onClose }: ProfileScreenProps) {
  const { user, profile, signOut, updateProfile, purchasedPackIds, purchasePack } = useAuth();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(profile?.display_name ?? "");

  const handleSaveName = async () => {
    if (newName.trim()) {
      await updateProfile({ display_name: newName.trim() });
      setEditing(false);
      playSound("correct");
    }
  };

  const handleSignOut = async () => {
    playSound("click");
    await signOut();
    onClose();
  };

  const handlePurchase = async (packId: string) => {
    playSound("click");
    await purchasePack(packId);
    playSound("correct");
  };

  const isPackOwned = (packId: string) => {
    // Starter pack is always free/owned, plus DB purchases
    if (packId === DEFAULT_PACK.id) return true;
    return purchasedPackIds.includes(packId);
  };

  return (
    <div className="min-h-[100dvh] game-bg-image flex flex-col px-4 py-6 overflow-y-auto">
      <button
        onClick={() => { playSound("click"); onClose(); }}
        className="text-muted-foreground text-sm mb-4 self-start flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Zpět
      </button>

      {/* Profile header */}
      <div className="bg-card/80 backdrop-blur rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={30}
                  className="bg-muted border-border text-foreground text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
                <button onClick={handleSaveName} className="text-primary font-bold text-sm">
                  ✓
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-foreground truncate">
                  {profile?.display_name ?? "Hráč"}
                </h2>
                <button
                  onClick={() => { setNewName(profile?.display_name ?? ""); setEditing(true); }}
                  className="text-primary text-xs underline"
                >
                  Upravit jméno
                </button>
              </>
            )}
            <p className="text-muted-foreground text-xs mt-1 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Purchased packs */}
      <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
        <Package className="w-5 h-5" /> Moje balíčky
      </h3>

      <div className="space-y-3 flex-1 mb-6">
        {ALL_PACKS.map((pack) => {
          const owned = isPackOwned(pack.id);
          return (
            <div
              key={pack.id}
              className={`bg-card/60 backdrop-blur rounded-2xl p-4 flex items-center gap-4 ${
                owned ? "border border-primary/30" : "opacity-70"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{pack.title}</span>
                  {owned && <Check className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-muted-foreground text-xs">{pack.questionCount} otázek</p>
              </div>

              {!owned && (
                <button
                  onClick={() => handlePurchase(pack.id)}
                  className="btn-game-plastic px-4 py-2 text-xs"
                >
                  {pack.isFree ? "Získat zdarma" : `${pack.price} Kč`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="flex items-center justify-center gap-2 text-destructive text-sm py-3"
      >
        <LogOut className="w-4 h-4" /> Odhlásit se
      </button>
    </div>
  );
}
