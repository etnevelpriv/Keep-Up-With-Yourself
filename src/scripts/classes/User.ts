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
            const message = `A név nincs megfelelően megadva: ${name}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }

        if (typeof password !== "string" || password.trim() === "") {
            const message = `A jelszó nincs megfelelően megadva: ${password}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }
        // Ezt a reszt ai-al irattam meg. Mondjuk a szerver oldal amugy is visszadobja, de nembaj, legyen meg itt is.
        const pwd = password;
        const lengthOk = pwd.length >= 8 && pwd.length <= 16;
        const lowerOk = /[a-z]/.test(pwd);
        const upperOk = /[A-Z]/.test(pwd);
        const digitOk = /[0-9]/.test(pwd);
        const specialOk = /[\.\!\-]/.test(pwd);

        if (!lengthOk || !lowerOk || !upperOk || !digitOk || !specialOk) {
            const message = `A jelszó nem felel meg a követelményeknek.`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }

        if (typeof email !== "string" || email.trim() === "" || !email.includes("@")) {
            const message = `Az e-mail cím nincs megfelelően megadva: ${email}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }

        if (!(createdAt instanceof Date) || isNaN(createdAt.getTime()) || createdAt.getTime() > new Date().getTime()) {
            const message = `A létrehozás dátuma nincs megfelelően megadva: ${createdAt}`;
            if (errorMessageDiv) errorMessageDiv.textContent = message;
            throw new Error(message);
        }

        if (typeof verified !== "boolean") {
            const message = `Az ellenőrzöttség nincs megfelelően megadva: ${verified}`;
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
                const errorCodes = {
                    "auth/email-already-in-use": "Ezzel az e-mail címmel már létezik felhasználói fiók.",
                };

                const errorMessageDiv = document.getElementById("errorMessage");
                if (errorMessageDiv) {
                    if (errorCodes[error.code]) {
                        errorMessageDiv.textContent = errorCodes[error.code];
                    } else {
                        errorMessageDiv.textContent = "Ismeretlen hiba történt.";
                    }
                }
                throw new Error(`Hiba uzenet: ${error.message}, Hiba kod: ${error.code}`);
            });
    };

    async saveUserInfoToDb(uid: string, user: any) {
        try {
            const defaultTaskTypes = [
                {
                    taskTypeName: "Tanulás",
                    taskType_isSystem: true
                },
                {
                    taskTypeName: "Munka",
                    taskType_isSystem: true
                },
                {
                    taskTypeName: "Takarítás",
                    taskType_isSystem: true
                },
            ];
            const emptyArr:[] = [];
            
            await setDoc(doc(db, "users", uid), {
                userID: uid,
                userEmail: this.email,
                userName: this.name,
                userCreatedAt: this.createdAt,
                userVerified: this.verified,
                taskTypes: defaultTaskTypes,
                tasks: emptyArr
            });
            console.log("Uj doksi letrehozva az adatbazisban");
            if (!this.verified) {
                this.sendVerificationLink(user);
            };
        } catch (e: any) {
            const errorMessageDiv = document.getElementById("errorMessage");
            if (errorMessageDiv) {
                errorMessageDiv.textContent = 'Hiba történt az adatbázisba való mentés folyamán.';
            }
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
                const errorMessageDiv = document.getElementById("errorMessage");
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = 'Hiba történt a visszaigazoló e-mail küldése során.';
                }
                throw new Error(err);
            });
    };
};