
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { getUserDocumentFromDatabase } from "../user/user.service.ts"
import { redirecAuthenticatedtUser, redirecUnauthenticatedtUser } from "./auth.guard.ts";
import { syncOwnVerificationStatus } from "./auth.service.ts";
const auth = getAuth();

export const initializeAuthListener = function (db: Firestore, onError: (error: unknown) => void) {
    onAuthStateChanged(auth, async (user) => {
        try {
            if (!user) {
                redirecUnauthenticatedtUser();
                return;
            };
            await user.reload();
            await user.getIdToken(true);
            if (!user.emailVerified) {
                redirecUnauthenticatedtUser();
                return;
            }
            const userDocument = await getUserDocumentFromDatabase(db, user.uid);
            if (!userDocument) {
                redirecUnauthenticatedtUser();
                return;
            };
            if (!userDocument.userVerified) {
                await syncOwnVerificationStatus();
            };
            redirecAuthenticatedtUser();
        } catch (error) {
            onError(error)
        }
    });
};