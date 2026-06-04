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

});
describe("INVALID User Service Mock teszt", () => {

});