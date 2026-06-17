import { expect, test, describe } from 'vitest'
import createTestUser from './setup/userTestIntegrationSetup'
import { getAuthenticatedDb } from './setup/userTestDb';
import { afterAllSetup, beforeAllSetup, beforeEachSetup, testEnv } from './setup/firebaseTestSetup';
import { assertFails } from '@firebase/rules-unit-testing';
import { createUserDocumentInDatabase, updateUserDocumentInDatabase, getUserDocumentFromDatabase } from '../../services/user/user.service';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
beforeAllSetup()
beforeEachSetup()
afterAllSetup()

describe("VALID User Integration teszt", () => {
    test("VALID User dokumentum lerehozasa es lekerese", async () => {
        const user = createTestUser();
        const email = "userlekeresteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified)
        await createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        const dbUser = await getUserDocumentFromDatabase(authenticatedDb as any, uid);
        expect(dbUser).not.toBe(null);
    });
    test("VALID User dokumentum letrehozasa, modositasa es lekerese", async () => {
        const user = createTestUser();
        const email = "usermodositasteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified)
        await createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        await updateUserDocumentInDatabase(authenticatedDb as any, uid, {
            userName: "updatedUserName"
        })
        const dbUser = await getUserDocumentFromDatabase(authenticatedDb as any, uid);
        expect(dbUser).not.toBe(null);
        expect((dbUser as any).userName).toBe("updatedUserName");
    });
});

describe("INVALID User Integration teszt", () => {
    test("INVALID userCreatedAt nem lehet jovoben", async () => {
        const user = createTestUser({
            createdAt: new Date(Date.now() + 1000 * 60 * 60)
        });
        const email = "userfuturecreatedatteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified));
    });
    test("INVALID user taskTypes mezot ervenytelen tipussal nem lehet menteni", async () => {
        const user = createTestUser();
        const email = "usertasktypeshibateszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        await assertFails(updateUserDocumentInDatabase(authenticatedDb as any, uid, {
            taskTypes: "nemLista" as any
        }));
    });
    test("INVALID plusz mezo nem maradhat user dokumentumban", async () => {
        const user = createTestUser();
        const email = "userextramezoteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, user.verified);
        await assertFails(updateUserDocumentInDatabase(authenticatedDb as any, uid, {
            extraField: true
        } as any));
    });
    test("INVALID nem autentikalt felhasznalo nem hozhat letre user dokumentumot", async () => {
        const user = createTestUser();
        const email = "userauthnincsteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const unauthenticatedDb = testEnv.unauthenticatedContext().firestore();
        await assertFails(createUserDocumentInDatabase(unauthenticatedDb as any, uid, email, user.name, user.createdAt, user.verified));
    });
    test("INVALID mas user nem olvashat user dokumentumot", async () => {
        const user = createTestUser();
        const ownerEmail = "userownerreadteszt@gmail.com";
        const attackerEmail = "userattackerreadteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const ownerAuthenticatedDb = getAuthenticatedDb(ownerUid, ownerEmail, user.verified);
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        await createUserDocumentInDatabase(ownerAuthenticatedDb as any, ownerUid, ownerEmail, user.name, user.createdAt, user.verified);
        await assertFails(getUserDocumentFromDatabase(attackerAuthenticatedDb as any, ownerUid));
    });
    test("INVALID mas user nem modosithat user dokumentumot", async () => {
        const user = createTestUser();
        const ownerEmail = "userownerupdateteszt@gmail.com";
        const attackerEmail = "userattackerupdateteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const ownerAuthenticatedDb = getAuthenticatedDb(ownerUid, ownerEmail, user.verified);
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        await createUserDocumentInDatabase(ownerAuthenticatedDb as any, ownerUid, ownerEmail, user.name, user.createdAt, user.verified);
        await assertFails(updateUserDocumentInDatabase(attackerAuthenticatedDb as any, ownerUid, {
            userName: "updatedUserName"
        }));
    });
    test("INVALID user nem torolhet fiokot a kliensrol", async () => {
        const user = createTestUser();
        const email = "torleskliensroltiltott@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true);
        await assertFails(deleteDoc(doc(authenticatedDb, "users", uid)));
    });
    test("INVALID userVerified nem egyezik az auth tokennel", async () => {
        const user = createTestUser();
        const email = "userverifiedteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, false);
        await assertFails(createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true));
    });
    test("INVALID userEmail nem egyezik az auth token emaillel", async () => {
        const user = createTestUser();
        const email = "useremailnemegyezikatokennel@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, "masikemailt@gmail.com", true);
        await assertFails(createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true));
    });
    test("INVALID userID nem egyezik az auth token emaillel", async () => {
        const user = createTestUser();
        const email = "useridnemegyezikatokennel@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(crypto.randomUUID(), email, true);
        await assertFails(createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true));
    });
    test("INVALID userName tul hosszu", async () => {
        const user = createTestUser({ name: `${("A").repeat(31)}` });
        const email = "usernametulhosszu@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await assertFails(createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true));
    });
    test("INVALID userName ures", async () => {
        const user = createTestUser({ name: "" });
        const email = "usernameures@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await assertFails(createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true));
    });
    test("INVALID userName ures (spaceket tartalmaz)", async () => {
        const user = createTestUser({ name: "   " });
        const email = "usernameuresspace@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await assertFails(createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true));
    });
    test("INVALID userCreatedAt modositasa", async () => {
        const user = createTestUser();
        const email = "userCreatedAtModositasa@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true);
        await assertFails(updateUserDocumentInDatabase(authenticatedDb as any, uid, { userCreatedAt: new Date(2012, 9, 9) }))
    });
    test("INVALID email modositasa", async () => {
        const user = createTestUser();
        const email = "userEmailModositasa@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true);
        await assertFails(updateUserDocumentInDatabase(authenticatedDb as any, uid, { userEmail: "ujemail@gmail.com" }))
    });
    test("INVALID userID modositasa", async () => {
        const user = createTestUser();
        const email = "userIDModositasa@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true);
        await assertFails(updateUserDocumentInDatabase(authenticatedDb as any, uid, { userID: "ujID" }))
    });
    test("INVALID userEmail nem email formatumu", async () => {
        const user = createTestUser();
        const email = "nemvalidemail.";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await assertFails(createUserDocumentInDatabase(authenticatedDb as any, uid, email, user.name, user.createdAt, true))
    });
    test("INVALID hianyo mezo", async () => {
        const user = createTestUser();
        const email = "hianyzomezo@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, true);
        await assertFails(setDoc(doc(authenticatedDb as any, "users", uid), {
            userID: uid,
            userEmail: email,
            userCreatedAt: user.createdAt,
            userVerified: true,
            taskTypes: ["Tanulás", "Munka", "Takarítás"],
        } as any));
    });
    test("INVALID nem verifikalt user nem olvashatja a sajat dokumentumat", async ()=> {
        const user = createTestUser({verified:false});
        const email = "nemverifikaltolvassajat@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, false);
        await assertFails(getUserDocumentFromDatabase(authenticatedDb as any, uid))
    });
});
