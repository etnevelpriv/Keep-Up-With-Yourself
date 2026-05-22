import "../styles/auth.css";
import { User } from "../models/User.ts";
import { registerWithEmail } from "../services/auth/auth.service.ts";
import { loginWithGoogle } from "../services/auth/auth.service.ts";

const init = function () {
    console.log("Betoltodott a register.ts")
    const form: HTMLElement = document.getElementById("registerForm") as HTMLElement;
    form.addEventListener("submit", sendRegisterForm);

    document.getElementById("googleButton")?.addEventListener("click", () => {
        loginWithGoogle();

    });
};

const sendRegisterForm = function (e: Event) {
    e.preventDefault();
    console.log("Regisztralas gombra kattintva")
    const name = document.getElementById("nameInput") as HTMLInputElement;
    const email = document.getElementById("emailInput") as HTMLInputElement;
    const password = document.getElementById("passwordInput") as HTMLInputElement;
    const userObj = new User(name.value, password.value, email.value, new Date(), false);
    console.log(userObj);
    const form = document.getElementById("registerForm") as HTMLFormElement
    registerWithEmail(userObj.name, userObj.email, password.value, userObj.createdAt, userObj.verified)
    form.reset()
};

document.addEventListener("DOMContentLoaded", init);