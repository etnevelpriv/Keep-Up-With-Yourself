import "../styles/auth.css";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
// import { User } from "../models/User.ts";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "./firebase";
import { loginWithGoogle } from "../services/auth/auth.service";

const init = function () {
    console.log("Betoltodott a register.ts")
    const form: HTMLElement = document.getElementById("loginForm") as HTMLElement;
    form.addEventListener("submit", sendLoginForm);

    document.getElementById("googleButton")?.addEventListener("click", () => {
        // console.log("Google gombra kattintva")
        // const provider = new GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        // provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        // const auth = getAuth();
        // auth.useDeviceLanguage;

        // signInWithPopup(auth, provider)
        //     .then(async (result) => {
        //         const credential = GoogleAuthProvider.credentialFromResult(result);
        //         const user = result.user;
        //         console.log(credential, result);
        //         const name = user.displayName;
        //         const email = user.email;

        //         const docRef = doc(db, "users", user.uid);
        //         const docSnap = await getDoc(docRef);
        //         if (!(docSnap.exists())) {
        //             const userObj = new User(name ?? "", undefined, email ?? "", new Date(), true);
        //             userObj.saveUserInfoToDb(user.uid, undefined);
        //         };
        //         const infoMessageDiv = document.getElementById("infoMessage");
        //         if (infoMessageDiv) {
        //             infoMessageDiv.textContent = "Sikeres bejelentkezés, töltsd újra az oldalt a fiókod megtekintéséhez.";
        //         };
        //     }).catch((error) => {
        //         throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}, Email: ${error.costumData.email}, Hitelesito adat: ${GoogleAuthProvider.credentialFromError(error)}`);
        //     });
        loginWithGoogle();
    });

    document.getElementById("forgotPassButton")?.addEventListener("click", () => {
        const modal = document.getElementById("forgotPassModal");
        modal?.classList.toggle("hide");

    });

    document.getElementById("forgotPassSendButton")?.addEventListener("click", () => {
        const emailInput = document.getElementById("forgotPassEmailInput") as HTMLInputElement | null;
        const email = emailInput?.value ?? "";
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                const infoMessageDiv = document.getElementById("infoMessage");
                if (infoMessageDiv) {
                    infoMessageDiv.textContent = "Ha az email létezik a regisztrált felhasználók között, akkor az emailt kiküldtük.";
                };
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

const sendLoginForm = function (e: Event) {
    e.preventDefault();
    console.log("Bejelentkezes gombra kattintva")
    const email = document.getElementById("emailInput") as HTMLFormElement;
    const password = document.getElementById("passwordInput") as HTMLFormElement;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`Sikeres bejelentkezes, ${user}`)
            const infoMessageDiv = document.getElementById("infoMessage");
            if (infoMessageDiv) {
                infoMessageDiv.textContent = "Sikeres bejelentkezés, töltsd újra az oldalt a fiókod megtekintéséhez.";
            };
        })
        .catch((error) => {
            const errorCodes: Record<string, string> = {
                "auth/invalid-credential": "Helytelen felhasználói adatok.",
                "auth/missing-password": "Nem adtál meg jelszót.",
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
};

document.addEventListener("DOMContentLoaded", init);