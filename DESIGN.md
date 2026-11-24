# POLAPENO — Design systém

> Závazný dokument pro stavbu landing page. Claude Code ho čte jako první
> a řídí se jím. Když zadání s tímto dokumentem koliduje, Claude Code to
> nahlásí — to je v pořádku, ne chyba.

---

## 1. Anti-slop pravidla

Následující vzory jsou zakázané, protože jsou typické pro generované stránky
a okamžitě signalizují „tohle nedělal člověk".

### Layout

- Žádné čísla v kroužcích nebo badges (01, 02, 03).
- Žádná symetrická mřížka stejných dlaždic (3 karty vedle sebe, všechny stejné).
- Žádné ikony z knihovny jako vizuální kotva sekce (štít = bezpečnost, hodiny = rychlost).
- Žádné dvě po sobě jdoucí sekce se stejnou stavbou.
- Žádné karty se stínem a zaoblením.
- Žádné gradientní pozadí, blur, glow efekty.

### Obsah

- Žádný text, který není pravdivý a doložitelný (žádné „1000+ spokojených zákazníků" bez důkazu).
- Žádné generické fráze („Revoluce v…", „Budoucnost…", „Jednoduché a intuitivní").
- Žádné logo bary („Důvěřuje nám…"), dokud nejsou skutečné.
- Žádné falešné testimonials ani reference.
- Žádné emoji jako vizuální prvky.
- Žádné oddělovací tečky „·“ a „•“ ani svislítka „|“ (ani pomlčky „—“ jako
  spojka) mezi kusy textu. Je to typický znak generovaných stránek. Místo
  toho přirozená věta, čárka nebo zalomení na nový řádek.

### Grafika

- Žádné generické ilustrace ze stock knihoven (undraw, storyset, flaticon).
- Žádné stock fotky s usmívajícími se lidmi.
- Žádné ikony v kolečkách.
- Pokud něco vypadá, jako by to mohl vygenerovat jakýkoliv AI nástroj za 30 sekund, nepatří to na stránku.

### Animace

- Žádné animace bez účelu (třepotání, pulzování, rotace pro efekt).
- Animace musí něco sdělovat (pořadí, vstup do viewportu, reakce na akci).
- Nekonečně cyklující textové animace jsou zakázané (přístupnost).

---

## 2. Barvy

Teplá, přátelská paleta. Polapeno je služba pro řemeslníky — barvy mají
evokovat dílnu, papír, inkoust, ne startup dashboard.

| Token           | Hodnota   | Použití                                               |
|-----------------|-----------|-------------------------------------------------------|
| Papír           | `#f6f4ef` | Pozadí světlých sekcí. Teplý krém, ne bílý, ne šedý.  |
| Inkoust         | `#1a1a2e` | Základní text. Tmavá teplá modř, ne čistá černá.      |
| Akcent          | `#6c5ce7` | Indigo do fialova. Jen: primární CTA, eyebrow, focus ring, ::selection a rough.js kresby. Nikde jinde. |
| Tmavé pozadí    | `#1e1b2e` | Hero, závěrečné CTA. Tmavá s fialovým nádechem.       |
| Kresby          | akcent / papír | Na světlém pozadí akcent, na tmavém pozadí papír.     |

**Zakázané barvy:** Červená. Zelená jen pro konkrétní význam (fajfka v ceníku).
Žádné pestré barevné přechody.

---

## 3. Typografie

Jeden font, síla je v hierarchii velikostí a tlouštěk, ne v počtu fontů.
Dvě „kreativní" písma kombinovaná dohromady jsou spolehlivý znak generované
stránky.

**Font:** Jeden self-hostovaný sans-serif s jemně zaoblenými tahy.
Kandidáti (rozhodne se podle toho, jak vypadají s českými znaky a s názvem
„Polapeno"):

- **Rubik** — mírně zaoblený, profesionální, méně okoukaný.
- **DM Sans** — čistý, moderní, teplý bez přehnané hravosti.
- *Nunito záloha — ale je hodně rozšířený na SaaS stránkách, hrozí template pocit.*

**Váhy:** Maximálně tři — regular (400), bold (700), black (900). Žádné
„semi-bold, medium, extra-bold" přechody.

**Velikostní škála (desktop):**

- Hlavní nadpis hero: největší na stránce, dominantní.
- Nadpisy sekcí: výrazně menší než hero, ale stále silné.
- Podnadpisy / claim: střední velikost.
- Tělo textu: čitelné, ne malé.
- Drobný text (note, eyebrow): nejmenší, ale minimálně 14 px.

**Pravidla:**

- Žádné ALL CAPS kromě eyebrow textu (a i tam zvážit, jestli to není příliš „corporate").
- Žádný gradientní text.
- Žádné textové stíny.
- Řádkování dostatečné pro čitelnost na mobilu (1.3–1.5 u nadpisů, 1.6+ u těla).
- Konkrétní px hodnoty se definují s hotovým fontem — záleží na jeho metrikách.

**Výjimka — ručně psaná poznámka u video reference:** jediné místo na webu,
kde je jiné písmo než Rubik. Krátká poznámka „Reference od zákazníka“ u videa
v heru, jen na desktopu od 1200 px. Písmo Caveat (OFL), self-hosted woff2
ořezané jen na znaky poznámky (pod 10 kB), načítá se jen tam, kde je poznámka
vidět. Žádný jiný text na stránce ručně psaný být nesmí — dvě „kreativní“
písma vedle sebe by byla přesně ten znak generované stránky, před kterým
tahle kapitola varuje.

**Logo „Polapeno":** Textové logo v hlavním fontu, váha black (900). Žádný
symbol, žádná ikonka. Pokud se časem udělá skutečné logo, nahradí se.

---

## 4. Vizuální prvky

Každý vizuální prvek musí mít důvod — buď zvýrazňuje důležité slovo,
ukazuje pořadí, nebo odděluje sekce. Žádná dekorace „aby to bylo hezčí".
Pokud prvek můžeš odstranit a stránka řekne to samé, nemá tam co dělat.

### Ruční kresby (rough.js)

Knihovna rough.js generuje linie s přirozenou nepravidelností, jako by je
někdo nakreslil rukou. Nahrazuje původní skenované SVG kresby.

**Kde použít (2 prvky na celé stránce):**

- Podtržení pod klíčovým slovem nebo cenou: cena v §2 a „na měsíc“ v §6.

**Kde NEPOUŽÍT:**

- Rámečky kolem karet nebo bloků.
- Kolem čísel.
- Jako pozadí nebo textura přes celou plochu.
- Kolem tlačítek.
- Všude — pokud je rough.js na každém prvku, přestane být vidět.

**Výjimka — rámeček video reference:** kolem videa v heru je rámeček
z rough.js (viz Video reference níže). Je to jediný povolený rámeček kolem
bloku. Dvojitá čára, která na rozích lehce přetahuje, barva papíru, statický
(bez animace dokreslení).

**Výjimka — šipka od poznámky k videu:** jedna zakřivená čára s hrotem od
ručně psané poznámky k rámečku video reference (desktop od 1200 px).
Stejná barva a síla čáry jako rámeček, dokreslí se jednou podle pravidla
níže. Žádné další šipky na stránce.

**Styl:** Jemný, jedna čára, ne přehnané „dětské" čmárání. Barva inkoustu
nebo akcentu, na tmavém pozadí papír. Kresby se animují při scrollu —
jednorázový nábíh (fade + draw), žádné opakování.

### Video reference (výjimka)

Jediný video obsah na stránce: krátké svislé video skutečného klienta
(Autoslužby Ander) s vypálenými titulky. Je to doložitelná reference,
ne testimonial vymyšlený pro web.

- **Umístění:** na desktopu (od 1024 px) v heru vpravo od textu, šířka
  300 px, poměr 9 : 16. Na mobilu samostatný blok hned pod textem hera na
  stejném tmavém pozadí, šířka `min(78vw, 300px)`.
- **Rámeček:** rough.js, generovaný při buildu, jen čáry (žádné detaily
  telefonu), 12 px od hrany videa, video má zaoblené rohy.
- **Popisek:** malým písmem, barva papíru, text v `config.mjs`. Vypnutí
  videa = `VIDEO_REFERENCE = false`.
- **Přehrávání:** bez JS náhled s nativním přehrávačem. S JS ztlumená
  smyčka, která se začne stahovat až po události `load` a jen když je video
  poblíž viewportu; mimo viewport pauza. Smyčka videa není „nekonečně
  cyklující animace“ ve smyslu §1: je to obsah, ne dekorace, a při
  `prefers-reduced-motion` nebo šetření dat se automaticky nespouští.
- **Poznámka:** na desktopu od 1200 px ručně psané „Reference od zákazníka“
  vlevo dole od videa se šipkou k rámečku (výjimky v §3 a výše). Jediná
  ručně psaná poznámka na webu, jen u video reference. Pod 1200 px místo ní
  popisek na dva řádky: „Reference od zákazníka“ a pod ním
  „Autoslužby Ander, Rychvald“.
- **Křídové kresby v heru:** na desktopu od 1200 px z obrázku zůstává jen
  výřez s autem mezi claimem a videem (klíč a telefon nahradila poznámka).
  Do videa, rámečku ani poznámky nezasahuje.
- **Výkon:** video je v heru, výšku stránky na 1440 px nezvyšuje. Náhled
  videa je na desktopu (a na vyšších mobilech) LCP prvkem, proto má preload.
  LCP na mobilu do 2,0 s (výjimka v §6).

### Ilustrace

**Pravidla:**

- Pokud ilustrace nevypadá konzistentně se zbytkem stránky, jde pryč.
  Stránka musí fungovat i bez ilustrací.
- Žádné stock ilustrace z jakékoli knihovny.
- Žádné barevné AI ilustrace (křičí „generované").
- Žádné ilustrace lidí s obličeji (uncanny valley u AI).
- Maximum 4 ilustrace ve sketch chalk stylu na tmavém pozadí. Ilustrace se
  generují externě a vkládají jako obrázky.
- Ilustrace se používají jen na sekcích s tmavým pozadím.

---

## 5. Struktura stránky

Sekce se střídají: tmavá a světlá plocha. Dvě stejné vedle sebe nesmí
být nikdy.

Výjimka: Dvě světlé sekce vedle sebe jsou povolené, pokud mají vizuálně
odlišnou strukturu (např. ceník se sloupci vedle FAQ s textem).

| §  | Název                       | Podklad        | Účel                                                |
|----|-----------------------------|----------------|-----------------------------------------------------|
| 1  | Hero                        | Tmavý + ilustrace | Hook — problém + řešení + demo číslo (zavolejte si) |
| 2  | Tři možnosti                | Světlý (papír) | Proč dosavadní řešení nefungují                     |
| 3  | Nastavíte to za odpoledne   | Tmavý          | Jak to funguje — zbavit obav z komplikovanosti      |
| 4  | Ceník                       | Světlý (papír) | Kolik to stojí — transparentní, bez triků           |
| 5  | FAQ                         | Světlý (papír) | Zbavit posledních pochybností                       |
| 6  | Závěrečné CTA               | Tmavý          | Poslední výzva — Od X Kč, bez smlouvy, zrušíte kdykoliv |

**Hero obsahuje demo číslo** — to je hlavní lákadlo, patří nahoru.
CTA „Zavolejte si asistenta" s viditelným telefonním číslem. Demo číslo
se řídí přepínačem `DEMO_READY` — když je `false`, číslo se nezobrazí
a zůstane jen CTA na portál.

**Název „Polapeno" se objeví:**

- V textovém logu v navigaci.
- V page title a og:title.
- V meta description.
- V patičce stránky.
- Nikde jinde na stránce se název služby neomílá — stránka mluví o tom,
  co služba dělá, ne jak se jmenuje.

---

## 6. Layout a výkon

- Maximální šířka obsahu: definovaná, konzistentní.
- Mezery jen ze škály — žádné náhodné hodnoty.
- Stránka na 1440×900 pod **4650 px** celkové výšky.
- LCP pod **1,5 s**, CLS pod **0,02**.
  - Výjimka pro video referenci: na mobilu (Lighthouse, mobilní profil)
    smí být LCP do **2,0 s**. Náhled videa je tam v prvním viewportu a je
    LCP prvkem; ani menší náhled (20 kB) se pod 1,5 s nedostane. Na desktopu
    limit 1,5 s platí beze změny.
- Musí fungovat na **1440 i 360 px**, bez JS, a s `prefers-reduced-motion`.
- Ceny, URL, texty CTA, demo číslo: vše jen v **jednom konfiguračním souboru**.
  Vypnout sekci = jeden `false`.

---

## 7. Technika

- **Astro (statický build).** Žádný React, žádný Vue, žádné JS komponenty.
- Styly v jednom CSS souboru. JS v jednom souboru: IntersectionObserver
  spouští jednorázové CSS animace (dokreslení kreseb při vstupu do viewportu)
  a přehrávání video reference (vanilla JS, žádná knihovna).
- **rough.js** je jediná povolená knihovna.
- Žádné další knihovny (GSAP, Lenis, Tailwind…) se nepřidávají.
- Nasazení na Netlify. Nasazuje **jen Tomáš**, na výslovný pokyn.
- Práce ve větvích, hotové změny přes PR. Do main se nepushuje.
- Commity česky.
