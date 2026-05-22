import "../styles/base.css";
import "../styles/tasks.css";
import "./header.ts";
import "../styles/loggedInUserNav.css";
import { Task } from "../models/Task.ts";
import { showErrorPopUp, showInfoPopUp } from "../utils/popup.ts";
import { getCurrentUser } from "../services/auth/auth.service.ts";
import { updateUserDocumentInDatabase } from "../services/user/user.service.ts";

type TaskViewItem = {
    task: Task;
    originalIndex: number;
};

let taskViewItems: TaskViewItem[] = [];

const init = async function () {
    const user = getCurrentUser();
    const arr = getTasks(user)
    const tasks: Task[] = turnArrIntoTasks(arr);
    taskViewItems = tasks.map((task, originalIndex) => ({ task, originalIndex }));
    const taskTypesNames = getTaskTypes(user)
    createSelectOptions(taskTypesNames);
    console.log(tasks)
    setupTaskControls(user);
    renderTasks(user);
    setupModifyModal();
    updateImportanceText();
    syncTaskTypeFields();
    document.getElementById("taskImportanceInput")?.addEventListener("input", updateImportanceText);
    document.getElementById('taskNewTypeInput')?.addEventListener("change", () => {
        syncTaskTypeFields();
    });
};

// const getUser = async function (auth: any) {
//     return new Promise((resolve, reject) => {
//         try {
//             onAuthStateChanged(auth, async (user) => {
//                 if (user) {
//                     const docRef = doc(db, "users", user.uid);
//                     const docSnap = await getDoc(docRef);
//                     if (docSnap.exists()) {
//                         if (user.emailVerified) {
//                             resolve(docSnap.data());
//                         };
//                     };
//                 };
//             });
//         } catch (err: any) {
//             reject(err);
//             throw new Error(err);
//         }
//     })
// };

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

const turnArrIntoTasks = function (arr: any[]) {
    const arrOfTasks: Task[] = [];
    arr.forEach((element: any) => {
        console.log(element.TaskCreatedAt)
        if (element.taskCompletedAt == null) {
            arrOfTasks.push(new Task(element.taskName, element.taskDesc, new Date(element.taskDeadline.seconds * 1000), element.taskImportance, element.taskTypeName, element.taskStatus, null, new Date(element.TaskCreatedAt.seconds * 1000), new Date(element.taskUpdatedAt.seconds * 1000)))
        } else {
            arrOfTasks.push(new Task(element.taskName, element.taskDesc, new Date(element.taskDeadline.seconds * 1000), element.taskImportance, element.taskTypeName, element.taskStatus, new Date(element.taskCompletedAt.seconds * 1000), new Date(element.TaskCreatedAt.seconds * 1000), new Date(element.taskUpdatedAt.seconds * 1000)))
        }
    });
    return arrOfTasks;
};

const createTaskCardsInDOM = async function (tasks: TaskViewItem[], user: any) {
    const container = document.getElementById("tasksCards");
    if (!container) return;

    container.innerHTML = "";

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("tasks-empty");
        const emptyTitle = document.createElement("h2");
        const emptyText = document.createElement("p");
        emptyTitle.textContent = "Nincs megjeleníthető feladat";
        emptyText.textContent = "A kiválasztott szűrőkkel nincs találat. Töröld a szűrőket, vagy válassz más beállítást.";
        emptyMessage.appendChild(emptyTitle);
        emptyMessage.appendChild(emptyText);
        container.appendChild(emptyMessage);
        return;
    };

    tasks.forEach(async (taskItem: TaskViewItem) => {

        const task = taskItem.task;
        if ((task.taskDeadline.getTime() < (new Date().getTime())) && task.taskStatus != "Teljesített") {
            task.taskStatus = "Lejárt";
            task.taskUpdatedAt = new Date();
            await updateTaskInDB(task, user, taskItem.originalIndex);
        };

        const card = document.createElement("div");
        card.classList.add("task-card");
        card.id = `${taskItem.originalIndex}`;
        card.dataset.taskStatus = task.taskStatus;
        card.dataset.taskImportance = `${task.taskImportance}`;

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
        importance.textContent = `Fontosság: ${task.taskImportance} / 5`;
        type.textContent = `Típus: ${task.taskTypeName}`;
        createdAt.textContent = `Létrehozva: ${formatDate(task.TaskCreatedAt)}`;
        status.textContent = task.taskStatus;

        if (task.taskCompletedAt != null) {
            deadline_CompletedAt.textContent = `Befejezve: ${formatDateTime(task.taskCompletedAt)}`;
        } else {
            deadline_CompletedAt.textContent = `Határidő: ${formatDateTime(task.taskDeadline)}`;
        }

        const button = document.createElement('button');
        button.classList.add("show-modal")
        button.textContent = "Feladat módosítása";
        button.addEventListener("click", () => {
            const form = document.getElementById("modifyForm");
            const modal = document.getElementById("modifyModal");
            if (form) {
                form.classList.add("show");
            };
            if (modal) {
                modal.classList.add("show");
            };
            const taskNameInput = document.getElementById('taskNameInput') as HTMLInputElement;
            const taskDescInput = document.getElementById('taskDescTextarea') as HTMLTextAreaElement;
            const taskDeadlineInput = document.getElementById('taskDeadlineInput') as HTMLInputElement;
            const taskImportanceInput = document.getElementById('taskImportanceInput') as HTMLInputElement;
            const taskNewTypeInput = document.getElementById('taskNewTypeInput') as HTMLInputElement;

            taskNameInput.value = task.taskName;
            taskDescInput.value = task.taskDesc;
            taskDeadlineInput.value = toDateTimeInputValue(task.taskDeadline);
            taskImportanceInput.value = `${task.taskImportance}`;
            taskNewTypeInput.checked = false;
            syncTaskTypeFields();
            updateImportanceText();

            if (form) {
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    try {
                        const formElements = getFormElements(user);
                        console.log(formElements);
                        const newTask = new Task(formElements[0], formElements[1], new Date(formElements[2]), Number(formElements[3]), formElements[4], task.taskStatus, task.taskCompletedAt, task.TaskCreatedAt, new Date())
                        console.log(newTask);
                        await updateTaskInDB(newTask, user, taskItem.originalIndex);
                        taskItem.task = newTask;
                        const form = document.getElementById("modifyForm") as HTMLFormElement
                        form.classList.remove("show")
                        modal?.classList.remove("show");
                        form.reset();
                        updateImportanceText();
                        syncTaskTypeFields();
                        renderTasks(user);
                        showInfoPopUp("A feladat sikeresen módosult.");
                    } catch (err: any) {
                        showErrorPopUp(err.message || "Nem sikerült módosítani a feladatot.");
                    };
                };
            };
        });

        const buttonReady = document.createElement('button');
        buttonReady.classList.add("button-ready")
        if (task.taskStatus == "Teljesített") {
            buttonReady.textContent = "Mégsincs kész";
            buttonReady.addEventListener("click", async () => {
                try {
                    if (task.taskDeadline.getTime() < new Date().getTime()) {
                        task.taskStatus = "Lejárt";
                    } else {
                        task.taskStatus = "Folyamatban";
                    }
                    task.taskCompletedAt = null;
                    task.taskUpdatedAt = new Date();
                    await updateTaskInDB(task, user, taskItem.originalIndex);
                    renderTasks(user);
                    showInfoPopUp("A feladat állapota frissült.");
                } catch (err: any) {
                    showErrorPopUp(err.message || "Nem sikerült frissíteni a feladatot.");
                };
            });

        } else {
            buttonReady.textContent = "Kész";
            buttonReady.addEventListener("click", async () => {
                try {
                    task.taskStatus = "Teljesített";
                    task.taskCompletedAt = new Date();
                    task.taskUpdatedAt = new Date();
                    await updateTaskInDB(task, user, taskItem.originalIndex);
                    renderTasks(user);
                    showInfoPopUp("A feladat teljesítettként lett jelölve.");
                } catch (err: any) {
                    showErrorPopUp(err.message || "Nem sikerült frissíteni a feladatot.");
                };
            });
        };
        card.appendChild(name)
        card.appendChild(desc)
        card.appendChild(importance)
        card.appendChild(type)
        card.appendChild(createdAt)
        card.appendChild(status)
        card.appendChild(deadline_CompletedAt)
        card.appendChild(button)
        card.appendChild(buttonReady)
        container.appendChild(card);
    });
};

const renderTasks = function (user: any) {
    const visibleTasks = getFilteredAndSortedTasks();
    createTaskCardsInDOM(visibleTasks, user);
    updateTasksSummary(visibleTasks.length, taskViewItems.length);
};

const setupTaskControls = function (user: any) {
    const statusFilters = document.querySelectorAll<HTMLInputElement>('input[name="statusFilter"]');
    const importanceFilters = document.querySelectorAll<HTMLInputElement>('input[name="importanceFilter"]');
    const sortSelect = document.getElementById("taskSortSelect") as HTMLSelectElement | null;
    const resetButton = document.getElementById("resetTaskFilters");

    statusFilters.forEach((filter) => {
        filter.addEventListener("change", () => renderTasks(user));
    });

    importanceFilters.forEach((filter) => {
        filter.addEventListener("change", () => renderTasks(user));
    });

    sortSelect?.addEventListener("change", () => renderTasks(user));

    resetButton?.addEventListener("click", () => {
        statusFilters.forEach((filter) => {
            filter.checked = false;
        });
        importanceFilters.forEach((filter) => {
            filter.checked = false;
        });
        if (sortSelect) {
            sortSelect.value = "none";
        };
        renderTasks(user);
        showInfoPopUp("A szűrők törölve lettek.");
    });
};

const getFilteredAndSortedTasks = function () {
    const selectedStatuses = getCheckedValues('input[name="statusFilter"]');
    const selectedImportance = getCheckedValues('input[name="importanceFilter"]');
    const sortSelect = document.getElementById("taskSortSelect") as HTMLSelectElement | null;
    const sortMode = sortSelect?.value || "none";

    const filteredTasks = taskViewItems.filter((taskItem) => {
        const statusMatches = selectedStatuses.length === 0 || selectedStatuses.includes(taskItem.task.taskStatus);
        const importanceMatches = selectedImportance.length === 0 || selectedImportance.includes(`${taskItem.task.taskImportance}`);
        return statusMatches && importanceMatches;
    });

    return [...filteredTasks].sort((firstTask, secondTask) => {
        if (sortMode === "deadline-asc") {
            return firstTask.task.taskDeadline.getTime() - secondTask.task.taskDeadline.getTime();
        };

        if (sortMode === "deadline-desc") {
            return secondTask.task.taskDeadline.getTime() - firstTask.task.taskDeadline.getTime();
        };

        if (sortMode === "name-asc") {
            return firstTask.task.taskName.localeCompare(secondTask.task.taskName, "hu", { sensitivity: "base" });
        };

        if (sortMode === "name-desc") {
            return secondTask.task.taskName.localeCompare(firstTask.task.taskName, "hu", { sensitivity: "base" });
        };

        return firstTask.originalIndex - secondTask.originalIndex;
    });
};

const getCheckedValues = function (selector: string) {
    const checkedInputs = document.querySelectorAll<HTMLInputElement>(`${selector}:checked`);
    return Array.from(checkedInputs).map((input) => input.value);
};

const updateTasksSummary = function (visibleCount: number, allCount: number) {
    const summary = document.getElementById("tasksSummary");
    if (!summary) return;

    if (allCount === 0) {
        summary.textContent = "Még nincs feladatod.";
        return;
    };

    summary.textContent = `${visibleCount} / ${allCount} feladat látható`;
};

const setupModifyModal = function () {
    const modal = document.getElementById("modifyModal");
    const form = document.getElementById("modifyForm") as HTMLFormElement | null;
    const closeButton = modal?.querySelector(".modal-head span") as HTMLElement | null;
    if (!modal || !form || !closeButton) return;

    closeButton.textContent = "x";
    closeButton.setAttribute("role", "button");
    closeButton.setAttribute("tabindex", "0");
    closeButton.setAttribute("aria-label", "Módosító ablak bezárása");

    const closeModal = function () {
        form.classList.remove("show");
        modal.classList.remove("show");
    };

    closeButton.addEventListener("click", closeModal);
    closeButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            closeModal();
        };
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        };
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        };
    });
};

const formatDate = function (date: Date) {
    return date.toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
};

const formatDateTime = function (date: Date) {
    return date.toLocaleString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const toDateTimeInputValue = function (date: Date) {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
};

const getFormElements = function (user: any): [string, string, string, string, string] {
    const taskName = (document.getElementById('taskNameInput') as HTMLInputElement).value;
    const taskDesc = (document.getElementById('taskDescTextarea') as HTMLTextAreaElement).value;
    const taskDeadline = (document.getElementById('taskDeadlineInput') as HTMLInputElement).value;
    const taskImportance = (document.getElementById('taskImportanceInput') as HTMLInputElement).value;
    const taskNewType = (document.getElementById('taskNewTypeInput') as HTMLInputElement).checked;
    let taskTypeName = ""
    if (taskNewType) {
        taskTypeName = (document.getElementById('taskTypeNameInput') as HTMLInputElement).value;
        saveTaskTypeToDB(taskTypeName, user)
    } else {
        taskTypeName = (document.getElementById('taskTypeNameSelect') as HTMLSelectElement).value;
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

        // try {
        //     const auth = getAuth();
        //     const currentUser = auth.currentUser;
        //     if (currentUser) {
        //         const userDocRef = doc(db, "users", currentUser.uid);
        //         await updateDoc(userDocRef, {
        //             taskTypes: user.taskTypes
        //         });
        //         console.log("Minden szupi");
        //     }
        // } catch (err: any) {
        //     throw new Error(err);
        // }
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return;
        }

        await updateUserDocumentInDatabase(currentUser.uid, {
            taskTypes: user.taskTypes
        });
    }
}

const updateTaskInDB = async function (task: Task, user: any, index: number) {
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
    // console.log(user);
    // try {
    //     const auth = getAuth();
    //     const currentUser = auth.currentUser;
    //     if (currentUser) {
    //         const userDocRef = doc(db, "users", currentUser.uid);
    //         await updateDoc(userDocRef, {
    //             tasks: user.tasks
    //         });
    //         console.log("Minden szupi");
    //     }
    // } catch (err: any) {
    //     throw new Error(err);
    // }
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return;
    }

    await updateUserDocumentInDatabase(currentUser.uid, {
        tasks: user.tasks
    });
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
