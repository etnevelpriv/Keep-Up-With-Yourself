import { describe, test, expect, vi, beforeEach } from "vitest";
import { AppError } from "../../../models/AppError";
import { handleUiError } from "../../../utils/errors/handleUiError";
import { showErrorPopUp } from "../../../utils/popup";

vi.mock("../../../utils/popup", () => ({
    showErrorPopUp: vi.fn()
}));

describe("Popup Unit Teszt", () => {
    beforeEach(()=>{
        vi.clearAllMocks();
    });
    test("Apperror eseteln megfelelo hiba jelenik meg", ()=>{
        handleUiError(new AppError("validation/invalid-email"));
        expect(showErrorPopUp).toHaveBeenCalledWith("Az e-mail cím nincs megfelelően megadva.");
    });
});