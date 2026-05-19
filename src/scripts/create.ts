import "../styles/base.css";
import "./header.ts";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"

const init = function () {
    const auth = getAuth();
    const user = getUser(auth);

    // loadTaskTypes()
    document.getElementById("createForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const formElements = getFormElements();
        console.log(formElements);

    });
};

const getFormElements = function () {
    const taskName = (document.getElementById('taskNameInput') as HTMLFormElement).value;
    const taskDesc = (document.getElementById('taskNameInput') as HTMLFormElement).value;
    const taskDeadline = (document.getElementById('taskDeadlineInput') as HTMLFormElement).value;
    const taskImportance = (document.getElementById('taskImportanceInput') as HTMLFormElement).value;
    const taskTypeName = (document.getElementById('taskTypeNameInput') as HTMLFormElement).value;
    return [taskName, taskDesc, taskDeadline, taskImportance, taskTypeName]
};

const loadTaskTypes = function () {

}

const getUser = function (auth: any) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                if (user.emailVerified) {
                  return(docSnap.data());
                };
            };
        };
    });
};

document.addEventListener("DOMContentLoaded", init);
