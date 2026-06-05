
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserDocumentFromDatabase, syncUserVerificationStatus } from "../user/user.service.ts"
import { redirecAuthenticatedtUser, redirecUnauthenticatedtUser } from "./auth.guard.ts";
import { db } from "../../scripts/firebase.ts";
const auth = getAuth();

export const initializeAuthListener = function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log(`A felhasznalo bevan jelentkezve: Email: ${user.email}, Nev: ${user.displayName}, UID: ${user.uid} Verfied: ${user.emailVerified}`);
            const userDocument = await getUserDocumentFromDatabase(db, user.uid);
            if (userDocument) {
                if (!user.emailVerified) {
                    console.log("A felhasznalo meg nem hitelesitette az email cimet", userDocument.userVerified);
                    return;
                };

                if (!(userDocument.userVerified)) {
                    await syncUserVerificationStatus(db, user.uid);
                };
                redirecAuthenticatedtUser();
            } else {
                console.error("A felhasznalo letezik, de az adatbazisban nincs hozza dokumentum")
            };
        } else {
            console.log("Nincs bejelentkezett felhasznalo.");
            redirecUnauthenticatedtUser();
        };
    });
};