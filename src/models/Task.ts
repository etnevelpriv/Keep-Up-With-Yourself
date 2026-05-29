import type { TaskInterface } from "../interfaces/TaskInterface.ts";
import { sanitizeText, taskDataValidationProcess } from "../services/task/task.validator.ts";
export class Task implements TaskInterface {
    taskName: string;
    taskDesc: string;
    taskDeadline: Date;
    taskImportance: number;
    taskTypeName: string;
    taskStatus: "Folyamatban" | "Lejárt" | "Teljesített";
    taskCompletedAt: Date | null;
    taskCreatedAt: Date;
    taskUpdatedAt: Date;
    constructor(
        taskName: string,
        taskDesc: string,
        taskDeadline: Date,
        taskImportance: number,
        taskTypeName: string,
        taskStatus: "Folyamatban" | "Lejárt" | "Teljesített",
        taskCompletedAt: Date | null,
        taskCreatedAt: Date,
        taskUpdatedAt: Date
    ) {
        taskName = sanitizeText(taskName);
        taskDesc = sanitizeText(taskDesc);
        taskTypeName = sanitizeText(taskTypeName);
        taskDataValidationProcess(taskName, taskDesc, taskDeadline, taskImportance, taskTypeName, taskStatus, taskCompletedAt, taskCreatedAt, taskUpdatedAt);
        this.taskName = taskName;
        this.taskDesc = taskDesc;
        this.taskDeadline = taskDeadline;
        this.taskImportance = taskImportance;
        this.taskTypeName = taskTypeName;
        this.taskStatus = taskStatus;
        this.taskCompletedAt = taskCompletedAt;
        this.taskCreatedAt = taskCreatedAt;
        this.taskUpdatedAt = taskUpdatedAt;

    };
    toString() {
        return (`Nev: ${this.taskName}, Leiras:${this.taskDesc}, Hatarido:${this.taskDeadline}, Fontossag:${this.taskImportance}, Tipus:${this.taskTypeName}, Statusz:${this.taskStatus}, Keszult:${this.taskCreatedAt}, Frissitve:${this.taskUpdatedAt}, Befejezve:${this.taskCompletedAt}`);
    };
};