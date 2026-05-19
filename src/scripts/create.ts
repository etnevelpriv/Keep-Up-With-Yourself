import "../styles/base.css";
import "./header.ts";

const init = function () {
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

document.addEventListener("DOMContentLoaded", init);
