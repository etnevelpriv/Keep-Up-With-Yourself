export interface TaskInterface {
    taskName: string;
    taskDesc: string;
    taskDeadline: Date;
    taskImportance: number;
    taskTypeName: string;
    taskStatus: "Folyamatban" | "Lejárt" | "Teljesített";
    taskCompletedAt: Date | undefined;
    TaskCreatedAt: Date;
    taskUpdatedAt: Date | undefined;
};