import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, createUserWithEmailAndPassword, signOut, onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider } from "firebase/auth";
import { createUserDocumentInDatabase, getUserDocumentFromDatabase } from "../user/user.service.ts"
import type { Firestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { AppError } from "../../models/AppError.ts";
import type { User } from "firebase/auth";
const auth = getAuth();

export const registerWithEmail = async function (db: Firestore, name: string, email: string, password: string, createdAt: Date, verified: boolean) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await user.reload();
    await user.getIdToken(true);
    await createUserDocumentInDatabase(db, user.uid, email, name, createdAt, verified);
    await sendEmailVerificationToUser(user);
};
export const loginWithEmail = async function (email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
};
export const loginWithGoogle = async function (db: Firestore) {
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
export const getAuthUserWhenReady = function ():Promise<User> {
    return new Promise<User>((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            if (!user) {
                reject(new AppError("appAuth/no-current-auth-user"));
                return;
            };
            resolve(user);
        });
    });
};
export const signOutUser = async function () {
    await signOut(auth);
};
export const sendPasswordReset = async function (email: string) {
    await sendPasswordResetEmail(auth, email);
};
export const sendEmailVerificationToUser = async function (user: User) {
    const actionCodeSettings = {
        url: 'https://keepupwithyourself.hu/pages/create.html',
        handleCodeInApp: true,
    };
    await sendEmailVerification(user, actionCodeSettings);
};
export const deleteCurrentUserAccount = async function (password?: string) {
    await reauthenticateCurrentUser(password);
    const functions = getFunctions();
    const deleteCurrentUserCompletely = httpsCallable(
        functions,
        "deleteCurrentUserCompletely"
    );
    await deleteCurrentUserCompletely();
};
export const getAuthUser = function ():User {
    const currentUser = auth.currentUser;
    if (currentUser) {
        return currentUser;
    };
    throw new AppError("appAuth/no-current-auth-user")
};
// Muszaj vagyok hibatkezelni a serviceben, nem tudok mashogy rendesen hibakat dobni jelenleg sajnos
export const reauthenticateCurrentUser = async function (password?: string) {
    const providerId = await getProvider();
    const currentUser = getAuthUser();
    if (providerId === "password") {
        if (!password) {
            throw new AppError("appAuth/password-required");
        }
        if (!currentUser.email) {
            throw new AppError("appAuth/no-email")
        };
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
        return;
    }
    if (providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(currentUser, provider);
        return;
    };
    throw new AppError("appAuth/unsupported-provider");
};
export const getProvider = async function ():Promise<string | null> {
    const currentUser = getAuthUser();
    return (await currentUser.getIdTokenResult(true)).signInProvider;
};
export const syncOwnVerificationStatus = async function () {
    const functions = getFunctions();
    const syncOwnVerificationStatus = httpsCallable(
        functions,
        "syncOwnVerificationStatus"
    );
    await syncOwnVerificationStatus();
};