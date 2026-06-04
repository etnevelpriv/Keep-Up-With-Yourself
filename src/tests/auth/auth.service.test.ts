import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, type UserCredential, signOut, deleteUser, sendPasswordResetEmail } from "firebase/auth";
import { createUserDocumentInDatabase, getUserDocumentFromDatabase, deleteUserDocumentFromDatabase } from '../../services/user/user.service';
import { loginWithEmail, loginWithGoogle, registerWithEmail, sendPasswordReset, signOutUser, getCurrentUser } from '../../services/auth/auth.service';
import { type Firestore, doc, getDoc } from "firebase/firestore";

let mockCurrentUser : any = null;
vi.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: vi.fn(),
    sendEmailVerification: vi.fn(),
    getAuth: vi.fn(() => ({
        teszt: "teszt",
        useDeviceLanguage: vi.fn(),
        get currentUser() {
            return mockCurrentUser;
        }
    })),
    sendPasswordResetEmail: vi.fn(),
    signOut: vi.fn(),
    deleteUser: vi.fn(),
    GoogleAuthProvider: vi.fn(function () {
        return { addScope: vi.fn() }
    }),
    signInWithPopup: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
}));
vi.mock("../../services/user/user.service.ts", () => ({
    createUserDocumentInDatabase: vi.fn(),
    getUserDocumentFromDatabase: vi.fn(),
    deleteUserDocumentFromDatabase: vi.fn()
}));
vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    getDoc: vi.fn()
}));
beforeEach(() => {
    mockCurrentUser = null;
    vi.resetAllMocks();
});
describe("VALID Auth Service Mock Teszt", () => {
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
    test("VALID sendPasswordReset teszt))", async () => {
        vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined);
        await sendPasswordReset("tesztemail@gmail.com");
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "tesztemail@gmail.com");
    });
    test("VALID singOutUser teszt))", async () => {
        vi.mocked(signOut).mockResolvedValue(undefined);
        await signOutUser();
        expect(signOut).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }));
    });
});
describe("INVALID Auth Service Mock Teszt", () => {
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
    test("INVALID loginWithEmail teszt", async () => {
        vi.mocked(signInWithEmailAndPassword).mockRejectedValue(new Error("Login hiba"))
        await expect(loginWithEmail("teszt@gmail.hu", "Jelszo123")).rejects.toThrow("Login hiba");
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "teszt@gmail.hu", "Jelszo123");
    });

    test("INVALID loginWithGoogle teszt, ahol a signInWithPopup elbukik", async () => {
        const db: Firestore = {} as Firestore;

        vi.mocked(signInWithPopup).mockRejectedValue(new Error("Google login hiba"));

        await expect(loginWithGoogle(db)).rejects.toThrow("Google login hiba");
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).not.toHaveBeenCalled();
        expect(createUserDocumentInDatabase).not.toHaveBeenCalled();
    });

    test("INVALID loginWithGoogle teszt, ahol a getUserDocumentFromDatabase elbukik", async () => {
        const db: Firestore = {} as Firestore;
        const firebaseUser = {
            uid: "TESZT_UID"
        };

        vi.mocked(signInWithPopup).mockResolvedValue({
            user: firebaseUser
        } as UserCredential);
        vi.mocked(getUserDocumentFromDatabase).mockRejectedValue(new Error("Firestore get user hiba"));

        await expect(loginWithGoogle(db)).rejects.toThrow("Firestore get user hiba");
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).toHaveBeenCalledWith(db, firebaseUser.uid);
        expect(createUserDocumentInDatabase).not.toHaveBeenCalled();
    });

    test("INVALID loginWithGoogle teszt, ahol a createUserDocumentInDatabase elbukik", async () => {
        const db: Firestore = {} as Firestore;
        const firebaseUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "NEV"
        };

        vi.mocked(signInWithPopup).mockResolvedValue({
            user: firebaseUser
        } as UserCredential);
        vi.mocked(getUserDocumentFromDatabase).mockResolvedValue(false);
        vi.mocked(createUserDocumentInDatabase).mockRejectedValue(new Error("Firestore create user hiba"));

        await expect(loginWithGoogle(db)).rejects.toThrow("Firestore create user hiba");
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).toHaveBeenCalledWith(db, firebaseUser.uid);
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, expect.any(Date), true);
    });
    test("INVALID sendPasswordReset teszt))", async () => {
        vi.mocked(sendPasswordResetEmail).mockRejectedValue(new Error("Send reset hiba"));
        await expect(sendPasswordReset("tesztemail@gmail.com")).rejects.toThrow("Send reset hiba");
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "tesztemail@gmail.com");
    });
    test("INVALID signOutUser teszt))", async () => {
        vi.mocked(signOut).mockRejectedValue(new Error("Sign out hiba"));
        await expect(signOutUser()).rejects.toThrow("Sign out hiba");
        expect(signOut).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }));
    });
});
