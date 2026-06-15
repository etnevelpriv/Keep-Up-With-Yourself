import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, type UserCredential, signOut, sendPasswordResetEmail, reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider, onAuthStateChanged, type User, GoogleAuthProvider } from "firebase/auth";
import { createUserDocumentInDatabase, getUserDocumentFromDatabase } from '../../../services/user/user.service';
import { loginWithEmail, loginWithGoogle, registerWithEmail, sendPasswordReset, signOutUser, deleteCurrentUserAccount, getAuthUserWhenReady, sendEmailVerificationToUser, getAuthUser, reauthenticateCurrentUser, getProvider, syncOwnVerificationStatus } from '../../../services/auth/auth.service';
import { type Firestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { AppError } from '../../../models/AppError';

let mockCurrentUser: any = null;
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
    reauthenticateWithCredential: vi.fn(),
    reauthenticateWithPopup: vi.fn(),
    EmailAuthProvider: { credential: vi.fn(() => ({ credential: "TESZT_CREDENTIAL" })) },
    onAuthStateChanged: vi.fn(),
}));
vi.mock("../../../services/user/user.service.ts", () => ({
    createUserDocumentInDatabase: vi.fn(),
    getUserDocumentFromDatabase: vi.fn(),
    deleteUserDocumentFromDatabase: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    getDoc: vi.fn()
}));
vi.mock("firebase/functions", () => ({
    getFunctions: vi.fn(() => { return {} }),
    httpsCallable: vi.fn(),
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
            uid: "TESZT_UID",
            reload: () => { },
            getIdToken: () => { }
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
    test("VALID loginWithGoogle teszt, ahol mar letezik a user", async () => {
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
    test("VALID loginWithGoogle teszt, ahol meg nem letezik a user", async () => {
        const db: Firestore = {} as Firestore;
        const firebaseUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "NEV"
        };
        vi.mocked(signInWithPopup).mockResolvedValue({
            user: firebaseUser
        } as UserCredential);
        vi.mocked(getUserDocumentFromDatabase).mockResolvedValue(null)

        await loginWithGoogle(db)
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).toHaveBeenCalledWith(db, firebaseUser.uid);
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, expect.any(Date), true);
    });
    test("VALID sendPasswordReset teszt", async () => {
        vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined);
        await sendPasswordReset("tesztemail@gmail.com");
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }), "tesztemail@gmail.com");
    });
    test("VALID singOutUser teszt", async () => {
        vi.mocked(signOut).mockResolvedValue(undefined);
        await signOutUser();
        expect(signOut).toHaveBeenCalledWith(expect.objectContaining({ teszt: "teszt" }));
    });
    test("VALID getAuthUser teszt", () => {
        mockCurrentUser = { uid: "TESZT_UID" }
        expect(getAuthUser()).toEqual({ uid: "TESZT_UID" })
    });
    test("VALID sendEmailVerificationToUser teszt", async () => {
        const user: User = { uid: "TESZT_UID" } as User;
        await sendEmailVerificationToUser(user);
        expect(sendEmailVerification).toHaveBeenCalledWith({ uid: "TESZT_UID" }, {
            url: 'https://keepupwithyourself.hu/pages/create.html',
            handleCodeInApp: true,
        })
    });
    test("VALID loginWithGoogle teszt, ahol az email null", async () => {
        const db: Firestore = {} as Firestore;
        const firebaseUser = {
            uid: "TESZT_UID",
            email: null,
            displayName: "NEV"
        };

        vi.mocked(signInWithPopup).mockResolvedValue({
            user: firebaseUser
        } as any);
        vi.mocked(getUserDocumentFromDatabase).mockResolvedValue(null);

        await loginWithGoogle(db);
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).toHaveBeenCalledWith(db, firebaseUser.uid);
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, expect.any(Date), true);
    });
    test("VALID loginWithGoogle teszt, ahol az nev null", async () => {
        const db: Firestore = {} as Firestore;
        const firebaseUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: null
        };

        vi.mocked(signInWithPopup).mockResolvedValue({
            user: firebaseUser
        } as any);
        vi.mocked(getUserDocumentFromDatabase).mockResolvedValue(null);

        await loginWithGoogle(db);
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).toHaveBeenCalledWith(db, firebaseUser.uid);
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, expect.any(Date), true);
    });
    test("VALID loginWithGoogle teszt, ahol a nev es az email null", async () => {
        const db: Firestore = {} as Firestore;
        const firebaseUser = {
            uid: "TESZT_UID",
            email: null,
            displayName: null
        };

        vi.mocked(signInWithPopup).mockResolvedValue({
            user: firebaseUser
        } as any);
        vi.mocked(getUserDocumentFromDatabase).mockResolvedValue(null);

        await loginWithGoogle(db);
        expect(signInWithPopup).toHaveBeenCalled();
        expect(getUserDocumentFromDatabase).toHaveBeenCalledWith(db, firebaseUser.uid);
        expect(createUserDocumentInDatabase).toHaveBeenCalledWith(db, firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, expect.any(Date), true);
    });
    test("VALID getAuthUserWhenReady teszt", async () => {
        const user = {
            uid: "TESZT_UID"
        };
        const unsubscribe = vi.fn();
        vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback: any) => {
            queueMicrotask(() => callback(user));
            return unsubscribe;
        });
        await expect(getAuthUserWhenReady()).resolves.toEqual(user);
        expect(unsubscribe).toHaveBeenCalled();
    });
    test("VALID getProvider teszt password providerrrel", async () => {
        mockCurrentUser = {
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "password"
            })
        };
        expect(await getProvider()).toBe("password");
    });
    test("VALID getProvider teszt google providerrrel", async () => {
        mockCurrentUser = {
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "google.com"
            })
        };
        expect(await getProvider()).toBe("google.com");
    });
    test("VALID reauthenticateCurrentUser teszt password providerrel, ahol van megadva jelszo", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "password"
            })
        };
        const password = "Password123!";
        await reauthenticateCurrentUser(password);
        expect(await getProvider()).toBe("password");
        expect(getAuthUser()).toBe(mockCurrentUser);
        expect(EmailAuthProvider.credential).toHaveBeenCalledWith(mockCurrentUser.email, password);
        expect(reauthenticateWithCredential).toHaveBeenCalledWith(mockCurrentUser, { credential: "TESZT_CREDENTIAL" });
    });
    test("VALID reauthenticateCurrentUser teszt google providerrel", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "google.com"
            })
        };
        await reauthenticateCurrentUser();
        expect(await getProvider()).toBe("google.com");
        expect(getAuthUser()).toBe(mockCurrentUser);
        expect(GoogleAuthProvider).toHaveBeenCalled();
        expect(reauthenticateWithPopup).toHaveBeenCalled();
    });
    test("VALID deleteCurrentUserAccount teszt, ahol a provider password", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "password"
            })
        };
        const mockedDeleteCuurentUserCompletely = vi.fn().mockResolvedValue(undefined);
        vi.mocked(httpsCallable).mockReturnValue(mockedDeleteCuurentUserCompletely as any)
        const password = "Password123!";
        await deleteCurrentUserAccount(password);
        expect(EmailAuthProvider.credential).toHaveBeenCalledWith(mockCurrentUser.email, password);
        expect(getFunctions).toHaveBeenCalled();
        expect(httpsCallable).toHaveBeenCalledWith({}, "deleteCurrentUserCompletely");
        expect(mockedDeleteCuurentUserCompletely).toHaveBeenCalled();
    });
    test("VALID deleteCurrentUserAccount teszt, ahol a provider google", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "google.com"
            })
        };
        const mockedDeleteCuurentUserCompletely = vi.fn().mockResolvedValue(undefined);
        vi.mocked(httpsCallable).mockReturnValue(mockedDeleteCuurentUserCompletely as any)
        await deleteCurrentUserAccount();
        expect(reauthenticateWithPopup).toHaveBeenCalled();
        expect(getFunctions).toHaveBeenCalled();
        expect(httpsCallable).toHaveBeenCalledWith({}, "deleteCurrentUserCompletely");
        expect(mockedDeleteCuurentUserCompletely).toHaveBeenCalled();
    });
    test("VALID syncOwnVerificationStatus teszt", async () => {
        const mockedSyncOwnVerificationStatus = vi.fn().mockResolvedValue(undefined);
        vi.mocked(httpsCallable).mockReturnValue(mockedSyncOwnVerificationStatus as any)
        await syncOwnVerificationStatus();
        expect(getFunctions).toHaveBeenCalled();
        expect(httpsCallable).toHaveBeenCalledWith({}, "syncOwnVerificationStatus");
        expect(mockedSyncOwnVerificationStatus).toHaveBeenCalled();
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
            uid: "TESZT_UID",
            reload: () => { },
            getIdToken: () => { }
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
            uid: "TESZT_UID",
            reload: () => { },
            getIdToken: () => { }
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
        vi.mocked(getUserDocumentFromDatabase).mockResolvedValue(null);
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
    test("INVALID sendEmailVerificationToUser teszt", async () => {
        const user: User = { uid: "TESZT_UID" } as User;
        vi.mocked(sendEmailVerification).mockRejectedValue(new Error("Firebase sendEmailVerification hiba"))
        await expect(sendEmailVerificationToUser(user)).rejects.toThrow("Firebase sendEmailVerification hiba");
        expect(sendEmailVerification).toHaveBeenCalledWith({ uid: "TESZT_UID" }, {
            url: 'https://keepupwithyourself.hu/pages/create.html',
            handleCodeInApp: true,
        })
    });
    test("INVALID getAuthUserWhenReady teszt", async () => {
        const unsubscribe = vi.fn();
        vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback: any) => {
            queueMicrotask(() => callback());
            return unsubscribe;
        });
        await expect(getAuthUserWhenReady()).rejects.toThrow("appAuth/no-current-auth-user");
        expect(unsubscribe).toHaveBeenCalled();
    });
    test("INVALID reauthenticateCurrentUser teszt password providerrel, ahol nincs megadva jelszo", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "password"
            })
        };
        await expect(reauthenticateCurrentUser()).rejects.toThrow("appAuth/password-required");
        expect(await getProvider()).toBe("password");
        expect(getAuthUser()).toBe(mockCurrentUser);
        expect(EmailAuthProvider.credential).not.toHaveBeenCalled();
        expect(reauthenticateWithCredential).not.toHaveBeenCalled();
    });
    test("INVALID reauthenticateCurrentUser teszt password providerrel, ahol nincs email", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "password"
            })
        };
        const password = "Password123!"
        await expect(reauthenticateCurrentUser(password)).rejects.toThrow("appAuth/no-email");
        expect(await getProvider()).toBe("password");
        expect(getAuthUser()).toBe(mockCurrentUser);
        expect(EmailAuthProvider.credential).not.toHaveBeenCalled();
        expect(reauthenticateWithCredential).not.toHaveBeenCalled();
    });
    test("INVALID reauthenticateCurrentUser teszt nem megfelelo providerrel", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "facebook.com"
            })
        };
        await expect(reauthenticateCurrentUser()).rejects.toThrow("appAuth/unsupported-provider");
        expect(await getProvider()).toBe("facebook.com");
        expect(getAuthUser()).toBe(mockCurrentUser);
        expect(EmailAuthProvider.credential).not.toHaveBeenCalled();
        expect(reauthenticateWithCredential).not.toHaveBeenCalled();
    });
    test("INVALID deleteCurrentUserAccount teszt, ahol a reauthenticate elbukik", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "password"
            })
        };
        const mockedDeleteCuurentUserCompletely = vi.fn().mockResolvedValue(undefined);
        vi.mocked(httpsCallable).mockReturnValue(mockedDeleteCuurentUserCompletely as any)
        await expect(deleteCurrentUserAccount()).rejects.toThrow("appAuth/password-required");
        expect(getFunctions).not.toHaveBeenCalled();
        expect(httpsCallable).not.toHaveBeenCalled();
        expect(mockedDeleteCuurentUserCompletely).not.toHaveBeenCalled();
    });
    test("INVALID deleteCurrentUserAccount teszt, ahol a getFunctions elbukik", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "password"
            })
        };
        const password = "Password123!"
        const mockedDeleteCuurentUserCompletely = vi.fn().mockResolvedValue(undefined);
        vi.mocked(httpsCallable).mockReturnValue(mockedDeleteCuurentUserCompletely as any)
        vi.mocked(getFunctions).mockImplementation(() => { throw new AppError("getFunctions hiba") })
        await expect(deleteCurrentUserAccount(password)).rejects.toThrow("getFunctions hiba");
        expect(getFunctions).toHaveBeenCalled();
        expect(httpsCallable).not.toHaveBeenCalled();
        expect(mockedDeleteCuurentUserCompletely).not.toHaveBeenCalled();
    });
    test("INVALID deleteCurrentUserAccount teszt, ahol httpsCallable functionje elbukik", async () => {
        mockCurrentUser = {
            uid: "TESZT_UID",
            email: "tesztemail@gmail.com",
            displayName: "Teszt Nev",
            getIdTokenResult: vi.fn().mockResolvedValue({
                signInProvider: "password"
            })
        };
        const mockedDeleteCuurentUserCompletely = vi.fn().mockRejectedValue(new AppError("cloud function hiba"));
        vi.mocked(httpsCallable).mockReturnValue(mockedDeleteCuurentUserCompletely as any)
        const password = "Password123!";
        await expect(deleteCurrentUserAccount(password)).rejects.toThrow("cloud function hiba");
        expect(EmailAuthProvider.credential).toHaveBeenCalledWith(mockCurrentUser.email, password);
        expect(getFunctions).toHaveBeenCalled();
        expect(httpsCallable).toHaveBeenCalledWith({}, "deleteCurrentUserCompletely");
    });
    test("INVALID getAuthUser teszt, ahol a nincs user", () => {
        expect(() => getAuthUser()).toThrow("appAuth/no-current-auth-user")
    });
    test("INVALID getProvider, ahol nincs currentUser", async () => {
        mockCurrentUser = null;
        await expect(getProvider()).rejects.toThrow("appAuth/no-current-auth-user");
    });
    test("INVALID syncOwnVerificationStatus teszt, ahol httpsCallable functionje elbukik", async () => {
        const mockedDeleteCuurentUserCompletely = vi.fn().mockRejectedValue(new AppError("cloud function hiba"));
        vi.mocked(httpsCallable).mockReturnValue(mockedDeleteCuurentUserCompletely as any)
        await expect(syncOwnVerificationStatus()).rejects.toThrow("cloud function hiba");
        expect(getFunctions).toHaveBeenCalled();
        expect(httpsCallable).toHaveBeenCalledWith({}, "syncOwnVerificationStatus");
    });
    test("INVALID syncOwnVerificationStatus teszt, ahol getFunctions elbukik", async () => {
        const mockedSyncOwnVerificationStatus = vi.fn().mockResolvedValue(undefined);
        vi.mocked(httpsCallable).mockReturnValue(mockedSyncOwnVerificationStatus as any)
        vi.mocked(getFunctions).mockImplementation(() => { throw new AppError("getFunctions hiba") })
        await expect(syncOwnVerificationStatus()).rejects.toThrow("getFunctions hiba");
        expect(getFunctions).toHaveBeenCalled();
        expect(httpsCallable).not.toHaveBeenCalled();
        expect(mockedSyncOwnVerificationStatus).not.toHaveBeenCalled();
    });
});
