import { expect, test, describe, vi, beforeEach } from 'vitest';
import { doc, getDoc, updateDoc, setDoc, type Firestore } from "firebase/firestore";
import { createUserDocumentInDatabase, updateUserDocumentInDatabase, getUserDocumentFromDatabase } from '../../../services/user/user.service';

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
        expect(await getUserDocumentFromDatabase(db, "TESZT_UID")).toEqual(null);
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(getDoc).toHaveBeenCalledWith({
            uid: "TESZT_UID"
        
        });
    });
});
describe("INVALID User Service Mock Teszt", () => {
    test("INVALID createUserDocumentInDatabase teszt", async () => {
        const db: Firestore = {} as Firestore;
        const createdAt = new Date()
        vi.mocked(setDoc).mockRejectedValue(new Error("Firestore set hiba"));

        await expect(createUserDocumentInDatabase(db, "TESZT_UID", "teszt@gmail.com", "NEV", createdAt, false)).rejects.toThrow("Firestore set hiba");
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
    test("INVALID updateUserDocumentInDatabase teszt", async () => {
        const db: Firestore = {} as Firestore;
        vi.mocked(updateDoc).mockRejectedValue(new Error("Firestore update hiba"));

        await expect(updateUserDocumentInDatabase(db, "TESZT_UID", { nev: "Nev" })).rejects.toThrow("Firestore update hiba");
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(updateDoc).toHaveBeenCalledWith({ uid: "TESZT_UID" }, { nev: "Nev" });
    });
    test("INVALID getUserDocumentFromDatabase teszt", async () => {
        const db: Firestore = {} as Firestore;
        vi.mocked(getDoc).mockRejectedValue(new Error("Firestore get hiba"));

        await expect(getUserDocumentFromDatabase(db, "TESZT_UID")).rejects.toThrow("Firestore get hiba")
        expect(doc).toHaveBeenCalledWith(db, "users", "TESZT_UID");
        expect(getDoc).toHaveBeenCalledWith({
            uid: "TESZT_UID"
        });
    });
});
