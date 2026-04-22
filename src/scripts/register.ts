import "../styles/auth.css";

const init = function () {
    console.log("Betoltodott a register.ts")
    const form:HTMLElement = document.getElementById("registerForm") as HTMLElement;
    form.addEventListener("submit", sendRegisterForm);
};

const sendRegisterForm = function (e: Event) {
    e.preventDefault();
    console.log("teszt")
};

document.addEventListener("DOMContentLoaded", init);