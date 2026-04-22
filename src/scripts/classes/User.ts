import type { UserInterface } from "./UserInterface.ts";
import { collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { db } from "../firebase.ts"

export class User implements UserInterface {
    name: string;
    password: string | undefined;
    email: string;
    createdAt: Date;
    verified: boolean;
    constructor(name: string, password: string | undefined, email: string, createdAt: Date, verified: boolean) {
        if (typeof name != "string" || name == "" || name == null || name == undefined) {
            throw new Error(`A nev valtozo nincs megfeleloen megadva: ${name}`);
        };
        // if (typeof password != "string" || password == "" || password == null || password == undefined) {
        //     throw new Error(`A jelszo valtozo nincs megfeleloen megadva: ${password}`);
        // };
        if (typeof email != "string" || email == "" || email == null || email == undefined || !email.includes("@")) {
            throw new Error(`Az email valtozo nincs megfeleloen megadva: ${email}`);
        };
        if (typeof createdAt != "object" || !(createdAt instanceof Date) || createdAt.getTime() > (new Date()).getTime() || createdAt == null || createdAt == undefined || isNaN(createdAt.getTime())) {
            throw new Error(`A createdAt valtozo nincs megfeleloen megadva: ${createdAt}`);
        };
        if (typeof verified != "boolean" || verified == null || verified == undefined) {
            throw new Error(`A verified valtozo nincs megfeleloen megadva: ${verified}`);
        };
        this.name = name;
        this.password = password;
        this.email = email;
        this.createdAt = createdAt;
        this.verified = verified;
    };

    toString() {
        return (`Nev: ${this.name}, Jelszo:${this.password}, Email:${this.email}, Datum:${this.createdAt}, Verified:${this.verified}`);
    };

    validateFormValues() {
        console.log("validateFormValues meg nincs implementalva")
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
            const docRef = await addDoc(collection(db, "users"), {
                userID: uid,
                userEmail: this.email,
                userName: this.name,
                userCreatedAt: this.createdAt,
                userVerified: this.verified
            });
            console.log("Uj doksi letrehozva az adatbazisban: ", docRef.id);
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
            iOS: {
                bundleId: 'com.example.ios'
            },
            android: {
                packageName: 'com.example.android',
                installApp: true,
                minimumVersion: '12'
            }
        };
        sendEmailVerification(user, actionCodeSettings)
            .then(() => {
                console.log(`Email verifikacio elkuldve`)
            }).catch((err: any) => {
                throw new Error(err);
            });
    };
};