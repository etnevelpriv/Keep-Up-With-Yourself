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

    // Sanitization validation error
    "validation/invalid-text-type": "Valamelyik szöveges mező érvénytelen.",

    // Kliens Authentication process error
    "login/not-verified": "Az email címed nincs megerősítve. Nézd meg a postafiókod, vagy állítsd be egy új jelszót.",
    "appAuth/no-current-auth-user": "Nincs bejelentkeztetett felhaszáló a művelethez.",
    "appAuth/unsupported-provider": "Nem megfelelő hitelesítési szolgáltató.",
    
    // Kliens User process error
    "appUser/document-not-found": "Nem található felhasználó az adatbázisban",
    
    // Firebase auth error
    "auth/email-already-in-use": "Ezzel az e-mail címmel már létezik felhasználói fiók.",
    "auth/invalid-credential": "Helytelen e-mail cím vagy jelszó.",
    "auth/invalid-email": "A megadott e-mail cím érvénytelen.",
    "auth/invalid-password": "A megadott jelszó érvénytelen.",
    "auth/too-many-requests": "Túl sok sikertelen próbálkozás történt. Próbáld újra később.",
    "auth/user-disabled": "A felhasználói fiók le van tiltva.",
    "auth/user-not-found": "Nem található felhasználó ezzel az e-mail címmel.",
    "auth/operation-not-allowed": "Ez a bejelentkezési mód nincs engedélyezve.",
    "auth/network-request-failed": "Hálózati hiba történt. Ellenőrizd az internetkapcsolatot.",
    "auth/requires-recent-login": "Ehhez a művelethez biztonsági okokoból újra bekell jelentkezned.",
    "auth/password-required": "A fiók törléséhez add meg a jelszavad.",
    "auth/unsupported-provider": "Ez a bejelentkezési mód nem támogatott a fióktörléshez.",
    "auth/popup-closed-by-user": "Az újrahitelesítés megszakadt.",
    "account/delete-failed": "A fiók törlése nem sikerült. Próbáld meg újra később.",
    "auth/email-not-verified": "A fiók törléséhez meg kell erősítened az email címed.",

    // Firebase functions errors ?
    "functions/internal": "A művelet nem sikerült. Próbáld meg újra később.",
    "functions/permission-denied": "Nincs jogosultságod ehhez a művelethez.",
    "functions/unauthenticated": "A művelethez be kell jelentkezned.",

    // Firestore errors
    "permission-denied": "Nincs jogosultságod ehhez a művelethez.",
    "unauthenticated": "A művelethez be kell jelentkezned.",
    "not-found": "A keresett adat nem található.",
    "already-exists": "Az adat már létezik.",
    "invalid-argument": "Érvénytelen adat lett elküldve.",
    "failed-precondition": "A művelet előfeltétele nem teljesül.",
    "resource-exhausted": "A rendszer erőforrás-korlátba ütközött.",
    "cancelled": "A művelet megszakadt.",
    "deadline-exceeded": "A művelet időtúllépés miatt megszakadt.",
    "unavailable": "A szolgáltatás jelenleg nem érhető el.",
    "internal": "Belső rendszerhiba történt.",

    // Unkown error
    "unknown": "Ismeretlen hiba történt."
}