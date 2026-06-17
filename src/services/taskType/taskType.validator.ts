export const normalizeTaskType = function (taskType:string) {
    return taskType.trim().replace(/\s+/g, " ").toLowerCase();
};