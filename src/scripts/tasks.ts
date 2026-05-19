import "../styles/base.css";
import "../styles/tasks.css";
import "./header.ts";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"
import { Task } from "./classes/Task.ts";

const init = async function () {
    const auth = getAuth();
    const user = await getUser(auth);
    const arr = getTasks(user)
    const tasks: Task[] = turnArrIntoTasks(arr);
    createTaskCardsInDOM(tasks, user);
    const taskTypesNames = getTaskTypes(user)
    createSelectOptions(taskTypesNames);
    console.log(tasks)
    updateImportanceText();
    syncTaskTypeFields();
    document.getElementById("taskImportanceInput")?.addEventListener("input", updateImportanceText);
    document.getElementById('taskNewTypeInput')?.addEventListener("change", () => {
        syncTaskTypeFields();
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


const getTasks = function (user: any) {
    const tasks = user.tasks;
    return tasks;
};

const turnArrIntoTasks = function (arr: []) {
    const arrOfTasks: Task[] = [];
    arr.forEach((element: object) => {
        console.log(element.TaskCreatedAt)
        if (element.taskCompletedAt == null) {
            arrOfTasks.push(new Task(element.taskName, element.taskDesc, new Date(element.taskDeadline.seconds * 1000), element.taskImportance, element.taskTypeName, element.taskStatus, null, new Date(element.TaskCreatedAt.seconds * 1000), new Date(element.taskUpdatedAt.seconds * 1000)))
        } else {
            arrOfTasks.push(new Task(element.taskName, element.taskDesc, new Date(element.taskDeadline.seconds * 1000), element.taskImportance, element.taskTypeName, element.taskStatus, new Date(element.taskCompletedAt.seconds * 1000), new Date(element.TaskCreatedAt.seconds * 1000), new Date(element.taskUpdatedAt.seconds * 1000)))
        }
    });
    return arrOfTasks;
};

const createTaskCardsInDOM = function (tasks: Task[], user: any) {
    const container = document.getElementById("tasksCards");
    let i = -1;
    tasks.forEach((task: Task) => {
        i++;
        const card = document.createElement("div");
        card.classList.add("task-card");
        card.id = `${i}`;

        const name = document.createElement('h2');
        const desc = document.createElement('p');
        const deadline_CompletedAt = document.createElement('strong');
        const importance = document.createElement('p')
        const type = document.createElement('p');
        const createdAt = document.createElement('p');
        const status = document.createElement('strong');


        name.classList.add("card-name")
        desc.classList.add("card-desc")
        deadline_CompletedAt.classList.add("card-deadline")
        importance.classList.add("card-importance")
        type.classList.add("card-type")
        createdAt.classList.add("card-createdAt")
        status.classList.add("card-status")

        name.textContent = task.taskName;
        desc.textContent = task.taskDesc;
        importance.textContent = `${task.taskImportance}`;
        type.textContent = task.taskTypeName;
        createdAt.textContent = `${task.TaskCreatedAt.getFullYear().toString()}. ${(task.TaskCreatedAt.getMonth() + 1).toString()}. ${task.TaskCreatedAt.getDate().toString()}`;
        status.textContent = task.taskStatus;

        if (task.taskCompletedAt != null) {
            deadline_CompletedAt.textContent = `${task.taskCompletedAt.getFullYear().toString()}. ${(task.taskCompletedAt.getMonth() + 1).toString()}. ${task.taskCompletedAt.getDate().toString()}. ${task.taskCompletedAt.getHours().toString()}:${task.taskCompletedAt.getMinutes().toString()}`;
        } else {
            deadline_CompletedAt.textContent = `${task.taskDeadline.getFullYear().toString()}. ${(task.taskDeadline.getMonth() + 1).toString()}. ${task.taskDeadline.getDate().toString()}. ${task.taskDeadline.getHours().toString()}:${task.taskDeadline.getMinutes().toString()}`;
        }

        const button = document.createElement('button');
        button.classList.add("showModal")
        button.textContent = "Feladat módosítása";
        button.addEventListener("click", () => {
            const form = document.getElementById("modifyForm");
            if (form) {
                form.classList.add("show");
            };
            const taskNameInput = document.getElementById('taskNameInput') as HTMLFormElement;
            const taskDescInput = document.getElementById('taskDescTextarea') as HTMLFormElement;
            const taskDeadlineInput = document.getElementById('taskDeadlineInput') as HTMLFormElement;
            const taskImportanceInput = document.getElementById('taskImportanceInput') as HTMLFormElement;
            const taskNewTypeInput = document.getElementById('taskNewTypeInput') as HTMLFormElement;

            taskNameInput.value = task.taskName;
            taskDescInput.value = task.taskDesc;
            taskDeadlineInput.value = task.taskDeadline.toISOString().slice(0, 16);;
            taskImportanceInput.value = task.taskImportance;
            taskNewTypeInput.checked = false;

            if (form) {
                form.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    try {
                        const formElements = getFormElements(user);
                        console.log(formElements);
                        const newTask = new Task(formElements[0], formElements[1], new Date(formElements[2]), Number(formElements[3]), formElements[4], task.taskStatus, task.taskCompletedAt, task.TaskCreatedAt, new Date())
                        console.log(newTask);
                        await updateTaskInDB(newTask, user, Number(card.id));
                        const form = document.getElementById("modifyForm") as HTMLFormElement
                        form.classList.remove("show")
                        form.reset();
                        updateImportanceText();
                        syncTaskTypeFields();
                        showMessage("info", "A feladat sikeresen módosult.");
                    } catch (err: any) {
                        showMessage("error", err.message || "Nem sikerült létrehozni a feladatot.");
                    };
                });
            };
        });

        card.appendChild(name)
        card.appendChild(desc)
        card.appendChild(importance)
        card.appendChild(type)
        card.appendChild(createdAt)
        card.appendChild(status)
        card.appendChild(deadline_CompletedAt)
        card.appendChild(button)
        container?.appendChild(card);
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

const updateTaskInDB = async function (task: Task, user: any, index:number) {
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

    user.tasks[index] = taskPayload
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

const showMessage = function (type: "error" | "info", message: string) {
    const messageElement = document.getElementById(type === "error" ? "errorMessage" : "infoMessage");
    if (messageElement) {
        messageElement.textContent = "";
        window.setTimeout(() => {
            messageElement.textContent = message;
        }, 0);
    };
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


document.addEventListener("DOMContentLoaded", init);