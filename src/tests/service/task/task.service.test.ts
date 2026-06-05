import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, type Firestore } from "firebase/firestore";
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createTask, getTask, getTasks, updateTask, deleteTask } from "../../../services/task/task.service";

vi.mock("firebase/firestore", () => ({
    addDoc: vi.fn(),
    collection: vi.fn(() => {
        return (
            {
                path: "TESZT_COL_PATH"
            }
        )

    }),
    deleteDoc: vi.fn(),
    doc: vi.fn(() => {
        return (
            {
                path: "TESZT_REF_PATH"
            }
        )
    }),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
}));
beforeEach(() => {
    vi.resetAllMocks();
});
describe("VALID Task Service Mocks Teszt", () => {
    test("VVAliD createTask teszt", async () => {
        const uid = "TESZT_UID"
        const db: Firestore = {} as Firestore;
        const data = {
            taskName: "task.taskName",
            taskDesc: "task.taskDesc",
            taskDeadline: new Date(2999, 9, 9),
            taskImportance: 4,
            taskTypeName: "task.taskTypeName",
            taskStatus: "Lejárt",
            taskCompletedAt: new Date(2023, 9, 9),
            taskCreatedAt: new Date(2022, 9, 9),
            taskUpdatedAt: new Date(2023, 9, 9)
        };
        vi.mocked(addDoc).mockResolvedValue({
            id:"TESZT_ID"
        }as any);

        expect(await createTask(db, uid, data)).toEqual("TESZT_ID");
        expect(addDoc).toHaveBeenCalledWith({path:"TESZT_COL_PATH"},data);
        expect(collection).toHaveBeenCalledWith(db, "users", uid, "tasks");
        
    });
});
describe("INVALID Task Service Mocks Teszt", () => {

})