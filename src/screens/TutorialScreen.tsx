import { X, Target, Clock, Brain, Sparkles, Layers, Trophy, ShoppingCart, CheckCircle, Hand } from "lucide-react";
import { playSound } from "@/lib/sounds";

interface TutorialScreenProps {
  onClose: () => void;
}

export function TutorialScreen({ onClose }: TutorialScreenProps) {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="font-display text-2xl font-bold text-primary">Jak hrát Party King</h1>
        <button
          onClick={() => { playSound("click"); onClose(); }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-card/60"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-5">
        {/* Co je Party King */}
        <Section icon={<Target className="w-5 h-5 text-primary" />} title="Co je Party King?">
          <p>
            Party King je <strong>vědomostní hra pro partu kamarádů</strong> (1–8 hráčů).
            Všichni hrajete na jednom telefonu nebo tabletu – žádné stahování
            dalších aplikací není potřeba.
          </p>
          <p>
            Střídáte se, odpovídáte na otázky a sbíráte body.
            Kdo první nasbírá dost bodů, vyhrává! 👑
          </p>
        </Section>

        {/* Jak probíhá tah */}
        <Section icon={<Hand className="w-5 h-5 text-primary" />} title="Jak probíhá tvůj tah">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Zobrazí se ti <strong>otázka</strong> a velký kruh s <strong>10 odpověďmi</strong>.</li>
            <li>Z těch 10 odpovědí je <strong>5 správných</strong> a <strong>5 špatných</strong> – jsou zamíchané.</li>
            <li>Klikej na odpovědi, o kterých si myslíš, že jsou <strong>správné</strong>.</li>
            <li>Až budeš hotový/á, klikni na <strong>„Potvrdit"</strong>.</li>
          </ol>
          <p className="mt-2">
            💡 <strong>Tip:</strong> Nemusíš najít všech 5 – čím víc správných označíš,
            tím víc bodů dostaneš. Ale pozor na chyby!
          </p>
        </Section>

        {/* Časový limit */}
        <Section icon={<Clock className="w-5 h-5 text-primary" />} title="Časový limit">
          <p>
            Na každou otázku máš <strong>omezený čas</strong> (standardně 60 sekund).
            Časomíru vidíš nahoře na obrazovce.
          </p>
          <p>
            ⚠️ <strong>Každá špatná odpověď ti sebere 10 sekund!</strong> Takže
            neklikej naslepo – je lepší označit méně odpovědí, ale správně.
          </p>
          <p>
            Pokud ti vyprší čas a nestihneš potvrdit, za toto kolo dostaneš <strong>0 bodů</strong>.
          </p>
        </Section>

        {/* Bodování */}
        <Section icon={<Trophy className="w-5 h-5 text-primary" />} title="Kolik bodů dostanu?">
          <p>Čím víc správných odpovědí označíš, tím víc bodů:</p>
          <div className="grid grid-cols-2 gap-1.5 text-sm mt-2">
            <div className="bg-card/40 rounded-lg px-3 py-1.5">1 správná = <strong>1 bod</strong></div>
            <div className="bg-card/40 rounded-lg px-3 py-1.5">2 správné = <strong>3 body</strong></div>
            <div className="bg-card/40 rounded-lg px-3 py-1.5">3 správné = <strong>5 bodů</strong></div>
            <div className="bg-card/40 rounded-lg px-3 py-1.5">4 správné = <strong>7 bodů</strong></div>
            <div className="bg-card/60 rounded-lg px-3 py-1.5 col-span-2 text-center border border-primary/30">
              Všech 5 správných = <strong className="text-primary">10 bodů</strong> 🎉
            </div>
          </div>
          <p className="mt-2">
            Za špatně označené odpovědi body neztrácíš (jen čas).
            Ale pokud neoznačíš nic a jen potvrdíš, dostaneš 0.
          </p>
        </Section>

        {/* Kdo vyhrává */}
        <Section icon={<Crown className="w-5 h-5 text-primary" />} title="Kdo vyhrává?">
          <p>
            Před hrou si nastavíte <strong>cílové skóre</strong> (např. 30 bodů).
            Jakmile někdo toto skóre dosáhne, <strong>ostatní hráči ještě dohrají
            aktuální kolo</strong>, aby to bylo fér.
          </p>
          <p>
            Vyhrává hráč s <strong>nejvyšším počtem bodů</strong>. Pokud mají dva
            nebo více hráčů stejné skóre, nastává <strong>rozstřel</strong> –
            speciální kolo, které rozhodne o vítězi.
          </p>
        </Section>

        {/* Balíčky otázek */}
        <Section icon={<ShoppingCart className="w-5 h-5 text-primary" />} title="Balíčky otázek (okruhy)">
          <p>
            Otázky jsou rozdělené do <strong>tematických balíčků</strong> –
            například „Obecné znalosti", „Hudba", „Zeměpis Česka" a další.
          </p>
          <div className="bg-card/40 rounded-lg p-3 space-y-2 mt-2">
            <p className="font-bold text-foreground">Jak to funguje:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Získej balíček</strong> – V nastavení hry klikni na „Balíčky" a získej ty, které tě zajímají (některé jsou zdarma).</li>
              <li><strong>Označ balíček jako aktivní</strong> – Získaný balíček ještě musíš „zaškrtnout", aby se z něj losovaly otázky.</li>
              <li><strong>Hraj!</strong> – Ve hře se pak otázky losují ze všech aktivních (zaškrtnutých) balíčků.</li>
            </ol>
          </div>
          <p className="mt-2">
            🎯 Můžeš hrát <strong>jen jeden okruh</strong> (např. jen hudbu),
            nebo <strong>zapnout všechny najednou</strong> pro pestřejší mix.
            Vždy musí být aktivní alespoň jeden balíček.
          </p>
        </Section>

        {/* AI pomoc */}
        <Section icon={<Sparkles className="w-5 h-5 text-primary" />} title="AI pomoc">
          <p>
            Během hry uvidíš tlačítko <strong>„AI"</strong>. Když na něj klikneš,
            umělá inteligence ti vysvětlí, proč je každá odpověď správná nebo špatná.
          </p>
          <p>
            ⚠️ <strong>Má to ale háček:</strong> pokud AI použiješ, celé kolo se
            zruší a začíná znovu pro všechny hráče. Body za toto kolo se nepočítají.
            Používej to jen když opravdu potřebuješ vysvětlení!
          </p>
        </Section>

        {/* Střídání hráčů */}
        <Section icon={<Brain className="w-5 h-5 text-primary" />} title="Střídání hráčů">
          <p>
            Hrajete na jednom zařízení. Po každém tahu se zobrazí obrazovka
            s <strong>jménem dalšího hráče</strong>. Předejte telefon a další
            hráč potvrdí, že je připravený.
          </p>
          <p>
            Všichni hráči v jednom kole odpovídají na <strong>stejnou otázku</strong> –
            ale odpovědi jsou pokaždé zamíchané jinak, takže koukat sousedovi nepomůže 😉
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
