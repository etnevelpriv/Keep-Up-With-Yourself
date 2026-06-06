import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, createUserWithEmailAndPassword, signOut, onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider } from "firebase/auth";
import { createUserDocumentInDatabase, getUserDocumentFromDatabase } from "../user/user.service.ts"
import { doc, getDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { AppError } from "../../models/AppError.ts";
const auth = getAuth();

export const registerWithEmail = async function (db: Firestore, name: string, email: string, password: string, createdAt: Date, verified: boolean) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUserDocumentInDatabase(db, user.uid, email, name, createdAt, verified);
    await sendEmailVerificationToUser(user);
};
export const loginWithEmail = async function (email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
};
export const loginWithGoogle = async function (db: Firestore) {
    console.log("Google gombra kattintva")
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    auth.useDeviceLanguage();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const name = user.displayName;
    const email = user.email;
    const userDocument = await getUserDocumentFromDatabase(db, user.uid)
    if (!userDocument) {
        await createUserDocumentInDatabase(db, user.uid, email!, name!, new Date(), true)
    };
};
export const getCurrentUser = async function (db: Firestore) {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.emailVerified) {
        return null;
    }
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return docSnap.data();
};
export const waitForAuthUser = async function () {
    return await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};
export const getCurrentUserWhenReady = async function (db: Firestore) {
    const authUser = await waitForAuthUser();
    if (!authUser) {
        return null;
    }
    return await getCurrentUser(db);
};
export const signOutUser = async function () {
    await signOut(auth);
};
export const sendPasswordReset = async function (email: string) {
    await sendPasswordResetEmail(auth, email);
};
export const sendEmailVerificationToUser = async function (user: any) {
    const actionCodeSettings = {
        url: 'https://keepupwithyourself.hu/pages/create.html',
        handleCodeInApp: true,
    };
    await sendEmailVerification(user, actionCodeSettings);
};
export const deleteCurrentUserAccount = async function (password: string) {
    await reauthenticateCurrentUser(password);
    const functions = getFunctions();
    const deleteCurrentUserCompletely = httpsCallable(
        functions,
        "deleteCurrentUserCompletely"
    );
    await deleteCurrentUserCompletely();
};
export const getAuthUser = function () {
    return auth.currentUser;
};
// Muszaj vagyok hibatkezelni a serviceben, nem tudok mashogy rendesen hibakat dobni jelenleg sajnos
export const reauthenticateCurrentUser = async function (password?: string) {
    const user = auth.currentUser;
    if (!user || !user.email) {
        throw new AppError("auth/not-authenticated");
    }
    const providerId = user.providerData[0]?.providerId;
    if (providerId === "password") {
        if (!password) {
            throw new AppError("auth/password-required");
        }
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        return;
    }
    if (providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
        return;
    };
    throw new AppError("auth/unsupported-provider");
};
export const getProvider = async function () {
    const user = auth.currentUser;
    if (user) {
        const idTokenResult = await user.getIdTokenResult(true);
        return idTokenResult.signInProvider
    };
}