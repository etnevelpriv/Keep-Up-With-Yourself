import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../scripts/firebase.ts"

export const syncUserVerificationStatus = async function (uid: string) {
    await updateDoc(doc(db, "users", uid), {
        userVerified: true
    });
};
export const getUserVerificationStatus = function () {

};
export const createUserDocumentInDatabase = function (uid: string, data: any) {

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
    };
};
export const deleteUserDocumentFromDatabase = function (uid: string) {

};