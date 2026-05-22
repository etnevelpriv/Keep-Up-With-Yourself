export const validateTaskName = function (taskName: string) {
    if (taskName.trim() === "" || taskName.trim().length < 3 || taskName.trim().length > 50) {
        throw new Error("A feladat neve érvénytelen.");
    }
};
export const validateTaskDescription = function (taskDesc: string) {
    if (taskDesc.trim().length > 300) {
        throw new Error("A leírás érvénytelen.");
    }
};
export const validateTaskCreatedAt = function (taskCreatedAt: Date) {
    if (!(taskCreatedAt instanceof Date) || isNaN(taskCreatedAt.getTime()) || taskCreatedAt.getTime() > new Date().getTime()) {
        throw new Error("A létrehozás dátuma érvénytelen.");
    }
};
export const validateTaskDeadline = function (taskDeadline: Date, taskCreatedAt: Date) {
    if (!(taskDeadline instanceof Date) || isNaN(taskDeadline.getTime()) || taskCreatedAt.getTime() > taskDeadline.getTime()) {
        throw new Error("A határidő érvénytelen.");
    }
};
export const validateTaskImportance = function (taskImportance: number) {
    if (!Number.isFinite(taskImportance) || taskImportance < 1 || taskImportance > 5) {
        throw new Error("A fontosság 1 és 5 közé essen.");
    }
};
export const validateTaskTaskType = function (taskTypeName: string) {
    if (taskTypeName.trim() === "" || taskTypeName.trim().length > 40) {
        throw new Error("A típus érvénytelen.");
    }
};
export const validateTaskStatus = function (taskStatus: string) {
    if (taskStatus !== "Folyamatban" && taskStatus !== "Lejárt" && taskStatus !== "Teljesített") {
        throw new Error("Az állapot érvénytelen.");
    }
};
export const validateTaskCompletedAt = function (taskCompletedAt: Date | null) {
    if (taskCompletedAt !== null && (!(taskCompletedAt instanceof Date) || isNaN(taskCompletedAt.getTime()))) {
        throw new Error("A befejezés dátuma érvénytelen.");
    }
};
export const validateTaskUpdatedAt = function (taskUpdatedAt: Date) {
    if (!(taskUpdatedAt instanceof Date) || isNaN(taskUpdatedAt.getTime())) {
        throw new Error("A frissítés dátuma érvénytelen.");
    }
};
export const taskDataValidationProcess = function (name:string, desc:string, deadline:Date, importance:number, typeName:string, status:string, completedAt:Date | null, createdAt:Date, updatedAt:Date) {
    validateTaskName(name);
    validateTaskDescription(desc);
    validateTaskDeadline(deadline, createdAt);
    validateTaskImportance(importance);
    validateTaskTaskType(typeName);
    validateTaskStatus(status);
    validateTaskCompletedAt(completedAt);
    validateTaskCreatedAt(createdAt);
    validateTaskUpdatedAt(updatedAt);
};
export const sanitizeText = function (text: string) {
    if (typeof text !== "string") {
        throw new Error("Ahol a szöveget kell megadni, ott szöveg legyen megadva. Valamelyik adat érvénytelen.")
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