import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { playSound } from "@/lib/sounds";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

interface AuthScreenProps {
  onClose: () => void;
}

export function AuthScreen({ onClose }: AuthScreenProps) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isLogin) {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        playSound("correct");
        onClose();
      }
    } else {
      if (!displayName.trim()) {
        setError("Zadej své jméno");
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, displayName.trim());
      if (result.error) {
        setError(result.error);
      } else {
        playSound("correct");
        onClose();
      }
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[100dvh] game-bg-image flex flex-col items-center justify-center px-4">
        <div className="bg-card/80 backdrop-blur rounded-2xl p-6 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Ověř svůj email</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Poslali jsme ti potvrzovací odkaz na <strong className="text-foreground">{email}</strong>. 
            Klikni na něj a pak se přihlas.
          </p>
          <button onClick={onClose} className="btn-game-plastic w-full text-base">
            Zpět
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] game-bg-image flex flex-col px-4 py-6">
      <button
        onClick={() => { playSound("click"); onClose(); }}
        className="text-muted-foreground text-sm mb-6 self-start flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Zpět
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-card/80 backdrop-blur rounded-2xl p-6 max-w-sm w-full">
          <h2 className="font-display text-2xl font-bold text-foreground mb-1 text-center">
            {isLogin ? "Přihlášení" : "Registrace"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            {isLogin ? "Přihlas se ke svému účtu" : "Vytvoř si nový účet"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tvoje jméno"
                  maxLength={30}
                  className="pl-10 bg-muted border-border text-foreground"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="pl-10 bg-muted border-border text-foreground"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo"
                minLength={6}
                className="pl-10 bg-muted border-border text-foreground"
                required
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-game-plastic w-full text-base disabled:opacity-50"
            >
              {loading ? "..." : isLogin ? "Přihlásit se" : "Zaregistrovat se"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-primary text-sm underline"
            >
              {isLogin ? "Nemáš účet? Zaregistruj se" : "Už máš účet? Přihlas se"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
