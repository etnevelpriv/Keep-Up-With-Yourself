import type { AppErrorInterface } from "../interfaces/AppErrorInterface.ts";

export class AppError extends Error implements AppErrorInterface {
    code:string;
    message:string;
    constructor (code:string, message:string) {
        super(message);
        this.code = code;
        this.message = message;
        Object.setPrototypeOf(this, AppError.prototype);
    };
    getMessage () {
        return this.message;
    };
};