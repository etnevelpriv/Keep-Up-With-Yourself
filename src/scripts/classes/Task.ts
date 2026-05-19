import type { TaskInterface } from "./TaskInterface";

export class Task implements TaskInterface {
    taskName: string;
    taskDesc: string;
    taskDeadline: Date;
    taskImportance: number;
    taskTypeName: string;
    taskStatus: "Folyamatban" | "Lejárt" | "Teljesített";
    taskCompletedAt: Date | null;
    TaskCreatedAt: Date;
    taskUpdatedAt: Date;
    constructor(
        taskName: string,
        taskDesc: string,
        taskDeadline: Date,
        taskImportance: number,
        taskTypeName: string,
        taskStatus: "Folyamatban" | "Lejárt" | "Teljesített",
        taskCompletedAt: Date | null,
        TaskCreatedAt: Date,
        taskUpdatedAt: Date
    ) {
        taskName = this.sanitizeText(taskName);
        taskDesc = this.sanitizeText(taskDesc);
        taskTypeName = this.sanitizeText(taskTypeName);
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
    toString() {
        return (`Nev: ${this.taskName}, Leiras:${this.taskDesc}, Hatarido:${this.taskDeadline}, Fontossag:${this.taskImportance}, Tipus:${this.taskTypeName}, Statusz:${this.taskStatus}, Keszult:${this.TaskCreatedAt}, Frissitve:${this.taskUpdatedAt}, Befejezve:${this.taskCompletedAt}`);
    };
    private dataValidation(
        taskName: string,
        taskDesc: string,
        taskDeadline: Date,
        taskImportance: number,
        taskTypeName: string,
        taskStatus: "Folyamatban" | "Lejárt" | "Teljesített",
        taskCompletedAt: Date | null,
        TaskCreatedAt: Date,
        taskUpdatedAt: Date
    ) {
        if (taskName.trim() === "" || taskName.trim().length < 3 || taskName.trim().length > 50) {
            throw new Error("A feladat neve érvénytelen.");
        }
        if (taskDesc.trim().length > 300) {
            throw new Error("A leírás érvénytelen.");
        }
        if (!(TaskCreatedAt instanceof Date) || isNaN(TaskCreatedAt.getTime()) || TaskCreatedAt.getTime() > new Date().getTime()) {
            throw new Error("A létrehozás dátuma érvénytelen.");
        }
        if (!(taskDeadline instanceof Date) || isNaN(taskDeadline.getTime()) || TaskCreatedAt.getTime() > taskDeadline.getTime()) {
            throw new Error("A határidő érvénytelen.");
        }
        if (!Number.isFinite(taskImportance) || taskImportance < 1 || taskImportance > 5) {
            throw new Error("A fontosság 1 és 5 közé essen.");
        }
        if (taskTypeName.trim() === "" || taskTypeName.trim().length > 40) {
            throw new Error("A típus érvénytelen.");
        }
        if (taskStatus !== "Folyamatban" && taskStatus !== "Lejárt" && taskStatus !== "Teljesített") {
            throw new Error("Az állapot érvénytelen.");
        }
        if (taskCompletedAt !== null && (!(taskCompletedAt instanceof Date) || isNaN(taskCompletedAt.getTime()))) {
            throw new Error("A befejezés dátuma érvénytelen.");
        }
        if (!(taskUpdatedAt instanceof Date) || isNaN(taskUpdatedAt.getTime())) {
            throw new Error("A frissítés dátuma érvénytelen.");
        }
    };
    // Megkertem az ai-t hogy sanitizeolja
    private sanitizeText(text: string) {
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
};
