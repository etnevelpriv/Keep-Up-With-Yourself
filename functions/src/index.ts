import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const updateExpiredTasks = onSchedule("every 15 minutes", async () => {
  const now = admin.firestore.Timestamp.now();

  const userSnap = await db.collection("users").get();

  const updates = userSnap.docs.map(async (userDoc) => {
    const data = userDoc.data();
    const tasks = data.tasks ?? [];

    let changed = false;

    const updatedTasks = tasks.map((task: any) => {
      const deadline = task.taskDeadline;

      if (
        deadline?.toMillis &&
        deadline.toMillis() < now.toMillis() &&
        task.taskStatus === "Folyamatban"
      ) {
        changed = true;

        return {
          ...task,
          taskStatus: "Lejárt",
          taskUpdatedAt: now,
        };
      }

      return task;
    });

    if (changed) {
      await userDoc.ref.update({
        tasks: updatedTasks,
      });

      logger.info(`Expired tasks updated for user: ${userDoc.id}`);
    }
  });

  await Promise.all(updates);
});