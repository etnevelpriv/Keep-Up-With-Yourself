import "../styles/base.css";
import "./header.ts";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"

const init = async function () {
    const auth = getAuth();
    const user = await getUser(auth);
    const taskTypesNames = getTaskTypes(user)

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

const getTaskTypes = function (user: any) {
    const tasksTypes = user.taskTypes
    const arr:string[] = []
    tasksTypes.forEach((tasksType:any) => {
        arr.push(tasksType.taskTypeName)
    });
    return(arr);
}

const getUser = async function (auth: any) {
    return new Promise((resolve, reject) => {
        try {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        if (user.emailVerified) {
                            resolve(docSnap.data());
                        };
                    };
                };
            });
        } catch (err:any) {
            reject(err);
            throw new Error(err);
        }
    })
};

document.addEventListener("DOMContentLoaded", init);
