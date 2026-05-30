import "../styles/auth.css";
import { loginWithEmail, loginWithGoogle, sendPasswordReset } from "../services/auth/auth.service";
import { setupPasswordVisibilityToggle } from "../utils/passwordVisibilityToggle";
import { db } from "./firebase.ts";
import { showInfoPopUp } from "../utils/popup.ts";
import { handleUiError } from "../utils/errors/handleUiError.ts";

const init = function () {
    const form: HTMLElement = document.getElementById("loginForm") as HTMLElement;
    form.addEventListener("submit", sendLoginForm);
    setupPasswordVisibilityToggle();
    setupForgotPasswordModal();
    document.getElementById("googleButton")?.addEventListener("click", async () => {
        try {
            await loginWithGoogle(db);
            showInfoPopUp("Sikeres Google bejelentkezés. Töltsd újra az oldalt a fiókod megtekintéséhez.");
        } catch (error) {
            handleUiError(error);
        };
    });

    document.getElementById("forgotPassButton")?.addEventListener("click", () => {
        const modal = document.getElementById("forgotPassModal");
        modal?.classList.toggle("hide");
    });

    document.getElementById("forgotPassSendButton")?.addEventListener("click", async () => {
        try {
            const emailInput = document.getElementById("forgotPassEmailInput") as HTMLInputElement | null;
            const email = emailInput?.value ?? "";
            await sendPasswordReset(email);
            showInfoPopUp("Ha a megadott email címmel van regisztrált fiók, akkor kiküldtük a jelszó visszaállító emailt.");
        } catch (error) {
            handleUiError(error);
        };
    });
};

const sendLoginForm = async function (e: Event) {
    e.preventDefault();
    try {
        const email = document.getElementById("emailInput") as HTMLInputElement;
        const password = document.getElementById("passwordInput") as HTMLInputElement;
        await loginWithEmail(email.value, password.value);
        showInfoPopUp("A bejelentkezés sikeres, töltsd újra az oldalt.")
    } catch (error) {
        handleUiError(error);
    };
};
const setupForgotPasswordModal = function () {
    const modal = document.getElementById("forgotPassModal");
    if (!modal) return;

    if (!modal.querySelector(".modal-close-button")) {
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "modal-close-button";
        closeButton.textContent = "x";
        closeButton.setAttribute("aria-label", "Modal bezárása");
        closeButton.addEventListener("click", () => {
            modal.classList.add("hide");
        });
        modal.prepend(closeButton);
    };

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            modal.classList.add("hide");
        };
    });
};

document.addEventListener("DOMContentLoaded", init);