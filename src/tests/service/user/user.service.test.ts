import { expect, test, describe, vi, beforeEach } from 'vitest';
import { doc, getDoc, updateDoc, setDoc, deleteDoc, type Firestore } from "firebase/firestore";
import { createUserDocumentInDatabase, updateUserDocumentInDatabase, getUserDocumentFromDatabase, deleteUserDocumentFromDatabase } from '../../../services/user/user.service';

vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
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
        vi.mocked(doc).mockReturnValue({
            uid: "TESZT_UID"
        } as any);
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
});
