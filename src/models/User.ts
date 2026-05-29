import type { UserInterface } from "../interfaces/UserInterface.ts";
import { validateRegisterInput } from "../services/user/user.validator.ts";
export class User implements UserInterface {
    name: string;
    password: string | undefined;
    email: string;
    createdAt: Date;
    verified: boolean;

    constructor(name: string, password: string | undefined, email: string, createdAt: Date, verified: boolean) {
        validateRegisterInput(name, email, password, createdAt, verified);
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