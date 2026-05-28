import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, createUserWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";
import { User } from "../../models/User.ts";
import { createUserDocumentInDatabase, deleteUserDocumentFromDatabase, getUserDocumentFromDatabase } from "../user/user.service.ts"
import { validateLoginInput, validateRegisterInput } from "./auth.validator.ts";
import { doc, getDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const auth = getAuth();

export const registerWithEmail = async function (db: Firestore, name: string, email: string, password: string) {
    const userObj = new User(name, password, email, new Date(), false);
    validateRegisterInput(userObj.name, userObj.email, password, userObj.createdAt, userObj.verified);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUserDocumentInDatabase(db, user.uid, userObj.email, userObj.name, userObj.createdAt, userObj.verified);
    await sendEmailVerificationToUser(user);
};
export const loginWithEmail = async function (email: string, password: string) {
    validateLoginInput(email, password)
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
        const userObj = new User(name ?? "", undefined, email ?? "", new Date(), true);
        await createUserDocumentInDatabase(db, user.uid, userObj.email, userObj.name, userObj.createdAt, userObj.verified)
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
export const deleteCurrentUserAccount = async function (db: Firestore) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return;
    };
    await deleteUserDocumentFromDatabase(db, currentUser.uid);
    await deleteUser(currentUser)
};