import type { AppErrorMessageInterface } from "../../interfaces/AppErrorMessageInterface.ts";

export const errorMessages: AppErrorMessageInterface = {
    // Auth validation errors
    "validation/invalid-email":"Az e-mail cím nincs megfelelően megadva.",
    "validation/invalid-password":"A jelszó nincs megfelelően megadva.",
    "validation/invalid-password-requirements":"A jelszó nem felel meg a követelményeknek.",
    "validation/invalid-name":"A név nincs megfelelően megadva.",
    "validation/invalid-createDate":"A létrehozás dátuma nincs megfelelően megadva.",
    "validation/invalid-verified":"Az ellenőrzöttség nincs megfelelően megadva.",

    // Unkown error
    "unknown":"Ismeretlen hiba történt"
}