import { AppError } from "../../models/AppError";
export const validateTaskName = function (taskName: string) {
    if (taskName.trim() === "" || taskName.trim().length < 3 || taskName.trim().length > 50) {
        throw new AppError("validation/invalid-task-name");
    }
};
export const validateTaskDescription = function (taskDesc: string) {
    if (taskDesc.trim().length > 300) {
        throw new AppError("validation/invalid-task-description");
    }
};
export const validateTaskCreatedAt = function (taskCreatedAt: Date) {
    if (!(taskCreatedAt instanceof Date) || isNaN(taskCreatedAt.getTime()) || taskCreatedAt.getTime() > new Date().getTime()) {
        throw new AppError("validation/invalid-task-createdAt");
    }
};
export const validateTaskDeadline = function (taskDeadline: Date, taskCreatedAt: Date) {
    if (!(taskDeadline instanceof Date) || isNaN(taskDeadline.getTime()) || taskCreatedAt.getTime() > taskDeadline.getTime()) {
        throw new AppError("validation/invalid-task-deadline");
    }
};
export const validateTaskImportance = function (taskImportance: number) {
    if (!Number.isFinite(taskImportance) || taskImportance < 1 || taskImportance > 5) {
        throw new AppError("validation/invalid-task-importance");
    }
};
export const validateTaskTaskType = function (taskTypeName: string) {
    if (taskTypeName.trim() === "" || taskTypeName.trim().length > 40) {
        throw new AppError("validation/invalid-task-taskType");
    }
};
export const validateTaskStatus = function (taskStatus: string) {
    if (taskStatus !== "Folyamatban" && taskStatus !== "Lejárt" && taskStatus !== "Teljesített") {
        throw new AppError("validation/invalid-task-status");
    }
};
export const validateTaskCompletedAt = function (taskCompletedAt: Date | null) {
    if (taskCompletedAt !== null && (!(taskCompletedAt instanceof Date) || isNaN(taskCompletedAt.getTime()))) {
        throw new AppError("validation/invalid-task-completedAt");
    }
};
export const validateTaskUpdatedAt = function (taskUpdatedAt: Date) {
    if (!(taskUpdatedAt instanceof Date) || isNaN(taskUpdatedAt.getTime())) {
        throw new AppError("validation/invalid-task-updatedAt");
    }
};
export const taskDataValidationProcess = function (name:string, desc:string, deadline:Date, importance:number, typeName:string, status:string, completedAt:Date | null, createdAt:Date, updatedAt:Date) {
    validateTaskName(name);
    validateTaskDescription(desc);
    validateTaskCreatedAt(createdAt);
    validateTaskDeadline(deadline, createdAt);
    validateTaskImportance(importance);
    validateTaskTaskType(typeName);
    validateTaskStatus(status);
    validateTaskCompletedAt(completedAt);
    validateTaskUpdatedAt(updatedAt);
};
export const sanitizeText = function (text: string) {
    if (typeof text !== "string") {
        throw new AppError("validation/invalid-text-type");
    };
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    };

    return text.trim().replace(/[&<>"']/g, char => map[char]);
};