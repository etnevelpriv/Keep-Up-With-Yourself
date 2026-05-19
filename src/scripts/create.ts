import "../styles/base.css";
import "../styles/create.css";
import "./header.ts";
import "../styles/loggedInUserNav.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"
import { Task } from "./classes/Task.ts";

const init = async function () {
    const auth = getAuth();
    const user = await getUser(auth);
    const taskTypesNames = getTaskTypes(user)
    createSelectOptions(taskTypesNames);
    updateImportanceText();
    syncTaskTypeFields();
    document.getElementById("createForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const formElements = getFormElements(user);
            console.log(formElements);
            const newTask = new Task(formElements[0], formElements[1], new Date(formElements[2]), Number(formElements[3]), formElements[4], "Folyamatban", null, new Date(), new Date())
            console.log(newTask);
            await createTaskInDB(newTask, user);
            (document.getElementById("createForm") as HTMLFormElement).reset();
            updateImportanceText();
            syncTaskTypeFields();
            showMessage("info", "A feladat sikeresen létrejött.");
        } catch (err: any) {
            showMessage("error", err.message || "Nem sikerült létrehozni a feladatot.");
        };
    });
    document.getElementById("taskImportanceInput")?.addEventListener("input", updateImportanceText);
    document.getElementById('taskNewTypeInput')?.addEventListener("change", () => {
        syncTaskTypeFields();
    });
};

const showMessage = function (type: "error" | "info", message: string) {
    const messageElement = document.getElementById(type === "error" ? "errorMessage" : "infoMessage");
    if (messageElement) {
        messageElement.textContent = "";
        window.setTimeout(() => {
            messageElement.textContent = message;
        }, 0);
    };
};

const updateImportanceText = function () {
    const taskImportanceInput = document.getElementById('taskImportanceInput') as HTMLInputElement | null;
    const taskImportanceText = document.getElementById('taskImportanceText');
    if (!taskImportanceInput || !taskImportanceText) return;

    const importanceLabels: Record<string, string> = {
        "1": "1 / 5 - Alacsony",
        "2": "2 / 5 - Kisebb",
        "3": "3 / 5 - Közepes",
        "4": "4 / 5 - Fontos",
        "5": "5 / 5 - Sürgős"
    };

    taskImportanceText.textContent = importanceLabels[taskImportanceInput.value] || `${taskImportanceInput.value} / 5`;
};

const syncTaskTypeFields = function () {
    const taskNewTypeInput = document.getElementById('taskNewTypeInput') as HTMLInputElement | null;
    const newType = document.getElementById('newType');
    const oldType = document.getElementById('oldType');
    const taskTypeNameInput = document.getElementById('taskTypeNameInput') as HTMLInputElement | null;
    const taskTypeNameSelect = document.getElementById('taskTypeNameSelect') as HTMLSelectElement | null;
    if (!taskNewTypeInput || !newType || !oldType || !taskTypeNameInput || !taskTypeNameSelect) return;

    if (taskNewTypeInput.checked) {
        newType.classList.remove("hide");
        oldType.classList.add("hide");
        taskTypeNameInput.required = true;
        taskTypeNameSelect.required = false;
    } else {
        newType.classList.add("hide");
        oldType.classList.remove("hide");
        taskTypeNameInput.required = false;
        taskTypeNameSelect.required = true;
    };
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
