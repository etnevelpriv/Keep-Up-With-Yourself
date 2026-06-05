import { describe, test, expect } from "vitest";
import { FirebaseError } from "firebase/app";
import { AppError } from "../../../models/AppError";
import { getErrorMessage } from "../../../utils/errors/getErrorMessage";

describe("getErrorMessage Unit Teszt", () => {
    test("AppError User validation hibakoddal megfeleloen van kezelve a hiba", () => {
        expect(getErrorMessage(new AppError("validation/invalid-email"))).toBe("Az e-mail cím nincs megfelelően megadva.")
    });
    test("AppError Task validation hibakoddal megfeleloen van kezelve a hiba", () => {
        expect(getErrorMessage(new AppError("validation/invalid-task-name"))).toBe("A feladat neve érvénytelen.")
    });
    test("FirebaseError Auth hibakoddal megfeleloen van kezelve a hiba", () => {
        expect(getErrorMessage(new FirebaseError("auth/email-already-in-use", "eredeti firebase auth error message"))).toBe("Ezzel az e-mail címmel már létezik felhasználói fiók.")
    });
    test("FirebaseError Firestore hibakoddal megfeleloen van kezelve a hiba", () => {
        expect(getErrorMessage(new FirebaseError("permission-denied", "eredeti firestore error message"))).toBe("Nincs jogosultságod ehhez a művelethez.")
    });
    test("Expliciten unknown hibakoddal megfeleloen van kezelve a hiba", () => {
        expect(getErrorMessage(new AppError("unknown"))).toBe("Ismeretlen hiba történt.")
    });
    test("Ismeretlen hibakoddal megfeleloen van kezelve a hiba", () => {
        expect(getErrorMessage(new AppError("nincsilyen/hibakod"))).toBe("Ismeretlen hiba történt.")
    });
    test("Error hibakoddal megfeleloen van kezelve a hiba", () => {
        expect(getErrorMessage(new Error("valamiRandomError"))).toBe("Ismeretlen hiba történt.")
    });
    test("FirebaseError hibakoddal megfeleloen van kezelve a hiba", () => {
        expect(getErrorMessage(new FirebaseError("nemismert/firebaseerror", "eredeti ismeretlen message"))).toBe("Ismeretlen hiba történt.")
    });
});