import { doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../scripts/firebase.ts"
import { showErrorPopUp } from "../../utils/popup.ts"

export const syncUserVerificationStatus = async function (uid: string) {
    await updateDoc(doc(db, "users", uid), {
        userVerified: true
    });
};

export const createUserDocumentInDatabase = async function (uid: string, email: string, name: string, createdAt: Date, verified: boolean) {
    try {
        const defaultTaskTypes = ["Tanulás","Munka","Takarítás"];
        const emptyArr: [] = [];

        await setDoc(doc(db, "users", uid), {
            userID: uid,
            userEmail: email,
            userName: name,
            userCreatedAt: createdAt,
            userVerified: verified,
            taskTypes: defaultTaskTypes,
            tasks: emptyArr
        });
        console.log("Uj dokumentum letrehozva az adatbazisban");
    } catch (err: any) {
        showErrorPopUp("Hiba történt az adatbázisba való mentés folyamán.");
        throw new Error(err)
    };
};
export const updateUserDocumentInDatabase = async function (uid: string, data: any) {
    try {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, data);
        console.log("Az adatbázisban történő módosítás sikeres volt");

    } catch (err: any) {
        throw new Error(err);
    }

};
export const getUserDocumentFromDatabase = async function (uid: string) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("A felhasznalo letezik az adatbazisban:", docSnap.data());
        return (docSnap.data());
    } else {
        console.log("Nem letezik ehhez a felhasznalohoz dokumentum az adatbazisban.");
        return false;
    };
};
export const deleteUserDocumentFromDatabase = async function (uid: string) {
    await deleteDoc(doc(db, "users", uid));
};