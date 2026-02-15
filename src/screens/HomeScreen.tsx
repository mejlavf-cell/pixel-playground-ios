import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Confetti } from "@/components/game/Confetti";
import logoImage from "@/assets/logo-party-king.png";
import { playSound } from "@/lib/sounds";
import { startMusic, stopMusic } from "@/lib/music";

export function HomeScreen() {
  const { setScreen } = useGame();
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    startMusic();
  }, []);

  return (
    <div className="min-h-[100dvh] game-bg-image flex flex-col items-center justify-center relative overflow-hidden px-4">
      <Confetti count={20} />
      
      <div className="animate-bounce-in mb-10">
        <img alt="Party King" className="w-64 h-auto drop-shadow-2xl" src="/lovable-uploads/bc72b49e-3f54-4976-b1b9-875af26e3f74.png" />
      </div>

      <button
        onClick={() => {playSound("click");setScreen("setup");}}
        className="btn-game-plastic animate-pulse-glow mb-4 min-w-[220px]">

        Nová hra
      </button>


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
    </div>);

}