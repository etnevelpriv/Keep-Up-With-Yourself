import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"
import {initializeAuthListener} from "../services/auth/auth.listener.ts"

// Innentol
const messageTimers = new WeakMap<HTMLElement, number>();

const setupAuthMessages = function () {
    const messageElements = document.querySelectorAll<HTMLElement>(".error-message, .info-message");

    messageElements.forEach((messageElement) => {
        const messageWrapper = messageElement.parentElement;
        if (!messageWrapper) return;

        const isErrorMessage = messageElement.classList.contains("error-message");
        messageWrapper.classList.add("auth-message", isErrorMessage ? "auth-message-error" : "auth-message-info");
        messageWrapper.setAttribute("role", isErrorMessage ? "alert" : "status");
        messageWrapper.setAttribute("aria-live", isErrorMessage ? "assertive" : "polite");

        if (messageElement.textContent?.trim() === "teszt") {
            messageElement.textContent = "";
        };

        if (!messageWrapper.querySelector(".message-close-button")) {
            const closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.className = "message-close-button";
            closeButton.textContent = "x";
            closeButton.setAttribute("aria-label", "Üzenet bezárása");
            closeButton.addEventListener("click", () => {
                messageElement.textContent = "";
            });
            messageWrapper.append(closeButton);
        };

        const updateMessageVisibility = function () {
            const timer = messageTimers.get(messageElement);
            if (timer) {
                window.clearTimeout(timer);
            };

            if (messageElement.textContent?.trim()) {
                messageWrapper.classList.add("is-visible");
                const newTimer = window.setTimeout(() => {
                    messageElement.textContent = "";
                }, 5000);
                messageTimers.set(messageElement, newTimer);
            } else {
                messageWrapper.classList.remove("is-visible");
            };
        };

        const observer = new MutationObserver(updateMessageVisibility);
        observer.observe(messageElement, {
            childList: true,
            characterData: true,
            subtree: true
        });

        updateMessageVisibility();
    });
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

setupAuthMessages();
setupForgotPasswordModal();
// Idaig

// const auth = getAuth();
// onAuthStateChanged(auth, async (user) => {
//     if (user) {
//         console.log(`A felhasznalo bevan jelentkezve. Email: ${user.email}, Nev: ${user.displayName}, UID: ${user.uid} Verfied: ${user.emailVerified}`);
//         const docRef = doc(db, "users", user.uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//             console.log("A felhasznalo letezik az adatbazisban is:", docSnap.data());
//             if (user.emailVerified) {
//                 console.log("A felhasznalo mar hitelesitette az email cimet");
//                 if (!(docSnap.data().userVerified)) {
//                     await updateDoc(doc(db, "users", user.uid), {
//                         userVerified: true
//                     });
//                     console.log("A felhasznalo adatbazisban szereplo dokumentumaban is verified mostmar")
//                 };

//                 const currentPath = window.location.pathname.toLowerCase();
//                 const isLoginPage = currentPath.includes("login");
//                 const isRegisterPage = currentPath.includes("register");

//                 if (isLoginPage || isRegisterPage) {
//                     window.location.href = "/pages/create.html";
//                 };

//             } else {
//                 console.log("A felhasznalo meg nem hitelesitette az email cimet", docSnap.data().userVerified);
//                 const errorMessageDiv = document.getElementById("errorMessage");
//                 if (errorMessageDiv) {
//                     errorMessageDiv.textContent = "A bejelentkezés sikeres, de a felhasználói fiók nincs hitelesítve. Ellenőrizd az e-mailjeidet, vagy állíts be új jelszót az 'Elfelejtett jelszó' gombbal a bejelentkezési felületen.";
//                 }
//             };
//         } else {
//             console.log("A felhasznalo letezik, de az adatbazisban nincs hozza dokumentum.");
//         };


//     } else {
//         console.log("Nincs bejelentkezett felhasznalo")
//         const currentPath = window.location.pathname.toLowerCase();
//         const isCreatePage = currentPath.includes("create");
//         const isProfilePage = currentPath.includes("profile");
//         const isTasksPage = currentPath.includes("tasks");

//         if (isCreatePage || isProfilePage || isTasksPage) {
//             window.location.href = "/pages/login.html";
//         };
//     };
// });

initializeAuthListener()
