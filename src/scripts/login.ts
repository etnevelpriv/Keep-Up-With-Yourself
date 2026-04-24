import "../styles/auth.css";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { User } from "./classes/User";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const init = function () {
    console.log("Betoltodott a register.ts")
    const form: HTMLElement = document.getElementById("loginForm") as HTMLElement;
    form.addEventListener("submit", sendLoginForm);

    document.getElementById("googleButton")?.addEventListener("click", () => {
        console.log("Google gombra kattintva")
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        const auth = getAuth();
        auth.useDeviceLanguage;

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(credential, result);
                const name = user.displayName;
                const email = user.email;

                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (!(docSnap.exists())) {
                    const userObj = new User(name, undefined, email, new Date(), true);
                    userObj.saveUserInfoToDb(user.uid, undefined);
                };
            }).catch((error) => {
                throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}, Email: ${error.costumData.email}, Hitelesito adat: ${GoogleAuthProvider.credentialFromError(error)}`);
            });
    });
    
    document.getElementById("forgotPassButton")?.addEventListener("click", () => {
        const modal = document.getElementById("forgotPassModal");
        modal?.classList.toggle("hide");

    });

    document.getElementById("forgotPassSendButton")?.addEventListener("click", () => {
        const email = document.getElementById("forgotPassEmailInput").value;
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("forgotPassSendButton megnyomva, ha az email letezik a felhasznalok koztt, kikuldjuk az emailt")
            })
            .catch((error) => {
                throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}`);
            });
    });
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
        })
        .catch((error) => {
            throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}`);
        });
};

document.addEventListener("DOMContentLoaded", init);