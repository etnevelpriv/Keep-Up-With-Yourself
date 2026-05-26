# Keep Up With Yourself

## Tanulaskoveto web app.

---

### Alap funkciok

- Felhasznalo bejelentkezhet.  
- A bejelentkezett felhasznalo csak a sajat adatait latja.  
- A felhasznalo letrehozhat "todo" szeru feladatokat.  

#### A feladatoknal a kovetkezo adatokat lehet megadni (mindegyik kotelezo):

- Feladat cime (sajat szoveget irhat - string tipusu valtozo)  
- Feladat leirasa (sajat szoveget irhat - string tipusu valtozo)  
- Hatarido (naptarbol tudja kivalasztani - date tipusu valtozo)  
- Fontossag (megadott listabol valaszthat - num tipusu valtozo)  
- Tipus (megadott listabol valaszhat, de irhat sajatot is(amit ir, az a listahoz adodik) - string tipusu valtozo)  

---

### Feladatok kezelese

- A felhasznalo megtekintheti a korabbi feladatait.  

#### A korabbi feladatokhoz tartozik 1-1 badge (a badge-nek 3 tipusa van):

- **Folyamatban**  
  (Ha a felhasznalo letrehozza a feladatot, akkor ez az alapertelmezett badge. A badge akkor cserelodik le, ha a hatarido lejar, vagy a feladatot teljesitettek)

- **Lejart**  
  (Ha a hatarido lejart a feladat teljesitese elott)

- **Teljesitett**  
  (Ha a felhasznalo teljesitettnek jeloli be a feladatot)

- A badget akkor is lehet teljesitettnek jelolni, ha annak hatarideje mar lejart.  

#### Szures es rendezes

- A korabbi feladatokat lehet szurni status es importance szerint, akar tobb elemek kilehet jelolni mindkettobol a szuroben.   
- A korabbi feladatokat lehet rendezni deadline es nev szerint mind novekvo, mind csokkeno sorrendben. 

---

### Oldalak es navigacio

- A weboldalon a bejelentkezes elott csak a landing paget lehet megtekinteni es a login/register oldalt.  
- A login es a register 2 kulon html fajl.  
- A navigacios sav listajaban csak a landing page es annak reszeit lehet elerni.  
- A navigacios sav tartalmaz tovabba 1 CTA gombot, ahol a felhasznalo betud jelentkezni/fiokot letrehozni/belepnia mar bejelentkezett fiokjaba.  

#### Bejelentkezett allapot

A bejelentkezett felhasznalo a bejelentkezest koveteon 3 tovabbi oldalt lat:

- Egyet ahol tud letrehozni feladatot  
- Egyet, ahol megtekintheti korabbi feladatai  
- Egyet ahol lathatja sajat adatait  

#### Statisztikak

A korabbi feladatok oldalon a felhasznalo lathat statisztikakat a feladatairol:

- a befejezett feladatok aranyat  
- a feladatok tipusait  
- az atlagos hataridoket az adott fontossagi sorrendekhez  

---

## Adatbazis struktura



### users:
- userID: (string)  
- userEmail: (string)  
- userName: (string)  
- userCreatedAt: (timestamp)  
- userVerified: (bool)  
- tasks (collection):
  - taskName (string)  
  - taskDesc (string)  
  - taskDeadline (timestamp)  
  - taskImportance (string)  
  - taskTypeName (string)  
  - taskStatus (string)  
  - taskCompletedAt (timestamp)  
  - taskCreatedAt (timestamp)  
  - taskUpdatedAt (timestamp)
- task_types (collection):
  - taskTypeName: (string)  
  - taskType_isSystem: (bool)  

---

## Auth szabalyok

- Egy felhasznalonak csak 1 fiokja lehet.  
- Ketto fele provider elfogadott. Google, Email/Password.  
- Ha a felhasznalo mar regisztralt Google providerrel akkor mar nem tud se bejelentkezni, se regisztralni ugyan azon email cimmel.  
- Ha a felhasznalo mar regisztralt Email/Password providerrel, akkor mar nem engedi regisztralni ugyan azzal a providerrel, de Google-el igen (igy 2 provider lesz csatolva 1 fiokhoz).  
- Ha a felhasznalo meg nem regisztralt, akkor barmivel regisztralhat.  
- Ha a felhasznalo meg nem regisztralt, akkor a bejelentkezesnel a Google providerre kattintva egybol regisztral egy fiokot.  

- Ha a felhasznalo Email/Password providerrel regisztral, akkor kotelezo megadnia nevet a regisztracio soran.  
- Ha a felhasznalo Google providerrel regisztral, akkor a nev automatikusan a Google fiokjanak a neve lesz.  

- Ha a felhasznalo Email/Password providerrel regisztral, akkor kap egy visszaigazolo emailt, ha igazolja email cimet, akkor lesz verified az adatbazisban.  
- Ha a felhasznalo Google providerrel regisztral, akkor a verified automatikusan true lesz.  

- Ha a felhasznalo az adatbazisban verified, akkor lephet csak be.  

- Ha a felhasznalo letezik, de nem verified es megprobal regisztralni, akkor a regisztracios folyamat ujrakezdodik (elozo felhasznalo torlodik, ujat hoz letre) (mindket providerrel)  

- Ha a felhasznalo letelzik, de nem verified es megprobal bejelentkezni, akkor hibauzenetet kap, hogy nincs visszaigazolva a fiokja es nezze meg az emailjet (uj emailt kuldd)  

- A visszaigazolo emailt korlatozzuk felhasznalonkent (percenkent 1)  

- Az auth fiokhoz adott UUID-t mentjuk el az adatbazisban a userID-nak.  

---

## Teszteles es deploy

- Az automatizalt szoftverteszteles vitestel fog tortenni, mellette manualisan tesztelunk.  
- A weboldalt hostoljuk firebasen keresztul.  
- Az egesz forraskod publikus githubon.  

---

## Csapat

- Rasztovits Levente (etnevelpriv)  
- Kover Marcell (M4rc1xd)  
- Borbara Kristof (k3i2t0r)  

---

## Tervezett technologiak

- TypeScript  
- HTML  
- CSS  
- Firebase Auth  
- Firestore  
- Firebase Host  
- Node.js  
- vite  
- vitest  

---

# Fejlesztesi folyamat

## 0. Inicializalas, elokeszules (9 / 9)

- projektOtlet.txt megirasa [Levente] (kesz)  
- GitHub repo init [Levente] (kesz)  
- Csoporttagok bevetele a repoba, mint contributor [Kozos] (kesz)  
- README megirasa, projektOtlet.txt atirasa README.md fajla [Levente] (kesz)  
- Vite projekt inicializalasa TypeScript nyelven keretrendszer nelkul [Levente] (kesz)  
- Mappastruktura felalliatsa, fajlok letrehozasa [Levente] (kesz)  
- Firebase projekt inicializalasa [Levente] (kesz)  
- Csoporttagok bevetele a firebase projektbe, mint editor [Kozos] (kesz)  
- .venv-ben elmenteni a biztonsagi kulcsokat, firebase adatokat  [Levente] (kesz)

---

## 1. Auth letrehozasa (19 / 19)

- Firebase projektben felallitani az authenticationt mindket providerhez [Levente] (kesz)  
- Elkesziteni az alap regisztracios oldalt [Levente] (kesz)  
- Elkesziteni a szukseges interfacet es a szukseges class-t megfelelo hibakezelessel [Levente] (kesz)  
- Implementalni az email/password provideres regisztraciot [Levente] (kesz)  
- Authentication fiok mentodjon el az adatbazisba is [Levente] (kesz)  
- Regisztracios folyamat soran a nev megadasa is legyen kesz, mentodjon el az adatbazisba [Levente] (kesz)  
- Implementalni a google provideres regisztraciot [Levente] (kesz)  
- Google provider eseten a google fiok neve legyen a felhasznalo neve az adatbazisban [Levente] (kesz)  
- Visszaigazolo email kuldes email/passdword provideres regisztracio eseten [Levente] (kesz)  
- Visszaigazolo email tenylegesen funkcionaljon es az adatbazisban tegye a felhasznalot verifiedra [Levente] (kesz)  
- Elkesziteni a login oldalt [Levente] (kesz)  
- A login oldal ellenorizze, hogy a felhasznalo letezik es verified [Levente] (kesz)  
- Reset password gomb keszites es funkcionalissa tetele [Levente] (kesz)
- Az emailek (verifikacios es reset password) szama legyen korlatozva [Levente] (kesz)
- Hiba megjelenitese, tajekoztato informaciok megjelenitese a felhasznalonak magyarul minden esetben login es register eseteben is, pl: Az email cim meg nincs hitelesitve, az email cim mar hasznalatban van, a hitelesito email elkuldve, stb... [Levente] (kesz)
- login.html es register.html teljes dizajnolasa, felugro modalok, uzenetek jol jelenjenek meg, teljes auth.css elkeszitese, UI optimalizalasa [AI] (kesz)
- Regisztracio kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristóf] (kesz)  
- Bejelentkezes kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristóf] (kesz)  
- Reset password kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristof] (kesz)  
- Verifikacio kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristof] (kesz)  

---

## 2. Firestore db felallitasa es szabalyok megirasa (2 / 2)

- TaskType collection letrehozasa, nehany tesztadat letrehozasa [Levente] (kesz)  
- Database rules megirasa [Levente] (kesz)  

---

## 3. Landing page elkeszitese (4 / 4)

- Teljes HTML struktrura felallitasa az index.html-hez [Levente] (kesz)  
- Global base css struktura felallitasa, valtozok megadasa [Levente] (kesz)  
- Teljes css megirasa a landing pagehez [Levente es AI] (kesz)  
- Animaciokhoz szukseges minimalis ts kod megirasa [AI] (kesz)  

---

## 4. Letrehozas oldal elkeszitese (7 / 7)

- Teljes HTML struktrura felallitasa a create.html-hez [Levente] (kesz)  
- Elkesziteni a szukseges interfacet es a szukseges class-t megfelelo hibakezelessel [Levente] (kesz)  
- Implementalni az adatbazishoz valo hozzaadas funkciot [Levente] (kesz)  
- Tipus mezo legyen kivalaszthato korabbibol, akar system, akar a user sajat tipusai, de lehessen ujat is hozzaadni [Levente] (kesz)  
- Frontenden legyenek lekorlatozva a hibas feltoltesek [Levente] (kesz)  
- Teljes css megirasa a base css segitsegevel [AI] (kesz)  
- Automatizalt teszt kod irasa vitest segitsegevel a classhoz [Levente] (kesz)  

---

## 5. Listazas oldal elkeszitese (5 / 6)

- Teljes HTML struktrura felallitasa a tasks.html-hez [Levente] (kesz)  
- Az aktualis user taskjaihoz tartozo lekerdezes funkcio implementalasa [Levente] (kesz)  
- Taskok megjelenitese annak minden adataval egyutt kreativ modon [Levente] (kesz)  
- Rendezes es szures funckio megvalositasa a leirtak szerint [AI] (kesz)  
- Teljes css megirasa a base css segitsegevel [AI] (kesz)  
- Oldal ellenorzese es manualis tesztelese kulonbozo kepernyokon sok kulonbozo task-al, majd a kepernyo fotok kimentese es docx fajlba [Levente] (nincs kesz)  

---

## 6. Taskok frissetese (5 / 5)

- Modusuljanak a taskStatus-ok a server oldalon, ha a deadline utan vagyunk mar, az ellenorzes csak bizonyos idonkent legyen. A kliensoldalon minden alkalommal ellenorizze a program, amikor a felhasznalo betolti az oldalt [Levente] (kesz)  
- Az elozo pont manualis tesztekese [Levente] (kesz)  
- "Feladat kesz"/valami hasonlo gomb keszitese minden feladathoz, modosuljon a taskStatus es a taskCompletedAt a kliensoldalon keresztul, ha a felhasznalo az adott taskot kesznek jeloli [Levente] (kesz)  
- "Feladat megsincs kesz"/valami hasonlo gomb keszitese minden kesz feladathoz, modosuljon a taskStatus es a taskCompletedAt a kliensoldalon keresztul, ha a felhasznalo az adott taskot nem elkeszultnek jeloli [Levente] (kesz)  
- "Feladat modositasa"/valami hasonlo gomb keszitese minden feladathoz, a gomb lenyomasara a create oldalhoz hasonlo modal ugorjon fel, ahol a felhasznalo az adott task minden valtozojat modosithatja. Ne irja at a taskCreatedAt, de a taskUpdatedAt valtozot igen. A validacio maradjon meg, csak ugy, mint a task letrahozasanal [Levente] (kesz)  

---

## 7. Profil oldal elkeszitese (3 / 3)

- Teljes HTML struktrura felallitasa a profile.html-hez [Levente] (kesz)  
- Korabbi interface es class segitsegevel megjeleniteni a felhasznalo adatait [Levente] (kesz)  
- "Jelszo modositasa"/valami hasonlo gomb elkeszitese, a gomb tenylegesen kuldje ki az emailt, a korabbi authentication resznel hasznalt function ujra fel lehet itt is hasznalni, nem kell ujat irni [Levente] (kesz)

---

## 8. Vegso simitasok - Nem kotelezo jelleggel, csak ha mar tenyleg minden kesz es meg akarnam folytatni (5 / 5)

- Nehany metatag hozzaadasa a landing pagehez [Levente] (kesz)   
- Deploy [Levente] (kesz)  
- Deploy utan manualis teszt nehany profilrol [Levente] (kesz)  
- Domain berlese [Levente] (kesz)  
- DNS konfiguralasa [Levente] (kesz)

## 8. MVP deploy utáni teendők (6 / 29)

- Service layer létrehozása [Levente] (kesz)
- Popup utils letrehozasa [Levente] (kesz)
- users/{uid}/tasks/{taskId} subcollection. [Levente] (kesz)
- Firestore rules mezőszintű validációval. [Levente] (kesz)
- Projekt prezentációja (projekt bemutatása fejlesztői/üzleti/user szempontbol, abrak, diagrammok, swot analizis, projekt roadmap, flowchart) [Levente] (nincs kesz)
- Task létrehozás/módosítás/törlés külön service layerben. [Levente] (kesz)
- Fióktörlés megerősítéssel (felugró modal). [Levente] (kesz)
- Rate limit auth emailekre. [Levente] (nincs kesz)
- Jogi oldalak. [Levente] (nincs kesz)
- README professzionális átírás. [Levente] (nincs kesz)
- Manual test docs. [Kristóf] (kesz)
- Firestore rules test. [Levente] (nincs kesz)
- CRUD unit/integration tesztek. [Levente] (nincs kesz)
- Error/loading/empty state-ek. [Levente] (nincs kesz)
- Email templatek.[Marcell] (kesz)
- Log collection, külön documentumok az auth logoknak és a task logoknak. [Levente] (nincs kesz)
- Profile statisztika. [Marcell] (nincs kesz)
- SEO + Google indexelés. [Levente] (nincs kesz)
- GA cookie consent. [Levente] (nincs kesz)
- Slugok. [Marcell] (nincs kesz)
- Password visibility toggle font awesome ikonnal. [Levente] (nincs kesz)
- Streak rendszer kiépítése [Levente] (nincs kesz)
- Gamification (xp, szintek, badgek, rangok) [Levente] (nincs kesz)
- Jelszavak több karaktert is tartalmassanak [Levente] (kesz)
- Auth rate limiting [Levente] (nincs kész)
- favicon beallitasa [Levente] (nincs kesz)
- admin oldal letrehozasa [Levente] (nincs kesz)
- lehessen torolni taskTypeot [Levente] (nincs kesz)

---
Repo klonozasa: git clone https://github.com/etnevelpriv/Keep-Up-With-Yourself.git
Dependencyk letoltese: npm i
Frontend inditasa: npm run dev
Frontend buildelese: npm run build
