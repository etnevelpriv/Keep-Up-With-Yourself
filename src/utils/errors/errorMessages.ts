import type { AppErrorMessageInterface } from "../../interfaces/AppErrorMessageInterface.ts";

export const errorMessages: AppErrorMessageInterface = {
    // User validation errors
    "validation/invalid-email": "Az e-mail cím nincs megfelelően megadva.",
    "validation/invalid-password": "A jelszó nincs megfelelően megadva.",
    "validation/invalid-password-requirements": "A jelszó nem felel meg a követelményeknek.",
    "validation/invalid-name": "A név nincs megfelelően megadva.",
    "validation/invalid-createDate": "A létrehozás dátuma nincs megfelelően megadva.",
    "validation/invalid-verified": "Az ellenőrzöttség nincs megfelelően megadva.",

    // Task validation errors
    "validation/invalid-task-name": "A feladat neve érvénytelen.",
    "validation/invalid-task-description": "A feladat leírása érvénytelen.",
    "validation/invalid-task-createdAt": "A feladat létrehozási dátuma érvénytelen.",
    "validation/invalid-task-deadline": "A feladat határideje érvénytelen.",
    "validation/invalid-task-importance": "A feladat fontossága 1 és 5 közé kell essen.",
    "validation/invalid-task-taskType": "A feladat típusa érvénytelen.",
    "validation/invalid-task-status": "A feladat állapota érvénytelen.",
    "validation/invalid-task-completedAt": "A feladat befejezési dátuma érvénytelen.",
    "validation/invalid-task-updatedAt": "A feladat frissítési dátuma érvénytelen.",
    "validation/invalid-text-type": "Valamelyik szöveges mező érvénytelen",

    // Unkown error
    "unknown": "Ismeretlen hiba történt"
}