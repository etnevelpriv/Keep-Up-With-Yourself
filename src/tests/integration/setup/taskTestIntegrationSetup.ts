import type { TaskInterface } from "../../../interfaces/TaskInterface.ts";

export function createTestTask(overrides?: Partial<TaskInterface>) {
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

    return {
        taskName:data.taskName,
        taskDesc:data.taskDesc,
        taskDeadline:data.taskDeadline,
        taskImportance:data.taskImportance,
        taskTypeName:data.taskTypeName,
        taskStatus:data.taskStatus,
        taskCompletedAt:data.taskCompletedAt,
        taskCreatedAt:data.taskCreatedAt,
        taskUpdatedAt:data.taskUpdatedAt
    };
}

export default createTestTask;
