import type { AppErrorInterface } from "../interfaces/AppErrorInterface";

export class AppError implements AppErrorInterface {
    code:string;
    message:string;
    constructor (code:string, message:string) {
        this.code = code;
        this.message = message;
        
    };
    getMessage () {
        return this.message;
    };
};