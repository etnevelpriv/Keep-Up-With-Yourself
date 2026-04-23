import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(`A felhasznalo bevan jelentkezve. Email: ${user.email}, Nev: ${user.displayName}, UID: ${user.uid} Verfied: ${user.emailVerified}`);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("A felhasznalo letezik az adatbazisban is:", docSnap.data());
            if (user.emailVerified) {
                console.log("A felhasznalo mar hitelesitette az email cimet");
                if (!(docSnap.data().userVerified)) {
                    await updateDoc(doc(db, "users", user.uid), {
                        userVerified: true
                    });
                    console.log("A felhasznalo adatbazisban szereplo dokumentumaban is verified mostmar")
                };
            } else {
                console.log("A felhasznalo meg nem hitelesitette az email cimet", docSnap.data().userVerified);
            };
        } else {
            console.log("A felhasznalo letezik, de az adatbazisban nincs hozza dokumentum.");
        };


    } else {
        console.log("Nincs bejelentkezett felhasznalo")
    };
});
