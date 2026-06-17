import { getAuthUser } from "../auth/auth.service";
import { updateUserDocumentInDatabase } from "../user/user.service";
import { db } from "../../scripts/firebase";
import { AppError } from "../../models/AppError";
import { normalizeTaskType } from "./taskType.validator";

export const getTaskTypes = function (user: any) {
    const tasksTypes = user.taskTypes
    const arr: string[] = []
    tasksTypes.forEach((tasksType: any) => {
        arr.push(tasksType)
    });
    return (arr);
};
export const uploadTaskType = async function (user: any, taskType: string) {
    if (!isTaskTypeExist(user, taskType)) {
        user.taskTypes.push(taskType);
        const currentUser = getAuthUser();

        await updateUserDocumentInDatabase(db, currentUser.uid, {
            taskTypes: user.taskTypes
        });
    } else {
        throw new AppError("appTaskType/task-type-already-exists")
    }
}
const isTaskTypeExist = function (user: any, taskType: string): boolean {
    const previousTaskTypes = getTaskTypes(user);
    const currentTaskType = normalizeTaskType(taskType);
    for (const previousTaskType of previousTaskTypes) {
        if (normalizeTaskType(previousTaskType) == currentTaskType) {
            return true;
        }
    };
    return false;
};