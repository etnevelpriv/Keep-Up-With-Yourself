import type { UserInterface } from "../interfaces/UserInterface.ts";
export class User implements UserInterface {
    name: string;
    password: string | undefined;
    email: string;
    createdAt: Date;
    verified: boolean;

    constructor(name: string, password: string | undefined, email: string, createdAt: Date, verified: boolean) {
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