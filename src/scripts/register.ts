import "../styles/auth.css";
import { User } from "./classes/User";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

    const newUser = new User(name.value, password.value, email.value, new Date(), false);
    console.log(newUser);

    const form = document.getElementById("registerForm") as HTMLFormElement
    form.reset()


    const auth = getAuth();
    createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            throw new Error(`Error message: ${error.message}, Error code: ${error.code}`);
        });
};

document.addEventListener("DOMContentLoaded", init);