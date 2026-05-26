import { expect, test, describe } from 'vitest'
import createTestUser from '../modelsTests/userTestSetup'
import createTestTask from '../modelsTests/taskTestSetup';
import { createTask, deleteTask, getTask, updateTask } from '../../repositories/task.repository';
import { getAuthenticatedDb } from './setup/userTestDb';
import { afterAllSetup, beforeAllSetup, beforeEachSetup } from './setup/firebaseTestSetup';
beforeAllSetup()
beforeEachSetup()
afterAllSetup()

describe("Task Repository (service klon) Integration teszt", () => {
    test("Task dokumentum lerehozasa es lekerese", async () => {
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
    test("Task dokumentum lerehozasa es modositasa es lekerese", async () => {
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
    test("Task dokumentum lerehozasa es torlese", async () => {
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