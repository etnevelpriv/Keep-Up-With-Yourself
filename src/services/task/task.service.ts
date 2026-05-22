import { getCurrentUser } from "../auth/auth.service";
import { updateUserDocumentInDatabase } from "../user/user.service";

export const createTask = async function (user: any, data: any) {
    user.tasks.push(data);
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return;
    }
    await updateUserDocumentInDatabase(currentUser.userID, {
        tasks: user.tasks
    });
};
export const getTasks = function (user: any) {
    const tasks = user.tasks;
    return tasks;
};
export const getTask = function (user: any, x: number) {
    return (user.tasks[x])
};
export const updateTask = async function (user: any, data: any, index: number) {
    user.tasks[index] = data;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return;
    }
    await updateUserDocumentInDatabase(currentUser.userID, {
        tasks: user.tasks
    });
};
export const deleteTask = function (_uid: string, _tid: string) {

};