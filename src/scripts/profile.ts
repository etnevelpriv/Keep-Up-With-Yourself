import "../styles/base.css";
import "../styles/profile.css";
import "./header.ts";
import "../styles/loggedInUserNav.css";
import { showErrorPopUp } from "../utils/popup.ts";

import { getAuth } from "firebase/auth";
import { User } from "../models/User.ts";
import { deleteCurrentUserAccount, getCurrentUser, sendPasswordReset, signOutUser } from "../services/auth/auth.service.ts";
import { db } from "./firebase.ts";

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
    const currentUser = await getCurrentUser(db);
    if (!currentUser) {
        return;
    }

    const userPayload = currentUser as UserPayload | null;
    if (!userPayload) {
        console.error("A felhasznalo letezik, de az adatbazisban nincs hozza dokumentum.");
        return;
    }

    let user: User;
    try {
        user = new User(userPayload.userName, undefined, userPayload.userEmail, new Date(userPayload.userCreatedAt.seconds * 1000), userPayload.userVerified);
    } catch (error: any) {
        showErrorPopUp(error.message);
        throw error;
    }
    console.log(user.toString());
    showUserDataInDOM(user);

    document.getElementById("changePasswordButton")?.addEventListener("click", () => {
        sendPasswordReset(user.email)
    });
    document.getElementById("signOutButton")?.addEventListener("click", () => {
        signOutUser();
    });
    document.getElementById("deleteProfileButton")?.addEventListener("click", async () => {
        const modal = document.getElementById("warningModal");
        modal?.classList.add("show");
        document.getElementById("dontDeleteProfileButton")?.addEventListener("click", () => {
            modal?.classList.remove("show");
            return;
        });
        document.getElementById("sureDeleteProfileButton")?.addEventListener("click", () => {
            deleteCurrentUserAccount(db);
        });
    });
};

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
