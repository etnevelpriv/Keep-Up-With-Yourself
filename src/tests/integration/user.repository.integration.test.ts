import { expect, test, describe } from 'vitest'
import createTestUser from '../modelsTests/userTestSetup'
import { createUser, getUser } from '../../repositories/user.repository';
import { getAuthenticatedDb } from './setup/testDb';
import { afterAllSetup, beforeAllSetup, beforeEachSetup } from './setup/firebaseTestSetup';
beforeAllSetup()
beforeEachSetup()
afterAllSetup()

describe("User Repository (service klon) Integration teszt", () => {
    test("User dokumentum lerehozasa es lekerese", async () => {
        const user = createTestUser();
        const uid = "TEST_USER_ID"
        const authenticatedDb = getAuthenticatedDb(uid, user.email, user.verified)
        await createUser(authenticatedDb as any, uid, user.email, user.name, user.createdAt, user.verified);
        const dbUser = await getUser(authenticatedDb as any, uid);
        expect(dbUser).not.toBe(false);
    });
});
