import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../scripts/firebase.ts"
import { showInfoPopUp, showErrorPopUp } from "../../utils/popup.ts"

const auth = getAuth();

export const syncUserVerificationStatus = async function (uid: string) {
    await updateDoc(doc(db, "users", uid), {
        userVerified: true
    });
};

export const createUserDocumentInDatabase = async function (uid: string, email: string, name: string, createdAt: Date, verified: boolean) {
    try {
        const defaultTaskTypes = [
            {
                taskTypeName: "Tanulás",
                taskType_isSystem: true
            },
            {
                taskTypeName: "Munka",
                taskType_isSystem: true
            },
            {
                taskTypeName: "Takarítás",
                taskType_isSystem: true
            },
        ];
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
        console.log("Uj doksi letrehozva az adatbazisban");
    } catch (err: any) {
        showErrorPopUp("Hiba történt az adatbázisba való mentés folyamán.");
        throw new Error(err)
    };
};
export const updateUserDocumentInDatabase = function (uid: string, data: any) {

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
export const deleteUserDocumentFromDatabase = function (uid: string) {

};