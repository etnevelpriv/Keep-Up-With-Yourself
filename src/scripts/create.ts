import "../styles/base.css";
import "../styles/create.css";
import "./header.ts";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"
import { Task } from "./classes/Task.ts";

const init = async function () {
    const auth = getAuth();
    const user = await getUser(auth);
    const taskTypesNames = getTaskTypes(user)
    createSelectOptions(taskTypesNames);
    document.getElementById("createForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const formElements = getFormElements(user);
        console.log(formElements);
        const newTask = new Task(formElements[0], formElements[1], new Date(formElements[2]), Number(formElements[3]), formElements[4], "Folyamatban", null, new Date(), new Date())
        console.log(newTask);
        (document.getElementById("createForm") as HTMLFormElement).reset();
        createTaskInDB(newTask, user);
    });
    document.getElementById('taskNewTypeInput')?.addEventListener("change", () => {
        const newType = document.getElementById('newType');
        const oldType = document.getElementById('oldType');
        if (newType && oldType) {
            newType.classList.toggle("hide");
            oldType.classList.toggle("hide");
            document.getElementById('taskTypeNameInput')?.toggleAttribute("required");
            document.getElementById('taskTypeNameSelect')?.toggleAttribute("required");
        };
    });
};

const getFormElements = function (user: any) {
    const taskName = (document.getElementById('taskNameInput') as HTMLFormElement).value;
    const taskDesc = (document.getElementById('taskDescTextarea') as HTMLFormElement).value;
    const taskDeadline = (document.getElementById('taskDeadlineInput') as HTMLFormElement).value;
    const taskImportance = (document.getElementById('taskImportanceInput') as HTMLFormElement).value;
    const taskNewType = (document.getElementById('taskNewTypeInput') as HTMLFormElement).checked;
    let taskTypeName = null
    if (taskNewType) {
        taskTypeName = (document.getElementById('taskTypeNameInput') as HTMLFormElement).value;
        saveTaskTypeToDB(taskTypeName, user)
    } else {
        taskTypeName = (document.getElementById('taskTypeNameSelect') as HTMLFormElement).value;
    }
    return [taskName, taskDesc, taskDeadline, taskImportance, taskTypeName]
};

const getTaskTypes = function (user: any) {
    const tasksTypes = user.taskTypes
    const arr: string[] = []
    tasksTypes.forEach((tasksType: any) => {
        arr.push(tasksType.taskTypeName)
    });
    return (arr);
}

const createSelectOptions = function (arr: string[]) {
    const select = document.getElementById("taskTypeNameSelect") as HTMLElement;
    arr.forEach(element => {
        const option = document.createElement("option") as HTMLOptionElement;
        option.value = element;
        option.textContent = element;
        select.appendChild(option);
    });
};

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
        } catch (err: any) {
            reject(err);
            throw new Error(err);
        }
    })
};

const saveTaskTypeToDB = async function (taskType: string, user: any) {
    if (taskType !== 'Takarítás' && taskType !== 'Munka' && taskType !== 'Tanulás') {
        const payload = {
            taskTypeName: taskType,
            taskType_isSystem: false
        }
        // Tudtam, hogy elobb atkell tenni setbe, majd vissza, de en nem igy csinaltam volna, a chatbarat ezt ajanlotta es jol mukodik, szoval itt hagyom
        user.taskTypes = [...new Set([...user.taskTypes, payload])];

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                await updateDoc(userDocRef, {
                    taskTypes: user.taskTypes
                });
                console.log("Minden szupi");
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }
}

const createTaskInDB = async function (task: Task, user: any) {
    const taskPayload = {
        taskName: task.taskName,
        taskDesc: task.taskDesc,
        taskDeadline: task.taskDeadline,
        taskImportance: task.taskImportance,
        taskTypeName: task.taskTypeName,
        taskStatus: task.taskStatus,
        taskCompletedAt: task.taskCompletedAt,
        TaskCreatedAt: task.TaskCreatedAt,
        taskUpdatedAt: task.taskUpdatedAt
    };

    user.tasks.push(taskPayload);
    console.log(user);
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            await updateDoc(userDocRef, {
                tasks: user.tasks
            });
            console.log("Minden szupi");
        }
    } catch (err: any) {
        throw new Error(err);
    }
};

document.addEventListener("DOMContentLoaded", init);
