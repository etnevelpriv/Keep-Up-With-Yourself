import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.ts"

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(`A felhasznalo bevan jelentkezve. Email: ${user.email}, Nev: ${user.displayName}, UID: ${user.uid} Verfied: ${user.emailVerified}`);
        const docRef = doc(db, "users", "qgo9GN4mlZ7ptu0F3JHP");
        const docSnap = await getDoc(docRef);

        console.log(user.uid)
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

        if (user.emailVerified) {

        };
    } else {
        console.log("Nincs bejelentkezett felhasznalo")
    };
});
