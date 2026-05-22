import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, createUserWithEmailAndPassword, signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
import { User } from "../../models/User.ts";
import { showInfoPopUp, showErrorPopUp } from "../../utils/popup.ts"
import { createUserDocumentInDatabase, deleteUserDocumentFromDatabase, getUserDocumentFromDatabase } from "../user/user.service.ts"
import { validateLoginInput, validateRegisterInput } from "./auth.validator.ts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../scripts/firebase.ts";

const auth = getAuth();

export const registerWithEmail = function (name: string, email: string, password: string, createdAt: Date, verified: boolean) {
    validateRegisterInput(name, email, password, createdAt, verified);
    createUserWithEmailAndPassword(auth, email, password!)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log(user);
            await createUserDocumentInDatabase(userCredential.user.uid, email, name, createdAt, verified);
            sendEmailVerificationToUser(user);
        })
        .catch((error: any) => {
            const errorCodes: Record<string, string> = {
                "auth/email-already-in-use": "Ezzel az e-mail címmel már létezik felhasználói fiók.",
            };
            if (errorCodes[error.code]) {
                showErrorPopUp(errorCodes[error.code])
            } else {
                showErrorPopUp('Ismeretlen hiba történt.')
            }
            throw new Error(`Hiba uzenet: ${error.message}, Hiba kod: ${error.code}`);
        });

};
export const loginWithEmail = function (email: string, password: string) {
    validateLoginInput(email, password)
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`Sikeres bejelentkezes, ${user}`)
            showInfoPopUp("Sikeres bejelentkezés, töltsd újra az oldalt a fiókod megtekintéséhez.");
        })
        .catch((error) => {
            const errorCodes: Record<string, string> = {
                "auth/invalid-credential": "Helytelen felhasználói adatok.",
                "auth/missing-password": "Nem adtál meg jelszót.",
                "auth/invalid-email": "Hibás e-mail cím."
            };
            if (errorCodes[error.code]) {
                showErrorPopUp(errorCodes[error.code]);
            } else {
                showErrorPopUp('Ismeretlen hiba történt.');
            }
            throw new Error(`Hiba uzenet: ${error.code}, Hiba kod: ${error.errorMessage}`);
        });
};
export const loginWithGoogle = function () {
    console.log("Google gombra kattintva")
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    auth.useDeviceLanguage();
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
                await createUserDocumentInDatabase(user.uid, userObj.email, userObj.name, userObj.createdAt, userObj.verified)
            };
            showInfoPopUp("Sikeres bejelentkezés, töltsd újra az oldalt a fiókod megtekintéséhez.")
        }).catch((error) => {
            throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}, Email: ${error.costumData.email}, Hitelesito adat: ${GoogleAuthProvider.credentialFromError(error)}`);
        });
};
export const getCurrentUser = function () {
    // try {
    //     const currentUser = auth.currentUser;
    //     if (currentUser) {
    //         return currentUser;
    //     };
    // } catch (err: any) {
    //     throw new Error(err);
    // };
        return new Promise((resolve, reject) => {
            try {
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const docRef = doc(db, "users", user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            if (user.emailVerified) {
                                resolve(docSnap.data());
                            };
                        };
                    };
                });
            } catch (err: any) {
                reject(err);
                throw new Error(err);
            }
        })
};
export const signOutUser = function () {
    signOut(auth).then(() => {
        showInfoPopUp("Sikeresen kijelentkeztél.")
        console.log("Sikeresen kijelentkezett a felhasznalo.")
    }).catch((error: any) => {
        showErrorPopUp("A kijelentkezés sikertelen.")
        console.error(`Hiba uzenet: ${error.code}, Hiba kod: ${error.errorMessage}`);
    });

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
            if (errorCodes[error.code]) {
                showErrorPopUp(errorCodes[error.code])
            } else {
                showErrorPopUp("Ismeretlen hiba történt.")
            }
            throw new Error(`Hiba uzenet: ${error.code}, Hiba kod: ${error.errorMessage}`);
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
export const deleteCurrentUserAccount = async function () {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            showInfoPopUp("A fiók törléséhez előbb jelentkezz be újra.");
            return;
        };
        await deleteUserDocumentFromDatabase(currentUser.uid)
        await deleteUser(currentUser)
        showInfoPopUp("A fiókodat sikeresen töröltük.");
    } catch (err) {
        showErrorPopUp("Biztonsági okokból jelentkezz be újra, majd próbáld meg ismét.");
        console.error(err);
    }
};