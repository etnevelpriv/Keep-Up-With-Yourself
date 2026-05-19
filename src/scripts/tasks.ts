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
    const tasks:Task[] = turnArrIntoTasks(arr);
    createTaskCardsInDOM(tasks);
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
        const deadline = document.createElement('strong');
        const importance = document.createElement('p')
        const type = document.createElement('p');

        name.classList.add("card-name")
        desc.classList.add("card-desc")
        deadline.classList.add("card-deadline")
        importance.classList.add("card-importance")
        type.classList.add("card-type")

        name.textContent = task.taskName;
        desc.textContent = task.taskDesc;
        deadline.textContent = task.taskDeadline.toString();
        importance.textContent = `${task.taskImportance}`;
        type.textContent = task.taskTypeName;

        card.appendChild(name)
        card.appendChild(desc)
        card.appendChild(deadline)
        card.appendChild(importance)
        card.appendChild(type)
        container?.appendChild(card);
    });
};

document.addEventListener("DOMContentLoaded", init);