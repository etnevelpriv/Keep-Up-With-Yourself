import { expect, test, describe } from 'vitest'
import createTestUser from './userTestSetup';

describe("VALID User class tesztelese", () => {
    test("Valid adatokkal letrehozni a usert. Mindent ellenorizni", () => {
        const testUser = createTestUser();
        expect(testUser.name).toBe('TESZT USER NAME');
        expect(testUser.password).toBe('Password123!');
        expect(testUser.email).toBe('tesztuseremail@gmail.com');
        expect(testUser.createdAt.getTime()).toBe(new Date(2025,5,5).getTime());
        expect(testUser.verified).toBe(true);
    });
});
