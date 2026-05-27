import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const updateExpiredTasks = onSchedule("every 24 hours", async () => {
  const now = admin.firestore.Timestamp.now();

  const userSnap = await db.collection("users").get();

  const updates = userSnap.docs.map(async (userDoc) => {
    let changed = false;

    const tasksSnap = await userDoc.ref.collection("tasks")
      .where("taskStatus", "==", "Folyamatban")
      .get();

    await Promise.all(tasksSnap.docs.map(async (taskDoc) => {
      const task = taskDoc.data();
      const deadline = task.taskDeadline;
      const deadlineMillis =
        typeof deadline?.toMillis === "function" ?
          deadline.toMillis() : null;

      if (deadlineMillis != null && deadlineMillis < now.toMillis()) {
        changed = true;
        await taskDoc.ref.update({
          taskStatus: "Lejárt",
          taskUpdatedAt: now,
        });
      }
    }));

    if (changed) {
      logger.info(`Expired tasks updated for user: ${userDoc.id}`);
    }
  });

  await Promise.all(updates);
});
