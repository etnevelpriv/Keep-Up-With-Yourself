import { showErrorPopUp } from "../../utils/popup";

export const validateUserEmail = function (email: string) {
    if (typeof email !== "string" || email.trim() === "" || !email.includes("@")) {
        const message = `Az e-mail cím nincs megfelelően megadva: ${email}`;
        showErrorPopUp(message)
        throw new Error(message);
    };
};
export const validateUserPassword = function (password: string | undefined) {
    if (password !== undefined) {
        if (typeof password !== "string" || password.trim() === "") {
            const message = `A jelszó nincs megfelelően megadva: ${password}`;
            showErrorPopUp(message)
            throw new Error(message);
        };
        // Ezt a reszt ai-al irattam meg. Mondjuk a szerver oldal amugy is visszadobja, de nembaj, legyen meg itt is.
        const pwd = password;
        const lengthOk = pwd.length >= 8 && pwd.length <= 16;
        const lowerOk = /[a-z]/.test(pwd);
        const upperOk = /[A-Z]/.test(pwd);
        const digitOk = /[0-9]/.test(pwd);
        const specialOk = /[\.\!\-\@\#\$\%\&\*\+\=]/.test(pwd);

        if (!lengthOk || !lowerOk || !upperOk || !digitOk || !specialOk) {
            const message = `A jelszó nem felel meg a követelményeknek.`;
            showErrorPopUp(message)
            throw new Error(message);
        };
    };
};
export const validateUserName = function (name: string) {
    if (typeof name !== "string" || name.trim() === "") {
        const message = `A név nincs megfelelően megadva: ${name}`;
        showErrorPopUp(message)
        throw new Error(message);
    };
};
export const validateCreateDate = function (createdAt: Date) {
    if (!(createdAt instanceof Date) || isNaN(createdAt.getTime()) || createdAt.getTime() > new Date().getTime()) {
        const message = `A létrehozás dátuma nincs megfelelően megadva: ${createdAt}`;
        showErrorPopUp(message)
        throw new Error(message);
    }
};
export const validateUserVerified = function (verified: boolean) {
    if (typeof verified !== "boolean") {
        const message = `Az ellenőrzöttség nincs megfelelően megadva: ${verified}`;
        showErrorPopUp(message)
        throw new Error(message);
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