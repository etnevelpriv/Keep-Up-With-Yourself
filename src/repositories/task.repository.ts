import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const getTasksCollectionRef = function (db:Firestore, uid: string) {
    return collection(db, "users", uid, "tasks");
};

const getTaskDocumentRef = function (db:Firestore, uid: string, tid: string) {
    return doc(db, "users", uid, "tasks", tid);
};

export const createTask = async function (db:Firestore,uid: string, taskData: any) {
    const taskDocRef = await addDoc(getTasksCollectionRef(db, uid), taskData);
    return taskDocRef.id;
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