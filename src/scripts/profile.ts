import "../styles/base.css";
import "../styles/profile.css";
import "./header.ts";
import "../styles/loggedInUserNav.css";

import { getAuth } from "firebase/auth";
import { User } from "../models/User.ts";
import { deleteCurrentUserAccount, getCurrentUser, sendPasswordReset, signOutUser } from "../services/auth/auth.service.ts";
import { db } from "./firebase.ts";
import { handleUiError } from "../utils/errors/handleUiError.ts";
import { showInfoPopUp } from "../utils/popup.ts";

const init = async function () {
    getAuth();
    let user: User;
    try {
        const currentUser = await getCurrentUser(db);
        if (!currentUser) {
            return;
        };
        user = new User(currentUser.userName, undefined, currentUser.userEmail, new Date(currentUser.userCreatedAt.seconds * 1000), currentUser.userVerified);
        showUserDataInDOM(user);
    } catch (error) {
        handleUiError(error)
    }

    document.getElementById("changePasswordButton")?.addEventListener("click", async () => {
        try {
            await sendPasswordReset(user.email)
            showInfoPopUp("Sikeresen kiküldtük a jelszó helyreállító emailt. Nézd meg a postaládádat.")
        } catch (error) {
            handleUiError(error)
        }
    });
    document.getElementById("signOutButton")?.addEventListener("click", async () => {
        try {
            await signOutUser();
            showInfoPopUp("Sikeres kijelentkezés");
        } catch (error) {
            handleUiError(error)
        }
    });
    document.getElementById("deleteProfileButton")?.addEventListener("click", async () => {
        const modal = document.getElementById("warningModal");
        modal?.classList.add("show");
        document.getElementById("dontDeleteProfileButton")?.addEventListener("click", () => {
            modal?.classList.remove("show");
            return;
        });
        document.getElementById("sureDeleteProfileButton")?.addEventListener("click", async () => {
            try {
                await deleteCurrentUserAccount(db);
                showInfoPopUp("A fiókot sikeresen töröltük.");
            } catch (error) {
                handleUiError(error)
            }
        });
    });
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

document.addEventListener("DOMContentLoaded", init);
