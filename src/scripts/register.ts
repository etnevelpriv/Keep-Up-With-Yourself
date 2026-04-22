import "../styles/auth.css";
import { User } from "./classes/User";

const init = function () {
    console.log("Betoltodott a register.ts")
    const form: HTMLElement = document.getElementById("registerForm") as HTMLElement;
    form.addEventListener("submit", sendRegisterForm);
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

    userObj.validateFormValues();
    userObj.createUserWithEmailProvider();
};

document.addEventListener("DOMContentLoaded", init);