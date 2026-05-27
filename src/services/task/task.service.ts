import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const getTasksCollectionRef = function (db: Firestore, uid: string) {
    return collection(db, "users", uid, "tasks");
};
const getTaskDocumentRef = function (db:Firestore, uid: string, tid: string) {
    return doc(db, "users", uid, "tasks", tid);
};
export const createTask = async function (db:Firestore, uid: string, task: any) {
    const taskDocRef = await addDoc(getTasksCollectionRef(db, uid), {
        taskName: task.taskName,
        taskDesc: task.taskDesc,
        taskDeadline: task.taskDeadline,
        taskImportance: task.taskImportance,
        taskTypeName: task.taskTypeName,
        taskStatus: task.taskStatus,
        taskCompletedAt: task.taskCompletedAt,
        taskCreatedAt: task.taskCreatedAt,
        taskUpdatedAt: task.taskUpdatedAt
    });
    return taskDocRef.id;
};
export const getTasks = async function (db:Firestore,uid: string) {
    const snapshot = await getDocs(getTasksCollectionRef(db, uid));
    return snapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data()
    }));
};
export const getTask = async function (db:Firestore, uid: string, tid: string) {
    const taskSnap = await getDoc(getTaskDocumentRef(db, uid, tid));
    if (!taskSnap.exists()) {
        return null;
    }
    return {
        id: taskSnap.id,
        ...taskSnap.data()
    };
};
export const updateTask = async function (db:Firestore, uid: string, tid: string, data: any) {
    await updateDoc(getTaskDocumentRef(db, uid, tid), data);
};
export const deleteTask = async function (db:Firestore, uid: string, tid: string) {
    await deleteDoc(getTaskDocumentRef(db, uid, tid));
};

