import type { UserInterface } from "./UserInterface.ts";
import { setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { db } from "../firebase.ts"

const errorMessageDiv = document.getElementById("errorMessage");

export class User implements UserInterface {
    name: string;
    password: string | undefined;
    email: string;
    createdAt: Date;
    verified: boolean;

    constructor(name: string, password: string | undefined, email: string, createdAt: Date, verified: boolean) {
        this.validateFormValues(name, password, email, createdAt, verified);
        this.name = name;
        this.password = password;
        this.email = email;
        this.createdAt = createdAt;
        this.verified = verified;
    };

    toString() {
        return (`Nev: ${this.name}, Jelszo:${this.password}, Email:${this.email}, Datum:${this.createdAt}, Verified:${this.verified}`);
    };

    validateFormValues(name: string, password: string | undefined, email: string, createdAt: Date, verified: boolean) {
        if (typeof name !== "string" || name.trim() === "") {
            const message = `A nev valtozo nincs megfeleloen megadva: ${name}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }

        if (typeof password !== "string" || password.trim() === "") {
            const message = `A jelszo valtozo nincs megfeleloen megadva: ${password}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }

        if (typeof email !== "string" || email.trim() === "" || !email.includes("@")) {
            const message = `Az email valtozo nincs megfeleloen megadva: ${email}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }

        if (!(createdAt instanceof Date) || isNaN(createdAt.getTime()) || createdAt.getTime() > new Date().getTime()) {
            const message = `A createdAt valtozo nincs megfeleloen megadva: ${createdAt}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }

        if (typeof verified !== "boolean") {
            const message = `A verified valtozo nincs megfeleloen megadva: ${verified}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }
    };

    createUserWithEmailProvider() {
        const auth = getAuth();

        createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                this.saveUserInfoToDb(userCredential.user.uid, user)
            })
            .catch((error) => {
                throw new Error(`Hiba uzenet: ${error.message}, Hiba kod: ${error.code}`);
            });
    };

    async saveUserInfoToDb(uid: string, user: any) {
        try {
            const docRef = await setDoc(doc(db, "users", uid), {
                userID: uid,
                userEmail: this.email,
                userName: this.name,
                userCreatedAt: this.createdAt,
                userVerified: this.verified
            });
            console.log("Uj doksi letrehozva az adatbazisban");
            if (!this.verified) {
                this.sendVerificationLink(user);
            };
        } catch (e: any) {
            throw new Error(e)
        };
    };
    sendVerificationLink(user: any) {
        console.log("sendVerificationLink metodus elindult")
        const actionCodeSettings = {
            url: 'https://keep-up-with-yourself.web.app/create',
            handleCodeInApp: true,
        };
        sendEmailVerification(user, actionCodeSettings)
            .then(() => {
                console.log(`Email verifikacio elkuldve`)
            }).catch((err: any) => {
                throw new Error(err);
            });
    };
};