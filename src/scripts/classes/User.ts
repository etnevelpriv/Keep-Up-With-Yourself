import type { UserInterface } from "./UserInterface.ts";

export class User implements UserInterface {
    name: string;
    password: string;
    email: string;
    createdAt: Date;
    verified: boolean;
    constructor(name: string, password: string, email: string, createdAt: Date, verified: boolean) {
        if (typeof name != "string" || name == "" || name == null || name == undefined) {
            throw new Error(`A nev valtozo nincs megfeleloen megadva: ${name}`);
        };
        if (typeof password != "string" || password == "" || password == null || password == undefined) {
            throw new Error(`A jelszo valtozo nincs megfeleloen megadva: ${password}`);
        };
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
};