import { expect, test, describe, vi } from 'vitest';
import { createUserWithEmailAndPassword, type Auth } from "firebase/auth";
vi.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: vi.fn()
}));

describe("Auth Service Mock Teszt", () => {
    test("firebase register mock", async () => {
        vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
            user: {
                uid: "TEST_UID"
            }
        } as any);
        const userCredential = await createUserWithEmailAndPassword({} as Auth, "test@gmail.com", "Jelszo123!");
        const user = userCredential.user;
        expect(user.uid).toBe("TEST_UID");
    });
});

