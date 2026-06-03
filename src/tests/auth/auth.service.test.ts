import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createUserWithEmailAndPassword, sendEmailVerification, type UserCredential } from "firebase/auth";
import { createUserDocumentInDatabase } from '../../services/user/user.service';
import { registerWithEmail } from '../../services/auth/auth.service';
import type { Firestore } from "firebase/firestore";

vi.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: vi.fn(),
    sendEmailVerification: vi.fn(),
    getAuth: vi.fn(() => { return { teszt: "teszt" } })
}));
vi.mock("../../services/user/user.service.ts", () => ({
    createUserDocumentInDatabase: vi.fn()
}));

describe("VALID Auth Service Mock Teszt", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    test("VALID registerWithEmail teszt", async () => {
        const db: Firestore = {} as Firestore;
        const date: Date = new Date();
        const firebaseUser = {
            uid: "TESZT_UID"
        };
        vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
            user: firebaseUser
        } as UserCredential);
        vi.mocked(createUserDocumentInDatabase).mockResolvedValue(undefined);
        vi.mocked(sendEmailVerification).mockResolvedValue(undefined);
        await registerWithEmail(db, "TesztUser", "teszt@gmail.hu", "Jelszo123!", date, false);

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({ teszt: "teszt" }, "teszt@gmail.hu", "Jelszo123!");
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, "TESZT_UID", "teszt@gmail.hu", "TesztUser", date, false);
        expect(sendEmailVerification).toHaveBeenCalledWith(
            firebaseUser,
            {
                "handleCodeInApp": true,
                "url": "https://keepupwithyourself.hu/pages/create.html"
            }
        );
    });
});
describe("INVALID Auth Service Mock Teszt", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    test("INVALID registerWithEmail teszt", async () => {
        const db: Firestore = {} as Firestore;
        const date: Date = new Date();
        vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(new Error("Firebase register hiba"));

        await expect(registerWithEmail(db, "TesztUser", "teszt@gmail.hu", "Jelszo123!", date, false)).rejects.toThrow("Firebase register hiba");
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({ teszt: "teszt" }, "teszt@gmail.hu", "Jelszo123!");
        expect(createUserDocumentInDatabase).not.toHaveBeenCalled();
        expect(sendEmailVerification).not.toHaveBeenCalled();
    });
});
