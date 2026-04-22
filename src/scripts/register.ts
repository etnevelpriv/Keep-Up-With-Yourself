import "../styles/auth.css";
import { User } from "./classes/User";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const init = function () {
    console.log("Betoltodott a register.ts")
    const form: HTMLElement = document.getElementById("registerForm") as HTMLElement;
    form.addEventListener("submit", sendRegisterForm);

    document.getElementById("googleButton")?.addEventListener("click", () => {
        console.log("Google gombra kattintva")
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        const auth = getAuth();
        auth.useDeviceLanguage;

        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(credential, result);
                const name = user.displayName;
                const email = user.email;
                const userObj = new User(name, undefined, email, new Date(), true);
                userObj.saveUserInfoToDb(user.uid, undefined);
            }).catch((error) => {
                throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}, Email: ${error.costumData.email}, Hitelesito adat: ${GoogleAuthProvider.credentialFromError(error)}`);
            });
    });
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