// AI
import { Task } from "../../models/Task.ts";
import type { TaskInterface } from "../../interfaces/TaskInterface.ts";

export function createTestTask(overrides?: Partial<TaskInterface>): Task {
    const now = new Date();
    const defaultCreated = new Date(now.getTime() - 1000 * 60 * 60);
    const defaultUpdated = new Date(now.getTime() - 1000 * 30);
    const defaultDeadline = new Date(now.getTime() + 1000 * 60 * 60 * 24);

    const defaults: TaskInterface = {
        taskName: "TESZT_NEV",
        taskDesc: "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        taskDeadline: defaultDeadline,
        taskImportance: 3,
        taskTypeName: "TESZT_TASKTYPENAME",
        taskStatus: "Folyamatban",
        taskCompletedAt: null,
        taskCreatedAt: defaultCreated,
        taskUpdatedAt: defaultUpdated,
    };

    const data: TaskInterface = { ...defaults, ...(overrides || {}) } as TaskInterface;

    return new Task(
        data.taskName,
        data.taskDesc,
        data.taskDeadline,
        data.taskImportance,
        data.taskTypeName,
        data.taskStatus,
        data.taskCompletedAt,
        data.taskCreatedAt,
        data.taskUpdatedAt
    );
}

export default createTestTask;
