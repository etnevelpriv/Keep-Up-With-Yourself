import "../styles/auth.css";
import { getAuth, getRedirectResult, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { User } from "./classes/User";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { createGoogleProvider, getGoogleAuthErrorMessage, shouldUseRedirectForGoogleAuth } from "./googleAuth";

const init = function () {
    console.log("Betoltodott a login.ts")
    const form: HTMLElement = document.getElementById("loginForm") as HTMLElement;
    form.addEventListener("submit", sendLoginForm);
    handleGoogleRedirectResult();

    document.getElementById("googleButton")?.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("Google gombra kattintva")
        const provider = createGoogleProvider();
        const auth = getAuth();
        auth.useDeviceLanguage();

        try {
            if (shouldUseRedirectForGoogleAuth()) {
                await signInWithRedirect(auth, provider);
                return;
            };

            const result = await signInWithPopup(auth, provider);
            await handleGoogleLoginResult(result);
        } catch (error) {
            showGoogleAuthError(error);
            console.error("Google bejelentkezesi hiba:", error);
        };
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

const handleGoogleRedirectResult = async function () {
    const auth = getAuth();
    auth.useDeviceLanguage();

    try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        await handleGoogleLoginResult(result);
    } catch (error) {
        showGoogleAuthError(error);
        console.error("Google atiranyitasos bejelentkezesi hiba:", error);
    };
};

const handleGoogleLoginResult = async function (result: UserCredential) {
    const user = result.user;
    console.log(result);
    const name = user.displayName;
    const email = user.email;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!(docSnap.exists())) {
        const userObj = new User(name ?? "", undefined, email ?? "", new Date(), true);
        await userObj.saveUserInfoToDb(user.uid, undefined);
    };
    const infoMessageDiv = document.getElementById("infoMessage");
    if (infoMessageDiv) {
        infoMessageDiv.textContent = "Sikeres bejelentkezés, töltsd újra az oldalt a fiókod megtekintéséhez.";
    };
};

const showGoogleAuthError = function (error: unknown) {
    const errorMessageDiv = document.getElementById("errorMessage");
    if (errorMessageDiv) {
        errorMessageDiv.textContent = getGoogleAuthErrorMessage(error);
    };
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
