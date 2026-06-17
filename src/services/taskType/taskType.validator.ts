import { AppError } from "../../models/AppError";

export const normalizeTaskType = function (taskType: string) {
    return taskType.trim().replace(/\s+/g, " ").toLowerCase();
};
export const validateTaskTypesExceedsLimit = function (taskTypes: string[]) {
    if (taskTypes.length > 20) {
        throw new AppError("validation/task-types-exceeds-limit");
    };
};
export const validateisAllTaskTypeString = function (taskTypes: string[]) {
    for (const taskType of taskTypes) {
        if (typeof taskType != "string") {
            throw new AppError("validation/not-all-task-types-string");
        }
    }
}
export const validateisTaskTypeString = function (taskType:string) {
    if (typeof taskType != "string") {
        throw new AppError("validation/task-type-not-string");
    }
}
export const validateEachTaskTypeLength = function (taskTypes: string[]) {
    for (const taskType of taskTypes) {
        if (taskType.length <= 1) {
            throw new AppError("validation/some-task-type-too-short");
        } else if (taskType.length > 40) {
            throw new AppError("validation/some-task-type-too-long");
        }
    };
};
export const validateTaskTypeLength = function (taskType:string) {
    if (taskType.length <= 1) {
        throw new AppError("validation/task-type-too-short");
    } else if (taskType.length > 40) {
        throw new AppError("validation/task-type-too-long");
    };
};
export const validateNewTask = function (taskTypes: string[], taskType:string) {
    validateTaskTypesExceedsLimit(taskTypes);
    validateisTaskTypeString(taskType);
    validateTaskTypeLength(taskType);
};