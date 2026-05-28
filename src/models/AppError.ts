import type { AppErrorInterface } from "../interfaces/AppErrorInterface.ts";

export class AppError extends Error implements AppErrorInterface {
    code:string;
    constructor (code:string, message:string) {
        super(message);
        this.name = "AppError";
        this.code = code;
        Object.setPrototypeOf(this, AppError.prototype);
    };
};