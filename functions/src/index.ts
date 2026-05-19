import { onSchedule } from "firebase-functions/scheduler";
import { logger } from "firebase-functions";
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const updateExpiredTasks = onSchedule("every 15 minutes", async () => {
    const now = new Date();
    const userSnap = await db.collection("users").get();

    userSnap.forEach((userDoc) => {
        const data = userDoc.data();
        const tasks = data.tasks;

        tasks.forEach((task :any) => {
            if (((task.taskDeadline).getTime() > now.getTime()) && task.taskStatus == "Folyamatban") {
                task.taskStatus = "Lejárt";
                task.taskUpdatedAt = now;
            };
        });
    });
})