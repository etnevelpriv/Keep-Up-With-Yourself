import "../styles/base.css";
import "../styles/profile.css";
import "./header.ts";
import { getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase.ts"
import { User } from "./classes/User.ts";

const init = async function () {
    const auth = getAuth();
    const userPayload = await getUser(auth);
    console.log(userPayload)
    const user: User = new User(userPayload.userName, undefined, userPayload.userEmail, new Date(userPayload.userCreatedAt.seconds * 1000), userPayload.userVerified)
    console.log(user.toString());
    showUserDataInDOM(user);

    document.getElementById("changePasswordButton")?.addEventListener("click", () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, user.email)
            .then(() => {
                console.log("forgotPassSendButton megnyomva, ha az email letezik a felhasznalok koztt, kikuldjuk az emailt")
            })
            .catch((error) => {
                throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}`);
            });

    });
    document.getElementById("signOutButton")?.addEventListener("click", () => {
        signOut(auth).then(() => {
            console.log("Sikeresen kijelentkezett a felhasznalo.")
        }).catch((error) => {
            throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}`);
        });
    });
    document.getElementById("deleteProfileButton")?.addEventListener("click", async () => {

        try {
            const currentUser = auth.currentUser;
            await deleteDoc(doc(db, "users", userPayload.userID));
            await deleteUser(currentUser)
        } catch (err) {
            throw new Error(err)
        }
    });
};

const getUser = async function (auth: any) {
    return new Promise((resolve, reject) => {
        try {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        if (user.emailVerified) {
                            resolve(docSnap.data());
                        };
                    };
                };
            });
        } catch (err: any) {
            reject(err);
            throw new Error(err);
        }
    })
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