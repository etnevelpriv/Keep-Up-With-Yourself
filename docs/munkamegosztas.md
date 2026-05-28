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
- Regisztracio kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristof] (kesz)  
- Bejelentkezes kezi tesztelese es minden teszt eset dokumentalasa word fajlban [Kristof] (kesz)  
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
- Manual test docs. [Kristof] (kesz)
- Firestore rules test. [Levente] (kesz)
- CRUD unit/integration tesztek. [Levente] (kesz)
- Email templatek. [Marcell] (kesz)
- Password visibility toggle font awesome ikonnal. [Levente] (kesz)
- Jelszavak több karaktert is tartalmassanak [Levente] (kesz)
- User class unit tesztelese [Levente] (kesz)
- Auth unit teszt [Levente] (kesz)