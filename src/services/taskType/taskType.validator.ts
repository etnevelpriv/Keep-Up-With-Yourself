import { AppError } from "../../models/AppError";

export const normalizeTaskType = function (taskType: string) {
    return taskType.trim().replace(/\s+/g, " ").toLowerCase();
};
export const validateTaskTypeValue = function (taskType: string) {
    if (!(typeof taskType === "string" && taskType.length > 1 && taskType.length <= 40 && /^\S(.*\S)?$/.test(taskType) && !/\s{2,}/.test(taskType))) {
        throw new AppError("validation/task-type-value-not-accepted");
    };
};
export const validateTaskTypesExceedsLimit = function (taskTypes: string[]) {
    if (taskTypes.length > 19) {
        throw new AppError("validation/task-types-exceeds-limit");
    };
};
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
    validateTaskTypeValue(taskType);
    validateTaskTypesExceedsLimit(taskTypes);
    validateTaskTypeLength(taskType);
};