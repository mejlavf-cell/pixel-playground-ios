import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { Confetti } from "@/components/game/Confetti";
import { AuthScreen } from "@/screens/AuthScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import logoImage from "@/assets/logo-party-king.png";
import { playSound } from "@/lib/sounds";
import { startMusic, stopMusic } from "@/lib/music";
import { User, Crown } from "lucide-react";

export function HomeScreen() {
  const { setScreen } = useGame();
  const { user, profile, loading } = useAuth();
  const [showRules, setShowRules] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Start music on first user interaction (required by browser autoplay policy)
  useEffect(() => {
    const handler = () => {
      startMusic();
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
    window.addEventListener("click", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] game-bg-image flex flex-col items-center justify-center relative overflow-hidden px-4">
      <Confetti count={20} />

      {/* User button - top right */}
      <div className="absolute top-4 right-4 z-10">
        {!loading && (
          user ? (
            <button
              onClick={() => { playSound("click"); setShowProfile(true); }}
              className="flex items-center gap-2 bg-card/60 backdrop-blur rounded-full px-4 py-2 text-sm"
            >
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-foreground font-bold truncate max-w-[100px]">
                {profile?.display_name ?? "Profil"}
              </span>
            </button>
          ) : (
            <button
              onClick={() => { playSound("click"); setShowAuth(true); }}
              className="flex items-center gap-2 bg-card/60 backdrop-blur rounded-full px-4 py-2 text-sm"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Přihlásit</span>
            </button>
          )
        )}
      </div>
      
      <div className="animate-bounce-in mb-10">
        <img alt="Party King" className="w-64 h-auto drop-shadow-2xl" src="/lovable-uploads/bc72b49e-3f54-4976-b1b9-875af26e3f74.png" />
      </div>

      <button
        onClick={() => {
          playSound("click");
          if (!user) {
            setShowAuth(true);
          } else {
            setScreen("setup");
          }
        }}
        className="btn-game-plastic animate-pulse-glow mb-4 min-w-[220px]">
        Nová hra
      </button>

      {!loading && !user && (
        <button
          onClick={() => { playSound("click"); setShowAuth(true); }}
          className="btn-game-plastic mb-4 min-w-[220px] bg-card/80 text-foreground border-2 border-primary/40"
        >
          Přihlásit se / Registrace
        </button>
      )}

      <button
        onClick={() => {playSound("click");setShowRules(true);}}
        className="text-muted-foreground underline text-sm">
         Pravidla
      </button>

      {showRules &&
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowRules(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-bold text-primary mb-4">Pravidla</h2>
            <div className="space-y-3 text-sm text-foreground/90">
              <p><strong>Hráči:</strong> 1–8 hráčů na jednom zařízení</p>
              <p><strong>Cíl:</strong> Jako první dosáhnout cílového počtu bodů</p>
              <p><strong>Průběh tahu:</strong> Otočí se kruh s 10 odpověďmi (5 správných, 5 špatných). Máš 60 sekund na označení správných.</p>
              <p><strong>Špatná odpověď:</strong> Odečte 10 sekund z časomíry!</p>
              <p><strong>Bodování:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 správná = 1 bod</li>
                <li>2 správné = 3 body</li>
                <li>3 správné = 5 bodů</li>
                <li>4 správné = 7 bodů</li>
                <li>5 správných = 10 bodů</li>
              </ul>
              <p>Tah končí po nalezení všech 5 správných nebo po uplynutí času.</p>
            </div>
            <button onClick={() => setShowRules(false)} className="btn-game-plastic mt-6 w-full text-base">
              Rozumím!
            </button>
          </div>
        </div>
      }

      {/* Auth overlay */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            key="auth"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50"
          >
            <AuthScreen onClose={() => setShowAuth(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile overlay */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            key="profile"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50"
          >
            <ProfileScreen onClose={() => setShowProfile(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

}