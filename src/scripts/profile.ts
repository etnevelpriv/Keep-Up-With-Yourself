import "../styles/base.css";
import "../styles/profile.css";
import "./header.ts";
import "../styles/loggedInUserNav.css";
import { showErrorPopUp } from "../utils/popup.ts";

import { getAuth } from "firebase/auth";
// import type { Auth } from "firebase/auth";
// import { doc, getDoc, deleteDoc } from "firebase/firestore";
// import { db } from "./firebase.ts"
import { User } from "../models/User.ts";
import { getUserDocumentFromDatabase } from "../services/user/user.service.ts";
import { deleteCurrentUserAccount, getCurrentUser, sendPasswordReset, signOutUser } from "../services/auth/auth.service.ts";

type UserPayload = {
    userID: string;
    userName: string;
    userEmail: string;
    userCreatedAt: {
        seconds: number;
    };
    userVerified: boolean;
};

const init = async function () {
    getAuth();
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return;
    }

    const userPayload = await getUserDocumentFromDatabase(currentUser.uid) as UserPayload | false;
    if (!userPayload) {
        console.error("A felhasznalo letezik, de az adatbazisban nincs hozza dokumentum.");
        return;
    }

    const user: User = new User(userPayload.userName, undefined, userPayload.userEmail, new Date(userPayload.userCreatedAt.seconds * 1000), userPayload.userVerified)
    console.log(user.toString());
    showUserDataInDOM(user);

    document.getElementById("changePasswordButton")?.addEventListener("click", () => {
        // const auth = getAuth();
        // sendPasswordResetEmail(auth, user.email)
        //     .then(() => {
        //         showInfoPopUp("Elküldtük a jelszó-visszaállítási e-mailt, ha a fiókhoz tartozik ez az e-mail cím.");
        //         console.log("forgotPassSendButton megnyomva, ha az email letezik a felhasznalok koztt, kikuldjuk az emailt")
        //     })
        //     .catch((error) => {
        //         showErrorPopUp(getProfileErrorMessage(error));
        //         console.error(`Hiba uzenet: ${error.code}, Hiba kod: ${error.errorMessage}`);
        //     });
        sendPasswordReset(user.email)
    });
    document.getElementById("signOutButton")?.addEventListener("click", () => {
        // signOut(auth).then(() => {
        //     showInfoPopUp("Sikeresen kijelentkeztél.");
        //     console.log("Sikeresen kijelentkezett a felhasznalo.")
        // }).catch((error) => {
        //     showErrorPopUp(getProfileErrorMessage(error));
        //     console.error(`Hiba uzenet: ${error.code}, Hiba kod: ${error.errorMessage}`);
        // });
        signOutUser();
    });
    document.getElementById("deleteProfileButton")?.addEventListener("click", async () => {
        // try {
        //     const currentUser = auth.currentUser;
        //     if (!currentUser) {
        //         showErrorPopUp("A fiók törléséhez előbb jelentkezz be újra.");
        //         return;
        //     };
        //     await deleteDoc(doc(db, "users", userPayload.userID));
        //     await deleteUser(currentUser)
        //     showInfoPopUp("A fiókodat sikeresen töröltük.");
        // } catch (err) {
        //     showErrorPopUp(getProfileErrorMessage(err));
        //     console.error(err);
        // }'
        deleteCurrentUserAccount();
    });
};

// const getUser = async function (auth: Auth): Promise<UserPayload> {
//     return new Promise((resolve, reject) => {
//         try {
//             onAuthStateChanged(auth, async (user) => {
//                 if (user) {
//                     const docRef = doc(db, "users", user.uid);
//                     const docSnap = await getDoc(docRef);
//                     if (docSnap.exists()) {
//                         if (user.emailVerified) {
//                             resolve(docSnap.data() as UserPayload);
//                         };
//                     };
//                 };
//             });
//         } catch (err: any) {
//             reject(err);
//             throw new Error(err);
//         }
//     })
// };

const getProfileErrorMessage = function (error: unknown): string {
    const errorCode = typeof error === "object" && error !== null && "code" in error
        ? String((error as { code: unknown }).code)
        : "";

    const errorCodes: Record<string, string> = {
        "auth/missing-email": "Nem található e-mail cím a művelethez.",
        "auth/invalid-email": "Hibás e-mail cím.",
        "auth/requires-recent-login": "Biztonsági okokból jelentkezz be újra, majd próbáld meg ismét.",
        "auth/network-request-failed": "Hálózati hiba történt. Ellenőrizd az internetkapcsolatot.",
        "permission-denied": "Nincs jogosultságod ehhez a művelethez.",
    };

    return errorCodes[errorCode] ?? "Ismeretlen hiba történt. Próbáld meg újra később.";
};

const showUserDataInDOM = function (user: User) {
    const userNameElement = document.getElementById("userName");
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
    const userEmailElement = document.getElementById("userEmail");
    if (userEmailElement) {
        userEmailElement.textContent = user.email;
    }
    const createdAtlElement = document.getElementById("createdAt");
    if (createdAtlElement) {
        createdAtlElement.textContent = `${user.createdAt.getFullYear()}. ${user.createdAt.getMonth() + 1}. ${user.createdAt.getDate()}. ${user.createdAt.getHours()}:${user.createdAt.getMinutes()}`;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
        showErrorPopUp(getProfileErrorMessage(error));
        console.error(error);
    });
});
