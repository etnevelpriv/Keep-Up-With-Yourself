import { expect, test, describe } from 'vitest'
import createTestUser from '../../modelsTests/userTestSetup'
import { createUserDocumentInDatabase, getUserDocumentFromDatabase } from '../../../services/user/user.service'

describe("User Service Integration teszt", () =>{
    test("User dokumentum lerehozasa es lekerese", async () =>{
        const user = createTestUser();
        const uid = "TEST_USER_ID"
        await createUserDocumentInDatabase(uid, user.email, user.name, user.createdAt, user.verified);
        const dbUser = await getUserDocumentFromDatabase(uid);
        expect(dbUser).not.toBe(false);
    });
});