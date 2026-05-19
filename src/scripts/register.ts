import "../styles/auth.css";
import { User } from "./classes/User";
import { getAuth, getRedirectResult, signInWithPopup, signInWithRedirect } from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { createGoogleProvider, getGoogleAuthErrorMessage, shouldUseRedirectForGoogleAuth } from "./googleAuth";

const init = function () {
    console.log("Betoltodott a register.ts")
    const form: HTMLElement = document.getElementById("registerForm") as HTMLElement;
    form.addEventListener("submit", sendRegisterForm);
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
            await handleGoogleRegisterResult(result);
        } catch (error) {
            showGoogleAuthError(error);
            console.error("Google regisztracios hiba:", error);
        };
    });
};

const handleGoogleRedirectResult = async function () {
    const auth = getAuth();
    auth.useDeviceLanguage();

    try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        await handleGoogleRegisterResult(result);
    } catch (error) {
        showGoogleAuthError(error);
        console.error("Google atiranyitasos regisztracios hiba:", error);
    };
};

const handleGoogleRegisterResult = async function (result: UserCredential) {
    const user = result.user;
    console.log(result);
    const name = user.displayName ?? "";
    const email = user.email ?? "";
    const userObj = new User(name, undefined, email, new Date(), true);
    await userObj.saveUserInfoToDb(user.uid, undefined);
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

const sendRegisterForm = function (e: Event) {
    e.preventDefault();
    console.log("Regisztralas gombra kattintva")
    const name = document.getElementById("nameInput") as HTMLFormElement;
    const email = document.getElementById("emailInput") as HTMLFormElement;
    const password = document.getElementById("passwordInput") as HTMLFormElement;

    const userObj = new User(name.value, password.value, email.value, new Date(), false);
    console.log(userObj);

    const form = document.getElementById("registerForm") as HTMLFormElement
    form.reset()

    userObj.createUserWithEmailProvider();
};

document.addEventListener("DOMContentLoaded", init);
