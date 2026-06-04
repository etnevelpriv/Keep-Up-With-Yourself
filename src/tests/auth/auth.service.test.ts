import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, type UserCredential } from "firebase/auth";
import { createUserDocumentInDatabase, getUserDocumentFromDatabase } from '../../services/user/user.service';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../../services/auth/auth.service';
import type { Firestore } from "firebase/firestore";

vi.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: vi.fn(),
    sendEmailVerification: vi.fn(),
    getAuth: vi.fn(() => ({
        teszt: "teszt",
        useDeviceLanguage: vi.fn()
    })),
    GoogleAuthProvider: vi.fn(function () {
        return { addScope: vi.fn() }
    }),
    signInWithPopup: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
}));
vi.mock("../../services/user/user.service.ts", () => ({
    createUserDocumentInDatabase: vi.fn(),
    getUserDocumentFromDatabase: vi.fn()
}));

describe("VALID Auth Service Mock Teszt", () => {
    beforeEach(() => {
        vi.resetAllMocks();
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

        await registerWithEmail(db, "TesztUser", "teszt@gmail.hu", "Jelszo123!", date, false);
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "teszt@gmail.hu", "Jelszo123!");
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, "TESZT_UID", "teszt@gmail.hu", "TesztUser", date, false);
        expect(sendEmailVerification).toHaveBeenCalledWith(
            firebaseUser,
            {
                "handleCodeInApp": true,
                "url": "https://keepupwithyourself.hu/pages/create.html"
            }
        );
    });
    test("VALID loginWithEmail teszt", async () => {
        await loginWithEmail("teszt@gmail.hu", "Jelszo123");
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "teszt@gmail.hu", "Jelszo123");
    });
    test("VALID loginWithGoogle teszt (ahol mar letezik a user))", async () => {
        const db: Firestore = {} as Firestore;
        const firebaseUser = {
            uid: "TESZT_UID"
        };
        vi.mocked(signInWithPopup).mockResolvedValue({
            user: firebaseUser
        } as UserCredential);
        vi.mocked(getUserDocumentFromDatabase).mockResolvedValue({
            userID: "TESZT_UID"
        })

        await loginWithGoogle(db)
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).toHaveBeenCalledWith(db, firebaseUser.uid);
        expect(createUserDocumentInDatabase).not.toHaveBeenCalled();
    });
    test("VALID loginWithGoogle teszt (ahol meg nem letezik a user))", async () => {
        const db: Firestore = {} as Firestore;
        const firebaseUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "NEV"
        };
        vi.mocked(signInWithPopup).mockResolvedValue({
            user: firebaseUser
        } as UserCredential);
        vi.mocked(getUserDocumentFromDatabase).mockResolvedValue(false)

        await loginWithGoogle(db)
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).toHaveBeenCalledWith(db, firebaseUser.uid);
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, expect.any(Date), true);
    });
});
describe("INVALID Auth Service Mock Teszt", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    test("INVALID registerWithEmail teszt, ahol a createUserWithEmailAndPassword elbukik", async () => {
        const db: Firestore = {} as Firestore;
        const date: Date = new Date();
        vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(new Error("Firebase register hiba"));

        await expect(registerWithEmail(db, "TesztUser", "teszt@gmail.hu", "Jelszo123!", date, false)).rejects.toThrow("Firebase register hiba");
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "teszt@gmail.hu", "Jelszo123!");
        expect(createUserDocumentInDatabase).not.toHaveBeenCalled();
        expect(sendEmailVerification).not.toHaveBeenCalled();
    });
    test("INVALID registerWithEmail teszt, ahol a createUserDocumentInDatabase elbukik", async () => {
        const db: Firestore = {} as Firestore;
        const date: Date = new Date();
        const firebaseUser = {
            uid: "TESZT_UID"
        };
        vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
            user: firebaseUser
        } as UserCredential);
        vi.mocked(createUserDocumentInDatabase).mockRejectedValue(new Error("Firestore create hiba"))
        vi.mocked(sendEmailVerification).mockResolvedValue(undefined);

        await expect(registerWithEmail(db, "TesztUser", "teszt@gmail.hu", "Jelszo123!", date, false)).rejects.toThrow("Firestore create hiba");
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "teszt@gmail.hu", "Jelszo123!");
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, "TESZT_UID", "teszt@gmail.hu", "TesztUser", date, false);
        expect(sendEmailVerification).not.toHaveBeenCalled();
    });
    test("INVALID registerWithEmail teszt, ahol a sendVerificationEmail elbukik", async () => {
        const db: Firestore = {} as Firestore;
        const date: Date = new Date();
        const firebaseUser = {
            uid: "TESZT_UID"
        };
        vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
            user: firebaseUser
        } as UserCredential);
        vi.mocked(sendEmailVerification).mockRejectedValue(new Error("Firebase verification email hiba"))
        await expect(registerWithEmail(db, "TesztUser", "teszt@gmail.hu", "Jelszo123!", date, false)).rejects.toThrow("Firebase verification email hiba");
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "teszt@gmail.hu", "Jelszo123!");
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
