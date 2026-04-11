import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { Confetti } from "@/components/game/Confetti";
import { AuthScreen } from "@/screens/AuthScreen";
import { TutorialScreen } from "@/screens/TutorialScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import logoImage from "@/assets/logo-party-king.png";
import { playSound } from "@/lib/sounds";
import { startMusic, stopMusic } from "@/lib/music";
import { User, Crown, BookOpen } from "lucide-react";

export function HomeScreen() {
  const { setScreen } = useGame();
  const { user, profile, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

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
        onClick={() => {playSound("click");setShowTutorial(true);}}
        className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
        <BookOpen className="w-4 h-4" />
        Jak hrát Party King
      </button>




      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            key="tutorial"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50"
          >
            <TutorialScreen onClose={() => setShowTutorial(false)} />
          </motion.div>
        )}
      </AnimatePresence>

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