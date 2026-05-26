import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../scripts/firebase.ts";

const getTasksCollectionRef = function (uid: string) {
    return collection(db, "users", uid, "tasks");
};

const getTaskDocumentRef = function (uid: string, tid: string) {
    return doc(db, "users", uid, "tasks", tid);
};

export const createTask = async function (uid: string, taskData: any) {
    const taskDocRef = await addDoc(getTasksCollectionRef(uid), taskData);
    console.log("Task hozzáadva");
    return taskDocRef.id;
};

export const getTasks = async function (uid: string) {
    const snapshot = await getDocs(getTasksCollectionRef(uid));
    return snapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data()
    }));
};

export const getTask = async function (uid: string, tid: string) {
    const taskSnap = await getDoc(getTaskDocumentRef(uid, tid));

    if (!taskSnap.exists()) {
        return null;
    }

    return {
        id: taskSnap.id,
        ...taskSnap.data()
    };
};

export const updateTask = async function (uid: string, tid: string, data: any) {
    await updateDoc(getTaskDocumentRef(uid, tid), data);
};

export const deleteTask = async function (uid: string, tid: string) {
    await deleteDoc(getTaskDocumentRef(uid, tid));
};

