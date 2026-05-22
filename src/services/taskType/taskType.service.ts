import { getCurrentUser } from "../auth/auth.service";
import { updateUserDocumentInDatabase } from "../user/user.service";
export const getTaskTypes = function (user: any) {
    const tasksTypes = user.taskTypes
    const arr: string[] = []
    tasksTypes.forEach((tasksType: any) => {
        arr.push(tasksType)
    });
    return (arr);
};
export const getNormalizedTaskTypes = function (uid: string) {

}
export const uploadTaskType = async function (user: any, taskType: string) {
    user.taskTypes.push(taskType);
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return;
    };
    await updateUserDocumentInDatabase(currentUser.userID, {
        taskTypes: user.taskTypes
    });
}
export const deleteTaskType = function (_uid: string, _taskType: string) {

}
export const normalizeTaskType = function (_taskType: string) {

};