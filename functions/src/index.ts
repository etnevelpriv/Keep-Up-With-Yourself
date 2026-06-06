import {onCall, HttpsError} from "firebase-functions/v2/https";
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
export const deleteCurrentUserCompletely = onCall(async (request) => {
  const uid = request.auth?.uid;
  const emailVerified = request.auth?.token.email_verified;
  if (!uid) {
    throw new HttpsError("unauthenticated", "auth/not-authenticated");
  }
  if (!emailVerified) {
    throw new HttpsError("permission-denied", "auth/email-not-verified");
  }
  const userRef = db.collection("users").doc(uid);
  try {
    try {
      await admin.auth().deleteUser(uid);
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code !== "auth/user-not-found") {
        throw error;
      }
    }
    await db.recursiveDelete(userRef);
    return {success: true};
  } catch (error) {
    throw new HttpsError("internal", "account/delete-failed");
  }
});
export const syncOwnVerificationStatus = onCall(async (request) => {
  const uid = request.auth?.uid;
  const emailVerified = request.auth?.token.email_verified;
  if (!uid) {
    throw new HttpsError("unauthenticated", "auth/not-authenticated");
  }
  await db.collection("users").doc(uid).update({
    userVerified: emailVerified === true,
  });
  return {success: true};
});
