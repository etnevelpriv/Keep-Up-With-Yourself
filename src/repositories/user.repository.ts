import { doc, setDoc, getDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

export const createUser = async function (db: Firestore, uid: string, email: string, name: string, createdAt: Date, verified: boolean) {
    const defaultTaskTypes = ["Tanulás", "Munka", "Takarítás"];

    await setDoc(doc(db, "users", uid), {
        userID: uid,
        userEmail: email,
        userName: name,
        userCreatedAt: createdAt,
        userVerified: verified,
        taskTypes: defaultTaskTypes
    });
};

export const getUser = async function(db:Firestore, uid:string) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return (docSnap.data());
    } else {
        return false;
    };
};