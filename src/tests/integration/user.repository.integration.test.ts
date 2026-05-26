import { expect, test, describe } from 'vitest'
import createTestUser from './setup/userTestIntegrationSetup'
import { createUser, getUser, updateUser, deleteUser } from '../../repositories/user.repository';
import { getAuthenticatedDb } from './setup/userTestDb';
import { afterAllSetup, beforeAllSetup, beforeEachSetup } from './setup/firebaseTestSetup';
beforeAllSetup()
beforeEachSetup()
afterAllSetup()

describe("VALID User Repository (service klon) Integration teszt", () => {
    test("VALID User dokumentum lerehozasa es lekerese", async () => {
        const user = createTestUser();
        const email = "userlekeresteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified)
        await createUser(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        const dbUser = await getUser(authenticatedDb as any, uid);
        expect(dbUser).not.toBe(false);
    });
    test("VALID User dokumentum letrehozasa, modositasa es lekerese", async () => {
        const user = createTestUser();
        const email = "usermodositasteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified)
        await createUser(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        await updateUser(authenticatedDb as any, uid, {
            userName: "updatedUserName"
        })
        const dbUser = await getUser(authenticatedDb as any, uid);
        expect(dbUser).not.toBe(false);
        expect((dbUser as any).userName).toBe("updatedUserName");
    });
    test("VALID User dokumentum letrehozasa es torlese", async () => {
        const user = createTestUser();
        const email = "usertorlesteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified)
        await createUser(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        const dbUser = await getUser(authenticatedDb as any, uid);
        expect(dbUser).not.toBe(false);
        await deleteUser(authenticatedDb as any, uid);
        const dbFalseUser = await getUser(authenticatedDb as any, uid);
        expect(dbFalseUser).toBe(false);
    });
});