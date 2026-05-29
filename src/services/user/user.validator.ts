import { AppError } from "../../models/AppError.ts";

export const validateUserEmail = function (email: string) {
    if (typeof email !== "string" || email.trim() === "" || !email.includes("@")) {
        throw new AppError("validation/invalid-email");
    };
};
export const validateUserPassword = function (password: string | undefined) {
    if (password !== undefined) {
        if (typeof password !== "string" || password.trim() === "") {
            throw new AppError("validation/invalid-password");
        };
        // Ezt a reszt ai-al irattam meg. Mondjuk a szerver oldal amugy is visszadobja, de nembaj, legyen meg itt is.
        const pwd = password;
        const lengthOk = pwd.length >= 8 && pwd.length <= 16;
        const lowerOk = /[a-z]/.test(pwd);
        const upperOk = /[A-Z]/.test(pwd);
        const digitOk = /[0-9]/.test(pwd);
        const specialOk = /[\.\!\-\@\#\$\%\&\*\+\=]/.test(pwd);

        if (!lengthOk || !lowerOk || !upperOk || !digitOk || !specialOk) {
            throw new AppError("validation/invalid-password-requirements");
        };
    };
};
export const validateUserName = function (name: string) {
    if (typeof name !== "string" || name.trim() === "" || name.length < 1 || name.length > 30) {
        throw new AppError("validation/invalid-name");
    };
};
export const validateCreateDate = function (createdAt: Date) {
    if (!(createdAt instanceof Date) || isNaN(createdAt.getTime()) || createdAt.getTime() > new Date().getTime()) {
        throw new AppError("validation/invalid-createDate");
    }
};
export const validateUserVerified = function (verified: boolean) {
    if (typeof verified !== "boolean") {
        throw new AppError("validation/invalid-verified");
    }
};
export const validateRegisterInput = function (name: string, email: string, password: string, createdAt: Date, verified: boolean) {
    validateUserEmail(email);
    validateUserName(name);
    validateUserPassword(password);
    validateCreateDate(createdAt);
    validateUserVerified(verified);
};
export const validateLoginInput = function (email: string, password: string) {
    validateUserEmail(email);
    validateUserPassword(password);
};