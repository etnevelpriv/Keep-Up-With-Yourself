import "../styles/base.css";
import "../styles/create.css";
import "./header.ts";
import "../styles/loggedInUserNav.css";
import { Task } from "../models/Task.ts";
import { showErrorPopUp, showInfoPopUp } from "../utils/popup.ts";
import { getCurrentUser } from "../services/auth/auth.service.ts";
import { createTask } from "../services/task/task.service.ts";
import { getTaskTypes, uploadTaskType } from "../services/taskType/taskType.service.ts";

const init = async function () {
    const user = await getCurrentUser();
    if (!user) {
        return;
    }
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
            showInfoPopUp("A feladat sikeresen létrejött.");
        } catch (err: any) {
            showErrorPopUp(err.message);
            throw new Error(err)
        };
    });
    document.getElementById("taskImportanceInput")?.addEventListener("input", updateImportanceText);
    document.getElementById('taskNewTypeInput')?.addEventListener("change", () => {
        syncTaskTypeFields();
    });
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
        uploadTaskType(user, taskTypeName);
    } else {
        taskTypeName = (document.getElementById('taskTypeNameSelect') as HTMLFormElement).value;
    }
    return [taskName, taskDesc, taskDeadline, taskImportance, taskTypeName]
};

const createSelectOptions = function (arr: string[]) {
    const select = document.getElementById("taskTypeNameSelect") as HTMLElement;
    arr.forEach(element => {
        const option = document.createElement("option") as HTMLOptionElement;
        option.value = element;
        option.textContent = element;
        select.appendChild(option);
    });
};

const createTaskInDB = async function (task: Task, user: any) {
    const taskPayload = {
        taskName: task.taskName,
        taskDesc: task.taskDesc,
        taskDeadline: task.taskDeadline,
        taskImportance: task.taskImportance,
        taskTypeName: task.taskTypeName,
        taskStatus: task.taskStatus,
        taskCompletedAt: task.taskCompletedAt,
        taskCreatedAt: task.taskCreatedAt,
        taskUpdatedAt: task.taskUpdatedAt
    };

    await createTask(user.userID, taskPayload);
};

document.addEventListener("DOMContentLoaded", init);
