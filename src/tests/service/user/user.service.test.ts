import { expect, test, describe, vi, beforeEach } from 'vitest';
import { doc, getDoc, updateDoc, setDoc, deleteDoc, type Firestore } from "firebase/firestore";
import { syncUserVerificationStatus, createUserDocumentInDatabase, updateUserDocumentInDatabase, getUserDocumentFromDatabase, deleteUserDocumentFromDatabase } from '../../../services/user/user.service';

vi.mock("firebase/firestore", () => ({
    doc: vi.fn(() => ({ uid: "TESZT_UID" })),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
}));
beforeEach(() => {
    vi.resetAllMocks();
});
describe("VALID User Service Mock teszt", () => {
    test("VALID syncUserVerificationStatus teszt", async () => {
        const db: Firestore = {} as Firestore;

        await syncUserVerificationStatus(db, "TESZT_UID");
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(updateDoc).toHaveBeenCalledWith({ uid: "TESZT_UID" }, {
            userVerified: true
        });
    });
    test("VALID createUserDocumentInDatabase teszt", async () => {
        const db: Firestore = {} as Firestore;
        const createdAt = new Date()

        await createUserDocumentInDatabase(db, "TESZT_UID", "teszt@gmail.com", "NEV", createdAt, false);
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(setDoc).toHaveBeenCalledWith({ uid: "TESZT_UID" }, {
            userID: "TESZT_UID",
            userEmail: "teszt@gmail.com",
            userName: "NEV",
            userCreatedAt: createdAt,
            userVerified: false,
            taskTypes: ["Tanulás", "Munka", "Takarítás"]
        });
    });
    test("VALID updateUserDocumentInDatabase teszt", async () => {
        const db: Firestore = {} as Firestore;

        await updateUserDocumentInDatabase(db, "TESZT_UID", { nev: "Nev" });
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(updateDoc).toHaveBeenCalledWith({ uid: "TESZT_UID" }, { nev: "Nev" });
    });
    test("VALID getUserDocumentFromDatabase teszt, ahol docsnap letezik", async () => {
        const db: Firestore = {} as Firestore;

        vi.mocked(getDoc).mockResolvedValue({
            exists: () => { return true },
            data: () => { return { uid: "TESZT_UID", name: "NEV" } }
        } as any)
        expect(await getUserDocumentFromDatabase(db, "TESZT_UID")).toEqual({
            uid: "TESZT_UID",
            name: "NEV"
        });
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(getDoc).toHaveBeenCalledWith({
            uid: "TESZT_UID"
        });
    });
    test("VALID getUserDocumentFromDatabase teszt, ahol docsnap nem letezik", async () => {
        const db: Firestore = {} as Firestore;

        vi.mocked(getDoc).mockResolvedValue({
            exists: () => { return false },
            data: () => { return { uid: "TESZT_UID", name: "NEV" } }
        } as any)
        expect(await getUserDocumentFromDatabase(db, "TESZT_UID")).toEqual(false);
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(getDoc).toHaveBeenCalledWith({
            uid: "TESZT_UID"
        });
    });
    test("VALID deleteUserDocumentFromDatabase teszt", async () => {
        const db: Firestore = {} as Firestore;

        await deleteUserDocumentFromDatabase(db, "TESZT_UID");
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(deleteDoc).toHaveBeenCalledWith({ uid: "TESZT_UID" });
    });
});
