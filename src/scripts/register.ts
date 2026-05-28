import "../styles/auth.css";
import { User } from "../models/User.ts";
import { registerWithEmail, loginWithGoogle } from "../services/auth/auth.service.ts";
import { setupPasswordVisibilityToggle } from "../utils/passwordVisibilityToggle.ts";
import { db } from "./firebase.ts";
import { handleUiError } from "../utils/errors/handleUiError.ts";
import { showInfoPopUp } from "../utils/popup.ts";

const init = function () {
    const form: HTMLElement = document.getElementById("registerForm") as HTMLElement;
    form.addEventListener("submit", sendRegisterForm);
    setupPasswordVisibilityToggle();
    document.getElementById("googleButton")?.addEventListener("click", async () => {
        try {
            await loginWithGoogle(db);
            showInfoPopUp("Sikeres Google bejelentkezés. Töltsd újra az oldalt a fiókod megtekintéséhez");
        } catch (error) {
            handleUiError(error);
        };
    });
};

const sendRegisterForm = async function (e: Event) {
    e.preventDefault();
    const name = document.getElementById("nameInput") as HTMLInputElement;
    const email = document.getElementById("emailInput") as HTMLInputElement;
    const password = document.getElementById("passwordInput") as HTMLInputElement;
    const form = document.getElementById("registerForm") as HTMLFormElement
    try {
        const userObj = new User(name.value, password.value, email.value, new Date(), false);
        await registerWithEmail(db, userObj.name, userObj.email, password.value, userObj.createdAt, userObj.verified);
        showInfoPopUp("Sikeres regisztráció, elküldünk egy visszaigazoló emailt.")
        form.reset()
    } catch (error) {
        handleUiError(error)
    };
};

document.addEventListener("DOMContentLoaded", init);