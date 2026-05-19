import "../styles/base.css";
import "../styles/profile.css";
import "./header.ts";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"
import { User } from "./classes/User.ts";

const init = async function () {
    const auth = getAuth();
    const userPayload = await getUser(auth);
    console.log(userPayload)
    const user = new User(userPayload.userName, undefined, userPayload.userEmail, new Date(userPayload.userCreatedAt.seconds *1000), userPayload.userVerified)
    console.log(user.toString());
    
    document.getElementById("signOutButton")?.addEventListener("click", () => {
        signOut(auth).then(() => {
            console.log("Sikeresen kijelentkezett a felhasznalo.")
        }).catch((error) => {
            throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}`);
        });

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

document.addEventListener("DOMContentLoaded", init);