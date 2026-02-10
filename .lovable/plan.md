

# Party King – Vědomostní párty hra 🎉👑

## Přehled
Mobilně optimalizovaná vědomostní hra pro 2–8 hráčů na jednom zařízení, plně v češtině, bez backendu.

## Obrazovky a funkce

### 1. Úvodní obrazovka
- Název "PARTY KING" s korunkou a konfetami na fialovo-růžovém gradientu (dle dodaného vizuálu)
- Tlačítko "Nová hra" (oranžové, zaoblené)
- Odkaz "Pravidla" – zobrazí modal/stránku s pravidly hry

### 2. Nastavení hry
- Výběr počtu hráčů (2–8) pomocí tlačítek
- Nastavení cílového počtu bodů (slider, výchozí 50)
- Přidání hráčů: zadání jména + výběr jednoho z 8 wallpaperů/barev
- Seznam přidaných hráčů s barevnými kartami
- Tlačítko "Start hry" (aktivní pouze při min. 2 hráčích)

### 3. Přepínací obrazovka hráče
- Zobrazí jméno dalšího hráče na tahu s jeho wallpaperem/barvou
- Tlačítko "Začít" – po kliknutí začne běžet čas

### 4. Herní obrazovka (hlavní gameplay)
- **Horní lišta:** všichni hráči se skóre, seřazení dle bodů, barevně odlišení
- **Otázka:** zobrazená pod lištou v kartě
- **Kruh odpovědí:** 10 výsečí s textem odpovědí (sahající do středu), text horizontálně
- **Časomíra:** analogové hodiny (1 minuta) vlevo – ručička + barevné odlišení uplynulého/zbylého času
- **Mechanika:** klik na výseč → správná zezelená, špatná zčervená + odečte 10s z časomíry
- **Konec tahu:** po nalezení všech 5 správných nebo uplynutí času
- Tlačítko "Odeslat" pod kruhem

### 5. Bodování
- 1 správná = 1 bod, 2 správné = 3 body, 3 správné = 5 bodů, 4 správné = 7 bodů, 5 správných = 10 bodů (progresivní)

### 6. Obrazovka vítěze
- Po dosažení cílového skóre: zobrazení vítěze, celkové pořadí
- Možnost přehledu správných odpovědí
- Tlačítko "Nová hra"

## Data
- Otázky uložené staticky v JSON souboru (česky), 10 odpovědí na otázku (5 správných, 5 špatných)
- Připraveno na snadné rozšíření o další balíčky otázek

## Design
- Barevný, hravý design dle dodaných vizuálů (gradientní pozadí, oranžová tlačítka, zaoblené karty)
- Plně mobilně optimalizované (portrait orientace)
- 8 různých barevných témat/wallpaperů pro hráče

## Volitelně: iOS distribuce
- Po dokončení možnost zabalit jako nativní iOS app přes Capacitor pro TestFlight

