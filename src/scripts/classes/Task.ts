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
        this.dataValidation(taskName, taskDesc, taskDeadline, taskImportance, taskTypeName, taskStatus, taskCompletedAt, TaskCreatedAt, taskUpdatedAt);
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
    dataValidation(
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
        if (typeof taskName !== "string" || taskName.trim() === "") {
            throw new Error("A feladat neve kötelező.");
        }
        if (typeof taskDesc !== "string") {
            throw new Error("A leírás érvénytelen.");
        }
        if (!(taskDeadline instanceof Date) || isNaN(taskDeadline.getTime()) || TaskCreatedAt.getTime() > taskDeadline.getTime()) {
            throw new Error("A határidő érvénytelen.");
        }
        if (!(TaskCreatedAt instanceof Date) || isNaN(TaskCreatedAt.getTime()) || new Date().getTime() > TaskCreatedAt.getTime()) {
            throw new Error("A létrehozás dátuma érvénytelen.");
        }
        if (typeof taskImportance !== "number" || taskImportance < 1 || taskImportance > 5) {
            throw new Error("A fontosság 1 és 5 közé essen.");
        }
        if (typeof taskTypeName !== "string" || taskTypeName.trim() === "") {
            throw new Error("A típus neve kötelező.");
        }
        if (taskStatus !== "Folyamatban" && taskStatus !== "Lejárt" && taskStatus !== "Teljesített") {
            throw new Error("Az állapot érvénytelen.");
        }
        if (taskCompletedAt !== undefined && (!(taskCompletedAt instanceof Date) || isNaN(taskCompletedAt.getTime()))) {
            throw new Error("A befejezés dátuma érvénytelen.");
        }
        if (!(taskUpdatedAt instanceof Date) || isNaN(taskUpdatedAt.getTime()) || new Date().getTime() > TaskCreatedAt.getTime()) {
            throw new Error("A frissítés dátuma érvénytelen.");
        }
    };
}