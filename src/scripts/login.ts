import "../styles/auth.css";
import { loginWithEmail, loginWithGoogle, sendPasswordReset } from "../services/auth/auth.service";

const init = function () {
    console.log("Betoltodott a register.ts")
    const form: HTMLElement = document.getElementById("loginForm") as HTMLElement;
    form.addEventListener("submit", sendLoginForm);
    setupForgotPasswordModal();
    document.getElementById("googleButton")?.addEventListener("click", () => {
        loginWithGoogle();
    });

    document.getElementById("forgotPassButton")?.addEventListener("click", () => {
        const modal = document.getElementById("forgotPassModal");
        modal?.classList.toggle("hide");

    });

    document.getElementById("forgotPassSendButton")?.addEventListener("click", () => {
        const emailInput = document.getElementById("forgotPassEmailInput") as HTMLInputElement | null;
        const email = emailInput?.value ?? "";
        sendPasswordReset(email);

    });
};

const sendLoginForm = function (e: Event) {
    e.preventDefault();
    console.log("Bejelentkezes gombra kattintva")
    const email = document.getElementById("emailInput") as HTMLFormElement;
    const password = document.getElementById("passwordInput") as HTMLFormElement;
    loginWithEmail(email.value, password.value);
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