
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserDocumentFromDatabase, syncUserVerificationStatus } from "../user/user.service.ts"
import { redirecAuthenticatedtUser, redirecUnauthenticatedtUser } from "./auth.guard.ts";
import { db } from "../../scripts/firebase.ts";
const auth = getAuth();

export const initializeAuthListener = function () {

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            redirecUnauthenticatedtUser();
            return;
        };
        await user.reload();
        if (!user.emailVerified) {
            redirecUnauthenticatedtUser();
            return;
        }
        const userDocument = await getUserDocumentFromDatabase(db, user.uid);
        if (!userDocument) {
            return;
        };
        if (!userDocument.userVerified) {
            await syncUserVerificationStatus(db, user.uid);
        };
        redirecAuthenticatedtUser();
        // if (user) {
        //     const userDocument = await getUserDocumentFromDatabase(db, user.uid);
        //     if (userDocument) {
        //         if (!user.emailVerified) {
        //             return;
        //         };

        //         if (!(userDocument.userVerified)) {
        //             await syncUserVerificationStatus(db, user.uid);
        //         };
        //         redirecAuthenticatedtUser();
        //     } else {
        //     };
        // } else {
        //     redirecUnauthenticatedtUser();
        // };
    });
};