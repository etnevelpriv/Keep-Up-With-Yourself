import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import { User } from "../../models/User.ts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../scripts/firebase";
import { showInfoPopUp, showErrorPopUp } from "../../utils/popup.ts"
import { createUserDocumentInDatabase, getUserDocumentFromDatabase, syncUserVerificationStatus } from "../user/user.service.ts"

const auth = getAuth();

export const registerWithEmail = function (name: string, email: string, password: string, createdAt: Date, verified: boolean) {
    createUserWithEmailAndPassword(auth, email, password!)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log(user);
            await createUserDocumentInDatabase(userCredential.user.uid, email, name, createdAt, verified);
            await sendEmailVerification(user);
        })
        .catch((error: any) => {
            const errorCodes: Record<string, string> = {
                "auth/email-already-in-use": "Ezzel az e-mail címmel már létezik felhasználói fiók.",
            };
            if (errorCodes[error.code]) {
                showErrorPopUp(errorCodes[error.code])
            } else {
                showErrorPopUp(errorCodes['Ismeretlen hiba történt.'])
            }
            throw new Error(`Hiba uzenet: ${error.message}, Hiba kod: ${error.code}`);
        });

};
export const loginWithEmail = function (email: string, password: string) {

};
export const loginWithGoogle = function () {
    console.log("Google gombra kattintva")
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    auth.useDeviceLanguage;
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            console.log(credential, result);
            const name = user.displayName;
            const email = user.email;
            const userDocument = await getUserDocumentFromDatabase(user.uid)
            if (!userDocument) {
                const userObj = new User(name ?? "", undefined, email ?? "", new Date(), true);
                createUserDocumentInDatabase(user.uid, userObj.email, userObj.name, userObj.createdAt, userObj.verified)
            };
            showInfoPopUp("Sikeres bejelentkezés, töltsd újra az oldalt a fiókod megtekintéséhez.")
        }).catch((error) => {
            throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}, Email: ${error.costumData.email}, Hitelesito adat: ${GoogleAuthProvider.credentialFromError(error)}`);
        });
};
export const getCurrentUser = function () {

};
export const signOutUser = function () {

};
export const sendPasswordReset = function (email: string) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                showInfoPopUp('Ha az email létezik a regisztrált felhasználók között, akkor az emailt kiküldtük.')
                console.log("forgotPassSendButton megnyomva, ha az email letezik a felhasznalok koztt, kikuldjuk az emailt")
            })
            .catch((error) => {
                const errorCodes: Record<string, string> = {
                    "auth/missing-email": "Nem adtál meg e-mail címet.",
                    "auth/missing-password": "Nincs megfelelően megadva a jelszó.",
                    "auth/invalid-email": "Hibás e-mail cím."
                };

                const errorMessageDiv = document.getElementById("errorMessage");
                if (errorMessageDiv) {
                    if (errorCodes[error.code]) {
                        errorMessageDiv.textContent = errorCodes[error.code];
                    } else {
                        errorMessageDiv.textContent = "Ismeretlen hiba történt.";
                    }
                }
                throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}`);
            });
    });

};
export const sendEmailVerificationToUser = function (user: any) {
    console.log("sendVerificationLink metodus elindult")
    const actionCodeSettings = {
        url: 'https://keepupwithyourself.hu/pages/create.html',
        handleCodeInApp: true,
    };
    sendEmailVerification(user, actionCodeSettings)
        .then(() => {
            console.log(`Email verifikacio elkuldve`)
        }).catch((err: any) => {
            const errorMessageDiv = document.getElementById("errorMessage");
            if (errorMessageDiv) {
                errorMessageDiv.textContent = 'Hiba történt a visszaigazoló e-mail küldése során.';
            }
            throw new Error(err);
        });
};
export const deleteCurrentUserAccount = function () {

};