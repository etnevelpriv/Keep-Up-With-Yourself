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

## 5. Listazas oldal elkeszitese (5 / 5)

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

## 9. MVP deploy utáni teendők (15 / 15)

- Service layer létrehozása [Levente] (kesz)
- Popup utils letrehozasa [Levente] (kesz)
- users/{uid}/tasks/{taskId} subcollection. [Levente] (kesz)
- Firestore rules mezőszintű validációval. [Levente] (kesz)
- Task létrehozás/módosítás/törlés külön service layerben. [Levente] (kesz)
- Task torles legyen lehetseges a tasks oldalon a modositas modalban [Levente] (kesz)
- Fióktörlés megerősítéssel (felugró modal). [Levente] (kesz)
- Manual test docs. [Kristóf] (kesz)
- Firestore rules test. [Levente] (kesz)
- CRUD unit/integration tesztek. [Levente] (kesz)
- Email templatek.[Marcell] (kesz)
- Password visibility toggle font awesome ikonnal. [Levente] (kesz)
- Jelszavak több karaktert is tartalmassanak [Levente] (kesz)
- User class unit tesztelese [Levente] (kesz)
- Auth unit teszt [Levente] (kesz)

---

## 10. Teljes security rules audit, testing, automation, security engineering (11 / 79)

- Ownership validation ellenorzese [Levente] (kesz)
- Email verification enforce a `users/{uid}/tasks/*` rules-ban (`request.auth.token.email_verified == true`) [Levente] (nincs kesz)
- Verified gate egységesítése frontenden (auth.guard + auth.listener) + egyértelmű UX (hibaüzenet, redirect, resend link) [Levente] (nincs kesz)
- Provider-ütközés/linking flow implementálása (`fetchSignInMethodsForEmail`) a README auth szabályok szerint [Levente] (nincs kesz)
- Fióktörlés backend hardening: Cloud Function alapú “teljes törlés” (user doc + tasks subcollection), reauth hibák kezelése [Levente] (nincs kesz)
- Firebase Hosting security headers + CSP beállítása (`firebase.json`) [Levente] (nincs kesz)
- App Check bevezetése (és mérlegelés, hol kell enforce-olni) [Levente] (nincs kesz)
- PII-safe logging irányelvek: UID/email ne kerüljön logba prod módban (debug flag + redaction) [Levente] (nincs kesz)
- `taskTypes` lista bloat elleni védelem rules-ban (elemszám limit + elem típus/hossz + duplikációk) [Levente] (nincs kesz)
- Task timestamp policy rules-ban (`<= request.time`, completedAt konzisztencia) + ehhez tesztek [Levente] (nincs kesz)
- Emulator-alapú teszt futtatás standardizálása (parancsok, CI integráció, dokumentáció) [Levente] (nincs kesz)
- Input/schema validation tesztek (malformed payload, oversized payload, schema enforcement, field restriction, malicious payload) [Levente] (nincs kesz)
- Timestamp validation tesztek veglegesitese [Levente] (nincs kesz)
- Auth validtator tesztek veglegesitese [Levente] (nincs kesz)
- Brute-force mitigation (rate limiting, cooldown mechanizmus, captcha, password reset abuse preventation) [Levente] (nincs kesz)
- Enumeration preventation veglegesitese [Levente] (nincs kesz)
- Secure error uzenetek veglegesitese [Levente] (nincs kesz)
- Shared validatorok [Levente] (nincs kesz)
- Frontend/backend validation konzisztens legyen [Levente] (nincs kesz)
- User input sanitization veglegesitese es javitasa [Levente] (nincs kesz)
- Edge casek kezelese [Levente] (nincs kesz)
- Error handling globalissa tetelenek javitasa es veglegesitese [Levente] (nincs kesz)
- Empty states [Levente] (nincs kesz)
- Loading states [Levente] (nincs kesz)
- Retry logic [Levente] (nincs kesz)
- Fallback UI [Levente] (nincs kesz)
- Firebase network error mapping [Levente] (nincs kesz)
- Strict schema typing [Levente] (nincs kesz)
- Any tipusok eltavolitasa minden ts fajlbol, helyette shared interfaces es reusable types [Levente] (nincs kesz)
- Nullable kezeles [Levente] (nincs kesz)
- Safer async typing veglegesitese [Levente] (nincs kesz)
- Auth tesztelese [Levente] (kesz)
- Utils tesztek veglegesitese [Levente] (kesz)
- Task logic veglegesitese [Levente] (nincs kesz)
- Formating functions utils-e alakitasa [Levente] (nincs kesz)
- Firestore rules authorized access tesztek veglegesitese [Levente] (nincs kesz)
- Firestore rules unauthorized access tesztek veglegesitese [Levente] (nincs kesz)
- Firestore rules invallid writes tesztek veglegesitese [Levente] (nincs kesz)
- Firestore rules malilcious payload tesztek [Levente] (nincs kesz)
- Task service tesztek megirasa [Levente] (kesz)
- User service tesztek megirasa [Levente] (kesz)
- Auth service tesztek megirasa [Levente] (kesz)
- Auth integration tesztek megirasa [Levente] (nincs kesz)
- Task integration tesztek megirasa [Levente] (kesz)
- User integration tesztek megirasa [Levente] (kesz)
- User validation tesztek megirasa [Levente] (kesz)
- Task validation tesztek megirasa [Levente] (kesz)
- Sanitization tesztek megirasa [Levente] (kesz)
- UI utility tesztek megirasa [Levente] (kesz)
- E2E register tesztek [Levente] (nincs kesz)
- E2E login tesztek [Levente] (nincs kesz)
- E2E logout tesztek [Levente] (nincs kesz)
- E2E createTask tesztek [Levente] (nincs kesz)
- E2E editTask tesztek [Levente] (nincs kesz)
- E2E completeTask tesztek [Levente] (nincs kesz)
- E2E deleteTask tesztek [Levente] (nincs kesz)
- CI/CD pipeline gihub actions [Levente] (nincs kesz)
- npm audit [Levente] (nincs kesz)
- package cleanup [Levente] (nincs kesz)
- dependency update strategy [Levente] (nincs kesz)
- known vulnerability review [Levente] (nincs kesz)
- SECURITY.md megirasa magyarul (threat model, assumptions, known limitations, reporting vulnerabilities, security architecture, abuse prevention) [Levente] (nincs kesz)
- SECURITY.md atforditas angolra [Levente] (nincs kesz)
- attack surface diagram [Levente] (nincs kesz)
- trust boundary diagram [Levente] (nincs kesz)
- auth flow diagram [Levente] (nincs kesz)
- data flow diagram [Levente] (nincs kesz)
- whitebox teszteles report auth byppass [Levente] (nincs kesz)
- whitebox teszteles report access control [Levente] (nincs kesz)
- whitebox teszteles enumeration [Levente] (nincs kesz)
- whitebox teszteles validation bypass [Levente] (nincs kesz)
- whitebox teszteles injection possibilites [Levente] (nincs kesz)
- whitebox teszteles abuse vectors [Levente] (nincs kesz)
- whitebox teszteles race conditions [Levente] (nincs kesz)
- auth eventek logolasa [Levente] (nincs kesz)
- suspicious actions logolasa [Levente] (nincs kesz)
- task modifications logolasa [Levente] (nincs kesz)
- critical states logolasa [Levente] (nincs kesz)
- Firebase analytics felallitasa [Levente] (nincs kesz)

## 11. Polish (0 / 20)

- Slugok [Levente] (nincs kesz)
- Responsive audit minden egyes oldalrol, docx dokumentacioval es kepernyokepekkel [Levente] (nincs kesz)   
- Keyboard navigation [Levente] (nincs kesz)   
- Aria labels [Levente] (nincs kesz)   
- Focus states [Levente] (nincs kesz)   
- Contrast validation [Levente] (nincs kesz)   
- semantic HTML [Levente] (nincs kesz)   
- Meta tags minden oldalhoz [Levente] (nincs kesz)   
- Opengraph [Levente] (nincs kesz)   
- sitemap [Levente] (nincs kesz)   
- robots.txt [Levente] (nincs kesz)   
- favicon [Levente] (nincs kesz)   
- Adatvedelmi nyilatkozat [Levente] (nincs kesz)   
- Suti consent es tajekoztato [Levente] (nincs kesz)   
- Impresszum [Levente] (nincs kesz)   
- Google indexeles [Levente] (nincs kesz)
- README.md teljes atirasa magyarul (project overview, architecure, screenshots, security approach, setup guide, deployment, testing, roadmap, lessons learned) [Levente] (nincs kesz)
- README.md leforditasa angolra [Levente] (nincs kesz)
- ARCHITECTURE.md teljes megirasa (Frontend structure, firebase integration, auth architecture, firestore model, validation flow) [Levente] (nincs kesz)
- Projekt prezentációja (projekt bemutatása fejlesztői/üzleti/user szempontbol, abrak, diagrammok, swot analizis, projekt roadmap, flowchart) [Levente] (nincs kesz)

## 12. Extra featureok (0 / 4)

- Admin rendszer kiepitese (admin collection, firestore rules, oldal elkeszitese, osszes user crud lehetosege) [Levente] (nincs kesz) 
- Privilage esscalation tesztek [Levente] (nincs kesz)
- Streak system kiepitese (daily streak, streak freeze, consistency traking) [Levente] (nincs kesz)   
- Stats dashboard es analytics (task completion rate, productivity trends, weekly activity, streak stats) [Levente] (nincs kesz)   
- Basic gamification (XP, badges, milestones) [Levente] (nincs kesz)   

## 13. Vegso optimalizalas (0 / 2)

- Tachnikcal writeup (securing firebase rules, threat modeling, whitebox testing, auth hardening) [Levente] (nincs kesz) 
- Github cleanup(commit cleanup, issue tracking, milestones, project board, tags/releases) [Levente] (nincs kesz)   

---
Repo klonozasa: git clone https://github.com/etnevelpriv/Keep-Up-With-Yourself.git
Dependencyk letoltese: npm i
Frontend inditasa: npm run dev
Frontend buildelese: npm run build
Tesztek futtatasa: npm test

Firestore rules / integration tesztekhez emulator szukseges:
- Opcio A (2 terminal): `firebase emulators:start --only firestore` majd `npm test`
- Opcio B (1 parancs, javasolt kesobb): `firebase emulators:exec --only firestore "npm test"`
