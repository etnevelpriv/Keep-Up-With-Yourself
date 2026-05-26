import { expect, test, describe } from 'vitest'
import createTestUser from '../modelsTests/userTestSetup'
import { createUser, getUser, updateUser, deleteUser } from '../../repositories/user.repository';
import { getAuthenticatedDb } from './setup/userTestDb';
import { afterAllSetup, beforeAllSetup, beforeEachSetup } from './setup/firebaseTestSetup';
beforeAllSetup()
beforeEachSetup()
afterAllSetup()

describe("User Repository (service klon) Integration teszt", () => {
    test("User dokumentum lerehozasa es lekerese", async () => {
        const user = createTestUser();
        const email = "lekeresteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified)
        await createUser(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        const dbUser = await getUser(authenticatedDb as any, uid);
        expect(dbUser).not.toBe(false);
    });
    test("User dokumentum letrehozasa, modositasa es olvasasa", async () => {
        const user = createTestUser();
        const email = "modositasteszt@gmail.com";
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
    test("User dokumentum letrehozasa es torlese", async () => {
        const user = createTestUser();
        const email = "torlesteszt@gmail.com";
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