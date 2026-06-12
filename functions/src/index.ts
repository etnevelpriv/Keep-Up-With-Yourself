import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const deleteCurrentUserCompletely = onCall(async (request) => {
  const uid = request.auth?.uid;
  const emailVerified = request.auth?.token.email_verified;
  if (!uid) {
    throw new HttpsError("unauthenticated", "auth/not-authenticated");
  }
  if (!emailVerified) {
    throw new HttpsError("permission-denied", "auth/email-not-verified");
  }
  try {
    await admin.auth().deleteUser(uid);
    const userRef = db.collection("users").doc(uid);
    await db.recursiveDelete(userRef);
    return;
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
  if (emailVerified === true) {
    await db.collection("users").doc(uid).update({
      userVerified: emailVerified,
    });
  }
  return;
});

export const updateExpiredTasks=onSchedule(("every day 00:00"), async ()=>{
  const now = admin.firestore.Timestamp.now();
  const usersSnapshot = await db.collection("users").get();

  const updates = usersSnapshot.docs.map(async (userDoc) => {
    const tasksSnapshot=await userDoc.ref.collection("tasks")
      .where("taskStatus", "==", "Folyamatban")
      .where("taskDeadline", "<", now).get();
    await Promise.all(tasksSnapshot.docs.map(async (taskDoc) => {
      await taskDoc.ref.update({
        taskStatus: "Lejárt",
        taskUpdatedAt: now,
      });
    }));
  });
  await Promise.all(updates);
});
