import type { AppErrorInterface } from "../interfaces/AppErrorInterface.ts";

export class AppError extends Error implements AppErrorInterface {
    code:string;
    constructor (code:string) {
        super(code);
        this.code = code;
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    };
};