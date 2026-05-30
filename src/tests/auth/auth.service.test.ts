import { expect, test, describe, vi } from 'vitest';
import { createUserWithEmailAndPassword, sendEmailVerification, type UserCredential } from "firebase/auth";
import { createUserDocumentInDatabase } from '../../services/user/user.service';
import { registerWithEmail } from '../../services/auth/auth.service';
import type { Firestore } from "firebase/firestore";

vi.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: vi.fn(),
    sendEmailVerification: vi.fn(),
    getAuth: vi.fn(() => {return {}})
}));
vi.mock("../../services/user/user.service.ts", () => ({
    createUserDocumentInDatabase: vi.fn()
}));

describe("VALID Auth Service Mock Teszt", () => {
    test("VALID registerWith email teszt", async () => {
        const db: Firestore = {} as Firestore;
        vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
            user: {
                uid: "TESZT_UID"
            }
        }as UserCredential);
        vi.mocked(createUserDocumentInDatabase).mockResolvedValue(undefined);
        vi.mocked(sendEmailVerification).mockResolvedValue(undefined);
        await registerWithEmail(db, "TesztUser", "teszt@gmail.hu", "Jelszo123!", new Date(), false);
        
        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
        expect(createUserDocumentInDatabase).toHaveBeenCalled();
        expect(sendEmailVerification).toHaveBeenCalled();
    });
});

