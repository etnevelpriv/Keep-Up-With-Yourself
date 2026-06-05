import { describe, test, expect, vi, beforeEach } from "vitest";
import { AppError } from "../../../models/AppError";
import { handleUiError } from "../../../utils/errors/handleUiError";
import { showErrorPopUp } from "../../../utils/popup";
import { FirebaseError } from "firebase/app";

vi.mock("../../../utils/popup", () => ({
    showErrorPopUp: vi.fn()
}));

describe("handleUiError Unit Teszt", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    test("AppError eseten megfelelo hiba jelenik meg", () => {
        handleUiError(new AppError("validation/invalid-email"));
        expect(showErrorPopUp).toHaveBeenCalledWith("Az e-mail cím nincs megfelelően megadva.");
    });
    test("FirebaseError eseten megfelelo hiba jelenik meg", () => {
        handleUiError(new FirebaseError("auth/email-already-in-use", "Eredeti firebase error message"));
        expect(showErrorPopUp).toHaveBeenCalledWith("Ezzel az e-mail címmel már létezik felhasználói fiók.");
    });
    test("Ismeretlen FirebaseError eseten megfelelo hiba jelenik meg", () => {
        handleUiError(new FirebaseError("nincsilyen/hibakod", "Eredeti firebase error message"));
        expect(showErrorPopUp).toHaveBeenCalledWith("Ismeretlen hiba történt.");
    });
    test("Ismeretlen Error eseten megfelelo hiba jelenik meg", () => {
        handleUiError(new Error("ismeretlenHiba"));
        expect(showErrorPopUp).toHaveBeenCalledWith("Ismeretlen hiba történt.");
    });
});