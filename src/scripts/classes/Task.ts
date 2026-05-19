import type { TaskInterface } from "./TaskInterface";

export class Task implements TaskInterface {
    taskName: string;
    taskDesc: string;
    taskDeadline: Date;
    taskImportance: number;
    taskTypeName: string;
    taskStatus: "Folyamatban" | "Lejárt" | "Teljesített";
    taskCompletedAt: Date | undefined;
    TaskCreatedAt: Date;
    taskUpdatedAt: Date | undefined;
    constructor (
        taskName: string,
        taskDesc: string,
        taskDeadline: Date,
        taskImportance: number,
        taskTypeName: string,
        taskStatus: "Folyamatban" | "Lejárt" | "Teljesített",
        taskCompletedAt: Date | undefined,
        TaskCreatedAt: Date,
        taskUpdatedAt: Date
    ) {
        this.taskName = taskName;
        this.taskDesc = taskDesc;
        this.taskDeadline = taskDeadline;
        this.taskImportance = taskImportance;
        this.taskTypeName = taskTypeName;
        this.taskStatus = taskStatus;
        this.taskCompletedAt = taskCompletedAt;
        this.TaskCreatedAt = TaskCreatedAt;
        this.taskUpdatedAt = taskUpdatedAt;
    };
    toString () {
        return (`Nev: ${this.taskName}, Leiras:${this.taskDesc}, Hatarido:${this.taskDeadline}, Fontossag:${this.taskImportance}, Tipus:${this.taskTypeName}, Statusz:${this.taskStatus}, Keszult:${this.TaskCreatedAt}, Frissitve:${this.taskUpdatedAt}, Befejezve:${this.taskCompletedAt}`);
    };
}