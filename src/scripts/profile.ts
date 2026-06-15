import "../styles/base.css";
import "../styles/profile.css";
import "./header.ts";
import "../styles/loggedInUserNav.css";

import { User } from "../models/User.ts";
import { deleteCurrentUserAccount, getAuthUserWhenReady, getProvider, sendPasswordReset, signOutUser } from "../services/auth/auth.service.ts";
import { db } from "./firebase.ts";
import { handleUiError } from "../utils/errors/handleUiError.ts";
import { showInfoPopUp } from "../utils/popup.ts";
import { redirecUnauthenticatedtUser } from "../services/auth/auth.guard.ts";
import { getUserDocumentFromDatabase } from "../services/user/user.service.ts";
import { AppError } from "../models/AppError.ts";

const init = async function () {
    try {
        const currentUser = await getAuthUserWhenReady();
        const userDoc = await getUserDocumentFromDatabase(db, currentUser.uid)
        if (!userDoc) {
            throw new AppError("appUser/document-not-found")
        };
        const user: User = new User(userDoc.userName, undefined, userDoc.userEmail, new Date(userDoc.userCreatedAt.seconds * 1000), userDoc.userVerified);
        showUserDataInDOM(user);
        document.getElementById("changePasswordButton")?.addEventListener("click", async () => {
            try {
                await sendPasswordReset(userDoc.userEmail)
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
            let provider: string | undefined | null;
            try {
                provider = await getProvider();
                if (provider == "password" && !document.getElementById("passwordInput")) {
                    const passwordInput = document.createElement("input")
                    passwordInput.id = "passwordInput";
                    passwordInput.type = "password";
                    passwordInput.placeholder = "Add meg a jelszavad a törléshez";
                    modal?.appendChild(passwordInput);
                };
            } catch (error) {
                handleUiError(error)
            };
            modal?.classList.add("show");
            document.getElementById("dontDeleteProfileButton")?.addEventListener("click", () => {
                modal?.classList.remove("show");
                return;
            });
            document.getElementById("sureDeleteProfileButton")?.addEventListener("click", async () => {
                try {
                    if (provider == "password") {
                        const passwordInput = document.getElementById("passwordInput") as HTMLInputElement
                        const password = passwordInput.value;
                        await deleteCurrentUserAccount(password);
                    } else if (provider == "google.com") {
                        await deleteCurrentUserAccount();
                    } else {
                        throw new AppError("appAuth/unsupported-provider")
                    }
                    showInfoPopUp("A fiókot sikeresen töröltük.");
                    redirecUnauthenticatedtUser();
                } catch (error) {
                    handleUiError(error);
                }
            });
        });

    } catch (error) {
        handleUiError(error)
    }
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
