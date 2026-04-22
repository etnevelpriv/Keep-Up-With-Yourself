import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`A felhasznalo bevan jelentkezve. Email: ${user.email}, Nev: ${user.displayName}, UID: ${user.uid} Verfied: ${user.emailVerified}`)
  } else {
    console.log("Nincs bejelentkezett felhasznalo")
  };
});
