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
    createTaskCardsInDOM(tasks);
    const taskTypesNames = getTaskTypes(user)
    createSelectOptions(taskTypesNames);
    console.log(tasks)
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

const createTaskCardsInDOM = function (tasks: Task[]) {
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
            deadline_CompletedAt.textContent = `${task.taskCompletedAt.getFullYear().toString()}. ${(task.taskCompletedAt.getMonth() + 1).toString()}. ${task.taskCompletedAt.getDate().toString()}`;
        } else {
            deadline_CompletedAt.textContent = `${task.taskDeadline.getFullYear().toString()}. ${(task.taskDeadline.getMonth() + 1).toString()}. ${task.taskDeadline.getDate().toString()}`;
        }

        const button = document.createElement('button');
        button.classList.add("showModal")
        button.textContent = "Feladat módosítása";
        button.addEventListener("click", () => {
            document.getElementById("modifyForm")?.classList.add("show");
            const taskNameInput = document.getElementById('taskNameInput') as HTMLFormElement;
            const taskDescInput = document.getElementById('taskDescTextarea') as HTMLFormElement;
            const taskDeadlineInput = document.getElementById('taskDeadlineInput') as HTMLFormElement;
            const taskImportanceInput = document.getElementById('taskImportanceInput') as HTMLFormElement;
            const taskNewTypeInput = document.getElementById('taskNewTypeInput') as HTMLFormElement;

            taskNameInput.value = task.taskName;
            taskDescInput.value = task.taskDesc;
            taskDeadlineInput.value = task.taskDeadline;
            taskImportanceInput.value = task.taskImportance;
            taskNewTypeInput.value = false;
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

document.addEventListener("DOMContentLoaded", init);