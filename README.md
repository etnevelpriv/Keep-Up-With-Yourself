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
- Fontossag (megadott listabol valaszthat - string tipusu valtozo)  
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

- A korabbi feladatokat lehet szurni badge es cim szerint.  
- A korabbi feladatokat lehet rendezni datum szerint.  

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

### task:

- userId (string)  
- taskId (string)  
- taskName (string)  
- taskDesc (string)  
- taskDeadline (timestamp)  
- taskImportance (string)  
- taskTypeId (string)  
- taskStatus (string)  
- taskCompletedAt (timestamp)  
- taskCreatedAt (timestamp)  
- taskUpdatedAt (timestamp)  

### users:

- userId: (string)  
- userEmail: (string)  
- userName: (string)  
- userCreatedAt: (timestamp)  
- userVerified: (bool)  

### task_types:

- taskTypeId (string)  
- userId: (string)  
- taskTypeName: (string)  
- taskType_isSyste: (bool)  

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

## 1. Auth letrehozasa (1 / 19)

- Firebase projektben felallitani az authenticationt mindket providerhez [Levente] (kesz)  
- Elkesziteni az alap regisztracios oldalt [Levente] (kesz)  
- Elkesziteni a szukseges interfacet es a szukseges class-t megfelelo hibakezelessel [Levente] (kesz)  
- Implementalni az email/password provideres regisztraciot [Levente] (nincs kesz)  
- Authentication fiok mentodjon el az adatbazisba is [Levente] (nincs kesz)  
- Regisztracios folyamat soran a nev megadasa is legyen kesz, mentodjon el az adatbazisba [Levente] (nincs kesz)  
- Implementalni a google provideres regisztraciot [Levente] (nincs kesz)  
- Google provider eseten a google fiok neve legyen a felhasznalo neve az adatbazisban [Levente] (nincs kesz)  
- Visszaigazolo email kuldes email/passdword provideres regisztracio eseten [Levente] (nincs kesz)  
- Visszaigazolo email tenylegesen funkcionaljon es az adatbazisban tegye a felhasznalot verifiedra [Levente] (nincs kesz)  
- Elkesziteni a login oldalt [Levente] (nincs kesz)  
- A login oldal ellenorizze, hogy a felhasznalo letezik es verified [Levente] (nincs kesz)  
- Reset password gomb keszites es funkcionalissa tetele [Levente] (nincs kesz)  
- Ha a felhsznalo nem verified, akkor kuldjon visszaigazolo emailt a program [Levente] (nincs kesz)  
- Az emailek (verifikacios es reset password) szama legyen korlatozva [Levente] (nincs kesz)  
- Regisztracio kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristof] (nincs kesz)  
- Bejelentkezes kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristof] (nincs kesz)  
- Reset password kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristof] (nincs kesz)  
- Verifikacio kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristof] (nincs kesz)  

---

## 2. Firestore db felallitasa es szabalyok megirasa (0 / 4)

- Task collection letrehozasa, nehany tesztadat letrehozasa [Levente] (nincs kesz)  
- Users collectionbe nehany tesztadat letrehozasa [Levente] (nincs kesz)  
- TaskType collection letrehozasa, nehany tesztadat letrehozasa [Levente] (nincs kesz)  
- Database rules megirasa [Levente] (nincs kesz)  

---

## 3. Landing page elkeszitese (0 / 4)

- Teljes HTML struktrura felallitasa az index.html-hez [Levente] (nincs kesz)  
- Global base css struktura felallitasa, valtozok megadasa, gyakran hasznald classok megirasa [Levente] (nincs kesz)  
- Teljes css megirasa a landing pagehez [Levente] (nincs kesz)  
- Animaciokhoz szukseges minimalis ts kod megirasa [Levente] (nincs kesz)  

---

## 4. Letrehozas oldal elkeszitese (0 / 8)

- Teljes HTML struktrura felallitasa a create.html-hez [Marci] (nincs kesz)  
- Elkesziteni a szukseges interfacet es a szukseges class-t megfelelo hibakezelessel [Marci] (nincs kesz)  
- Implementalni az adatbazishoz valo hozzaadas funkciot [Marci] (nincs kesz)  
- Tipus mezo legyen kivalaszthato korabbibol, akar system, akar a user sajat tipusai, de lehessen ujat is hozzaadni [Marci] (nincs kesz)  
- Backenden legyenek lekorlatozva a hibas feltoltesek [Levente] (nincs kesz)  
- Frontenden legyenek lekorlatozva a hibas feltoltesek [Marci] (nincs kesz)  
- Teljes css megirasa a base css segitsegevel [Marci] (nincs kesz)  
- Automatizalt teszt kod irasa vitest segitsegevel a feltolteshez (Ha lehet ilyet, ha nem, akkor is oldd meg Kika valahogy a tesztelest, koszi puszi) [Kristof] (nincs kesz)  

---

## 5. Listazas oldal elkeszitese (0 / 6)

- Teljes HTML struktrura felallitasa a tasks.html-hez [Kristof] (nincs kesz)  
- Az aktualis user taskjaihoz tartozo lekeres funkcio implementalasa a korabbi class es interface alapjan [Kristof] (nincs kesz)  
- Taskok megjelenitese annak minden adataval egyutt kreativ modon [Kristof] (nincs kesz)  
- Rendezes funckio megvalositasa a leirtak szerint [Kristof] (nincs kesz)  
- Teljes css megirasa a base css segitsegevel [Kristof] (nincs kesz)  
- Oldal ellenorzese es manualis tesztelese kulonbozo kepernyokon sok kulonbozo task-al, majd a kepernyo fotok kimentese es docx fajlba [Kristof] (nincs kesz)  

---

## 6. Taskok frissetese (0 / 6)

- Modusuljanak a taskStatus-ok a server oldalon, ha a deadline utan vagyunk mar, az ellenorzes csak bizonyos idonkent legyen. A kliensoldalon minden alkalommal ellenorizze a program, amikor a felhasznalo betolti az oldalt [Marci] (nincs kesz)  
- Az elozo pont manualis tesztekese [Marci] (nincs kesz)  
- "Feladat kesz"/valami hasonlo gomb keszitese minden feladathoz, modosuljon a taskStatus es a taskCompletedAt a kliensoldalon keresztul, ha a felhasznalo az adott taskot kesznek jeloli [Marci] (nincs kesz)  
- "Feladat megsincs kesz"/valami hasonlo gomb keszitese minden kesz feladathoz, modosuljon a taskStatus es a taskCompletedAt a kliensoldalon keresztul, ha a felhasznalo az adott taskot nem elkeszultnek jeloli [Marci] (nincs kesz)  
- "Feladat modositasa"/valami hasonlo gomb keszitese minden feladathoz, a gomb lenyomasara a create oldalhoz hasonlo modal ugorjon fel, ahol a felhasznalo az adott task minden valtozojat modosithatja. Ne irja at a taskCreatedAt, de a taskUpdatedAt valtozot igen. A validacio maradjon meg, csak ugy, mint a task letrahozasanal [Marci] (nincs kesz)  
- Feladat kesz / Feladat megsincs kesz / Feladat modositasahoz teszt irasa, responsok lekerese [Levente] (nincs kesz)  

---

## 7. Profil oldal elkeszitese (0 / 4)

- Teljes HTML struktrura felallitasa a profile.html-hez [Kristof] (nincs kesz)  
- Korabbi interface es class segitsegevel megjeleniteni a felhasznalo adatait [Kristof] (nincs kesz)  
- "Nev modositasa"/valami hasonlo gomb elkeszitese, a gomb legyen mukodokepes, a gomb lenyomasara egy modal ugorjon fel, ahol meglehet adni az uj nevet a kliensoldalrol frissitse az adatbazisban a felhasznalo nevet [Kristof] (nincs kesz)  
- "Jelszo modositasa"/valami hasonlo gomb elkeszitese, a gomb tenylegesen kuldje ki az emailt, a korabbi authentication resznel hasznalt function ujra fel lehet itt is hasznalni, nem kell ujat irni [Kristof] (nincs kesz)  

---

## 8. Vegso simitasok - Nem kotelezo jelleggel, csak ha mar tenyleg minden kesz es meg akarnam folytatni (0 / 8)

- Nehany metatag hozzaadasa a landing pagehez [Levente] (nincs kesz)  
- Nehany pelda doski keszitese a jogi nyilatkozathoz [Levente] (nincs kesz)  
- Deploy [Levente] (nincs kesz)  
- Deploy utan manualis teszt nehany profilrol [Levente] (nincs kesz)  
- Domain berlese [Levente] (nincs kesz)  
- DNS konfiguralasa [Levente] (nincs kesz)  
- Megkerni a Google bacsit, hogy indexelje az oldalt [Levente] (nincs kesz)  
- GA suti hozzaadasa [Levente] (nincs kesz)  

---
Repo klonozasa: git clone https://github.com/etnevelpriv/Keep-Up-With-Yourself.git
Dependencyk letoltese: npm i
Frontend inditasa: npm run dev
Frontend buildelese: npm run build
