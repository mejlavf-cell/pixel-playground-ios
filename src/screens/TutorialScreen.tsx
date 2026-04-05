import { X, Target, Clock, Brain, Sparkles, Layers, Trophy } from "lucide-react";
import { playSound } from "@/lib/sounds";

interface TutorialScreenProps {
  onClose: () => void;
}

export function TutorialScreen({ onClose }: TutorialScreenProps) {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="font-display text-2xl font-bold text-primary">Návod</h1>
        <button
          onClick={() => { playSound("click"); onClose(); }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-card/60"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-5">
        {/* Princip hry */}
        <Section icon={<Target className="w-5 h-5 text-primary" />} title="Princip hry">
          <p>
            Party King je vědomostní hra pro 1–8 hráčů na jednom zařízení.
            Hráči se střídají a odpovídají na otázky pomocí otočného kruhu
            s 10 odpověďmi – 5 správných a 5 špatných.
          </p>
          <p>
            Cílem je jako první dosáhnout nastaveného cílového skóre.
            Jakmile ho někdo dosáhne, ostatní hráči dohrají kolo a vyhrává
            ten s nejvyšším počtem bodů.
          </p>
        </Section>

        {/* Průběh kola */}
        <Section icon={<Clock className="w-5 h-5 text-primary" />} title="Průběh kola">
          <p>
            Každé kolo mají všichni hráči <strong>stejnou otázku</strong> se
            zamíchanými odpověďmi. Máš nastavený časový limit (výchozí 60 s)
            na označení co nejvíce správných odpovědí.
          </p>
          <p>
            <strong>Pozor:</strong> Každá špatná odpověď odečte 10 sekund
            z tvého času! Pokud ti vyprší čas, za kolo dostaneš 0 bodů.
          </p>
        </Section>

        {/* Bodování */}
        <Section icon={<Trophy className="w-5 h-5 text-primary" />} title="Bodování">
          <div className="grid grid-cols-2 gap-1.5 text-sm">
            <div className="bg-card/40 rounded-lg px-3 py-1.5">1 správná = <strong>1 bod</strong></div>
            <div className="bg-card/40 rounded-lg px-3 py-1.5">2 správné = <strong>3 body</strong></div>
            <div className="bg-card/40 rounded-lg px-3 py-1.5">3 správné = <strong>5 bodů</strong></div>
            <div className="bg-card/40 rounded-lg px-3 py-1.5">4 správné = <strong>7 bodů</strong></div>
            <div className="bg-card/60 rounded-lg px-3 py-1.5 col-span-2 text-center border border-primary/30">
              5 správných = <strong className="text-primary">10 bodů</strong> 🎉
            </div>
          </div>
        </Section>

        {/* Balíčky otázek */}
        <Section icon={<Layers className="w-5 h-5 text-primary" />} title="Okruhy otázek">
          <p>
            Otázky jsou rozdělené do <strong>tematických balíčků</strong> (okruhů).
            V nastavení hry si vybereš, které balíčky chceš hrát.
          </p>
          <p>
            Můžeš hrát <strong>jen jeden okruh</strong> (např. jen hudbu),
            nebo <strong>zapnout všechny najednou</strong> pro pestřejší mix.
            Otázky se pak losují ze všech aktivních balíčků.
          </p>
          <p>
            Nové balíčky můžeš získat v sekci „Balíčky" v nastavení hry.
          </p>
        </Section>

        {/* AI tlačítko */}
        <Section icon={<Sparkles className="w-5 h-5 text-primary" />} title="AI pomoc">
          <p>
            Během hry můžeš zmáčknout tlačítko <strong>AI</strong>. Umělá
            inteligence ti vysvětlí, proč je každá odpověď správná nebo
            špatná – ideální, když s odpovědí nesouhlasíš.
          </p>
          <p>
            <strong>Ale pozor:</strong> pokud AI použiješ, celé kolo se
            zruší a začíná znovu pro všechny hráče. Body se nepočítají.
          </p>
        </Section>

        {/* Rozstřel */}
        <Section icon={<Brain className="w-5 h-5 text-primary" />} title="Rozstřel">
          <p>
            Pokud na konci kola mají dva nebo více hráčů stejné nejvyšší
            skóre, nastává <strong>rozstřel</strong> – speciální kolo,
            které určí vítěze.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card/30 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
      </div>
      <div className="text-sm text-foreground/80 space-y-2">{children}</div>
    </div>
  );
}
