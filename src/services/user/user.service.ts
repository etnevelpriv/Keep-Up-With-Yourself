import { doc, getDoc, updateDoc, setDoc, type Firestore } from "firebase/firestore";

export const createUserDocumentInDatabase = async function (db: Firestore, uid: string, email: string, name: string, createdAt: Date, verified: boolean) {
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
export const updateUserDocumentInDatabase = async function (db: Firestore, uid: string, data: any) {
    await updateDoc(doc(db, "users", uid), data);
};
export const getUserDocumentFromDatabase = async function (db: Firestore, uid: string) {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (!docSnap.exists()) {
        return null;
    }
    return (docSnap.data());
};