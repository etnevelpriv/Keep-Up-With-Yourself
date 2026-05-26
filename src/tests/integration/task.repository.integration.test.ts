import { expect, test, describe } from 'vitest'
import createTestUser from '../modelsTests/userTestSetup'
import createTestTask from '../modelsTests/taskTestSetup';
import { createTask, getTask } from '../../repositories/task.repository';
import { getAuthenticatedDb } from './setup/userTestDb';
import { afterAllSetup, beforeAllSetup, beforeEachSetup } from './setup/firebaseTestSetup';
beforeAllSetup()
beforeEachSetup()
afterAllSetup()

describe("Task Repository (service klon) Integration teszt", () => {
    test("Task dokumentum lerehozasa es lekerese", async () => {
        const user = createTestUser();
        const task = createTestTask();
        const taskData = {
            taskName: task.taskName,
            taskDesc: task.taskDesc,
            taskDeadline: task.taskDeadline,
            taskImportance: task.taskImportance,
            taskTypeName: task.taskTypeName,
            taskStatus: task.taskStatus,
            taskCompletedAt: task.taskCompletedAt,
            taskCreatedAt: task.taskCreatedAt,
            taskUpdatedAt: task.taskUpdatedAt
        };
        const email = "lekeresteszt@gmail.com";
        const uid = `${crypto.randomUUID()}`
        const authenticatedDb = getAuthenticatedDb(uid, email, user.verified);
        const tid = await createTask(authenticatedDb as any, uid, taskData);
        const dbTask = await getTask(authenticatedDb as any, uid, tid);

        expect(dbTask).not.toBe(false);
        expect((dbTask as any).id).toBe(tid);
        expect((dbTask as any).taskName).toBe(task.taskName);
    });
});
