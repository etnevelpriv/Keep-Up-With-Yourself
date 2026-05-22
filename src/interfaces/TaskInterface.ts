export interface TaskInterface {
    taskName: string;
    taskDesc: string;
    taskDeadline: Date;
    taskImportance: number;
    taskTypeName: string;
    taskStatus: "Folyamatban" | "Lejárt" | "Teljesített";
    taskCompletedAt: Date | null;
    taskCreatedAt: Date;
    taskUpdatedAt: Date;
};