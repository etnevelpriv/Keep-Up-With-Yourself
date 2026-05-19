import { GoogleAuthProvider } from "firebase/auth";

export const createGoogleProvider = function () {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
    return provider;
};

export const shouldUseRedirectForGoogleAuth = function () {
    const coarsePointerQuery = typeof window.matchMedia === "function"
        ? window.matchMedia("(pointer: coarse)")
        : null;
    const hasCoarsePointer = coarsePointerQuery?.matches ?? false;
    const isMobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);

    return hasCoarsePointer || isMobileUserAgent;
};

export const getGoogleAuthErrorMessage = function (error: unknown) {
    const errorCode = typeof error === "object" && error !== null && "code" in error
        ? String((error as { code: unknown }).code)
        : "";

    const errorMessages: Record<string, string> = {
        "auth/popup-closed-by-user": "A Google bejelentkezési ablak bezárult a bejelentkezés befejezése előtt.",
        "auth/popup-blocked": "A böngésző blokkolta a Google bejelentkezési ablakot. Engedélyezd a felugró ablakokat, vagy próbáld újra.",
        "auth/cancelled-popup-request": "Egy másik Google bejelentkezési folyamat már elindult.",
        "auth/network-request-failed": "Hálózati hiba történt. Ellenőrizd az internetkapcsolatot.",
        "auth/account-exists-with-different-credential": "Ezzel az e-mail címmel már létezik fiók másik bejelentkezési móddal.",
        "auth/operation-not-allowed": "A Google bejelentkezés nincs engedélyezve ebben a Firebase projektben.",
        "auth/unauthorized-domain": "Ez a domain nincs engedélyezve a Firebase Authentication beállításai között."
    };

    return errorMessages[errorCode] ?? "Ismeretlen hiba történt a Google bejelentkezés során.";
};
