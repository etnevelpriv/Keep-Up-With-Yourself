
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserDocumentFromDatabase, syncUserVerificationStatus } from "../user/user.service.ts"
import { redirecAuthenticatedtUser, redirecUnauthenticatedtUser } from "./auth.guard.ts";

const auth = getAuth();

export const initializeAuthListener = function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log(`A felhasznalo bevan jelentkezve: Email: ${user.email}, Nev: ${user.displayName}, UID: ${user.uid} Verfied: ${user.emailVerified}`);
            const userDocument = await getUserDocumentFromDatabase(user.uid);
            if (userDocument) {
                if (!(userDocument.emailVerified)) {
                    await syncUserVerificationStatus(user.uid);
                };
                redirecAuthenticatedtUser();
            };

        } else {
            console.log("Nincs bejelentkezett felhasznalo.");
            redirecUnauthenticatedtUser();
        };
    });
};