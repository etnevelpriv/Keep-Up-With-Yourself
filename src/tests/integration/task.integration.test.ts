import { expect, test, describe } from 'vitest'
import createTestUser from './setup/userTestIntegrationSetup'
import createTestTask from './setup/taskTestIntegrationSetup';
import { getAuthenticatedDb } from './setup/userTestDb';
import { afterAllSetup, beforeAllSetup, beforeEachSetup, testEnv } from './setup/firebaseTestSetup';
import { assertFails } from '@firebase/rules-unit-testing';
import { addDoc, collection } from "firebase/firestore";
import { createTask, deleteTask, getTask, updateTask } from '../../services/task/task.service';
beforeAllSetup()
beforeEachSetup()
afterAllSetup()

describe("VALID Task Integration teszt", () => {
    test("VALID Task dokumentum lerehozasa es lekerese", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const email = "tasklekeresteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        const tid = await createTask(authenticatedDb as any, uid, task);
        const dbTask = await getTask(authenticatedDb as any, uid, tid);

        expect(dbTask).not.toBe(null);
        expect((dbTask as any).id).toBe(tid);
        expect((dbTask as any).taskName).toBe(task.taskName);
    });
    test("VALID Task dokumentum lerehozasa es modositasa es lekerese", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const email = "taskmodositasteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        const tid = await createTask(authenticatedDb as any, uid, task);
        await updateTask(authenticatedDb as any, uid, tid, {
            taskStatus: "Teljesített",
            taskCompletedAt: new Date(),
            taskUpdatedAt: new Date()
        });
        const dbTask = await getTask(authenticatedDb as any, uid, tid);

        expect(dbTask).not.toBe(null);
        expect((dbTask as any).taskStatus).toBe("Teljesített");
        expect((dbTask as any).taskName).toBe(task.taskName);
    });
    test("VALID Task dokumentum lerehozasa es torlese", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const email = "tasktorlesteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        const tid = await createTask(authenticatedDb as any, uid, task);
        const dbTask = await getTask(authenticatedDb as any, uid, tid);
        expect(dbTask).not.toBe(null);
        await deleteTask(authenticatedDb as any, uid, tid);
        const falsedbTask = await getTask(authenticatedDb as any, uid, tid);
        expect(falsedbTask).toBe(null);
    });
});

describe("INVALID Task Integration teszt", () => {
    test("INVALID taskName tul rovid nem mentheto", async () => {
        const user = createTestUser();
        const task = createTestTask({
            taskName: "AB"
        });
        const email = "tasktulrovidnevteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(createTask(authenticatedDb as any, uid, task));
    });
    test("INVALID teljesitett nelkul nem lehet taskCompletedAt erteket menteni", async () => {
        const user = createTestUser();
        const task = createTestTask({
            taskStatus: "Folyamatban",
            taskCompletedAt: new Date()
        });
        const email = "taskcompletedatstatuszteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(createTask(authenticatedDb as any, uid, task));
    });
    test("INVALID plusz mezo nem maradhat task dokumentumban", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const email = "taskextramezoteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(
            addDoc(
                collection(authenticatedDb as any, "users", uid, "tasks"),
                {
                    ...task,
                    extraField: true
                }
            )
        );
    });
    test("INVALID masik user nem hozhat letre taskot", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const attackerEmail = "taskattackercreateteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        await assertFails(createTask(attackerAuthenticatedDb as any, ownerUid, task));
    });
    test("INVALID nem autentikalt felhasznalo nem hozhat letre taskot", async () => {
        const task = createTestTask();
        const uid = `${crypto.randomUUID()}`
        const unauthenticatedDb = testEnv.unauthenticatedContext().firestore();
        await assertFails(createTask(unauthenticatedDb as any, uid, task));
    });
    test("INVALID taskCreated mezot nem lehet modositani", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const email = "tasktaskcreatedteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        const tid = await createTask(authenticatedDb as any, uid, task);
        await assertFails(
            updateTask(authenticatedDb as any, uid, tid, {
                taskCreatedAt: new Date()
            })
        )
    });
    test("INVALID masik user nem olvashat taskot", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const ownerEmail = "taskownerreadteszt@gmail.com";
        const attackerEmail = "taskattackerreadteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const ownerAuthenticatedDb = getAuthenticatedDb(ownerUid, ownerEmail, user.verified);
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        const tid = await createTask(ownerAuthenticatedDb as any, ownerUid, task);
        await assertFails(
            getTask(attackerAuthenticatedDb as any, ownerUid, tid)
        )
    });
    test("INVALID masik user nem modosithat taskot", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const ownerEmail = "taskownerupdateteszt@gmail.com";
        const attackerEmail = "taskattackerupdateteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const ownerAuthenticatedDb = getAuthenticatedDb(ownerUid, ownerEmail, user.verified);
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        const tid = await createTask(ownerAuthenticatedDb as any, ownerUid, task);
        await assertFails(
            updateTask(attackerAuthenticatedDb as any, ownerUid, tid, {
                taskName: "NEWNAME"
            }))
    });
    test("INVALID masik user nem torohet taskot", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const ownerEmail = "taskownerdeleteteszt@gmail.com";
        const attackerEmail = "taskattackerdeleteteszt@gmail.com";
        const ownerUid = `${crypto.randomUUID()}`
        const attackerUid = `${crypto.randomUUID()}`
        const ownerAuthenticatedDb = getAuthenticatedDb(ownerUid, ownerEmail, user.verified);
        const attackerAuthenticatedDb = getAuthenticatedDb(attackerUid, attackerEmail, user.verified);
        const tid = await createTask(ownerAuthenticatedDb as any, ownerUid, task);
        await assertFails(deleteTask(attackerAuthenticatedDb as any, ownerUid, tid));
    });
    test("INVALID teljesitett task completedAt nelkul", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const email = "taskcompletedatteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        const tid = await createTask(authenticatedDb as any, uid, task);
        await assertFails(
            updateTask(authenticatedDb as any, uid, tid, {
                taskStatus: "Teljesített"
            }))
    });
    test("INVALID taskImportance 5 feletti ertekkel", async () => {
        const user = createTestUser();
        const task = createTestTask({
            taskImportance: 6
        });
        const email = "tasktaskimportanceteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(createTask(authenticatedDb as any, uid, task))
    });
    test("INVALID deadline korabbi, mint a createdAt", async () => {
        const user = createTestUser();
        const task = createTestTask({
            taskDeadline: new Date(2025, 5, 4),
            taskCreatedAt: new Date(2025, 5, 5)
        });
        const email = "taskdeadlineteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(createTask(authenticatedDb as any, uid, task))
    });
    test("INVALID taskStatus nem megfelelo", async () => {
        const user = createTestUser();
        const task = createTestTask({
            taskStatus: "nincsIlyen" as any
        });
        const email = "taskstatusteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(createTask(authenticatedDb as any, uid, task))
    });
    test("INVALID taskUpdatedAt nem megfelelo", async () => {
        const user = createTestUser();
        const task = createTestTask({
            taskUpdatedAt: new Date(2025, 10, 10)
        });
        const email = "taskupdatedat@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(createTask(authenticatedDb as any, uid, task))
    });
    test("INVALID nem letezo field", async () => {
        const user = createTestUser();
        const task = createTestTask({
            nemLetezik: 10
        } as any);
        const email = "taskupdatedat@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        await assertFails(
            addDoc(
                collection(authenticatedDb as any, "users", uid, "tasks"),
                task
            )
        );
    });
});
