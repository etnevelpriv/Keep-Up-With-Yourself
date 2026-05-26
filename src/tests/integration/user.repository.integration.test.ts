import { expect, test, describe } from 'vitest'
import createTestUser from './setup/userTestIntegrationSetup'
import { createUser, getUser, updateUser, deleteUser } from '../../repositories/user.repository';
import { getAuthenticatedDb } from './setup/userTestDb';
import { afterAllSetup, beforeAllSetup, beforeEachSetup, testEnv } from './setup/firebaseTestSetup';
import { assertFails } from '@firebase/rules-unit-testing';
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
describe("INVALID User Repository (service klon) Integration teszt", () => {
    test("INVALID userCreatedAt nem lehet jovoben", async () => {
        const user = createTestUser({
            createdAt: new Date(Date.now() + 1000 * 60 * 60)
        });
        const email = "userfuturecreatedatteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(createUser(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified));
    });
    test("INVALID user taskTypes mezot ervenytelen tipussal nem lehet menteni", async () => {
        const user = createTestUser();
        const email = "usertasktypeshibateszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await createUser(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        await assertFails(updateUser(authenticatedDb as any, uid, {
            taskTypes: "nemLista" as any
        }));
    });
    test("INVALID plusz mezo nem maradhat user dokumentumban", async () => {
        const user = createTestUser();
        const email = "userextramezoteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await createUser(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        await assertFails(updateUser(authenticatedDb as any, uid, {
            extraField: true
        } as any));
    });
    test("INVALID nem autentikalt felhasznalo nem hozhat letre user dokumentumot", async () => {
        const user = createTestUser();
        const email = "userauthnincsteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const unauthenticatedDb = testEnv.unauthenticatedContext().firestore();
        await assertFails(createUser(unauthenticatedDb as any, uid, email, user.name, user.createdAt, user.verified));
    });
    test("INVALID mas user nem olvashat user dokumentumot", async () => {
        const user = createTestUser();
        const ownerEmail = "userownerreadteszt@gmail.com";
        const attackerEmail = "userattackerreadteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const ownerAuthenticatedDb = getAuthenticatedDb(ownerUid, ownerEmail, user.verified);
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        await createUser(ownerAuthenticatedDb as any, ownerUid, ownerEmail, user.name, user.createdAt, user.verified);
        await assertFails(getUser(attackerAuthenticatedDb as any, ownerUid));
    });
    test("INVALID mas user nem modosithat user dokumentumot", async () => {
        const user = createTestUser();
        const ownerEmail = "userownerupdateteszt@gmail.com";
        const attackerEmail = "userattackerupdateteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const ownerAuthenticatedDb = getAuthenticatedDb(ownerUid, ownerEmail, user.verified);
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        await createUser(ownerAuthenticatedDb as any, ownerUid, ownerEmail, user.name, user.createdAt, user.verified);
        await assertFails(updateUser(attackerAuthenticatedDb as any, ownerUid, {
            userName: "updatedUserName"
        }));
    });
    test("INVALID mas user nem torolhet user dokumentumot", async () => {
        const user = createTestUser();
        const ownerEmail = "userownerdeleteteszt@gmail.com";
        const attackerEmail = "userattackerdeleteteteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const ownerAuthenticatedDb = getAuthenticatedDb(ownerUid, ownerEmail, user.verified);
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        await createUser(ownerAuthenticatedDb as any, ownerUid, ownerEmail, user.name, user.createdAt, user.verified);
        await assertFails(deleteUser(attackerAuthenticatedDb as any, ownerUid));
    });
    test("INVALID userVerified nem egyezik az auth tokennel", async () => {
        const user = createTestUser();
        const email = "userverifiedteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const athenticatedDb = getAuthenticatedDb(uid, email, false);
        await assertFails(createUser(athenticatedDb as any, uid, email, user.name, user.createdAt, true));
    });
});