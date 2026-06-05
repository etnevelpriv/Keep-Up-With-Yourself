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
    test("VALID createTask teszt", async () => {
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
            id: "TESZT_ID"
        } as any);

        expect(await createTask(db, uid, data)).toEqual("TESZT_ID");
        expect(addDoc).toHaveBeenCalledWith({ path: "TESZT_COL_PATH" }, data);
        expect(collection).toHaveBeenCalledWith(db, "users", uid, "tasks");
    });
    test("VALID getTasks teszt", async () => {
        const uid = "TESZT_UID"
        const db: Firestore = {} as Firestore;
        const tasks = {
            docs: [
                {
                    id: "ID1",
                    data: () => ({
                        taskName: "Task1"
                    })
                },
                {
                    id: "ID2",
                    data: () => ({
                        taskName: "Task2"
                    })
                }
            ]
        }
        vi.mocked(getDocs).mockResolvedValue(tasks as any);
        expect(await getTasks(db, uid)).toEqual([
            {
                id: "ID1",
                taskName: "Task1"
            },
            {
                id: "ID2",
                taskName: "Task2"
            }
        ]);
        expect(collection).toHaveBeenCalledWith(db, "users", uid, "tasks");
        expect(getDocs).toHaveBeenCalledWith({ path: "TESZT_COL_PATH" });
    });
    test("VALID getTask teszt, ahol van ilyen dokumentum", async () => {
        const uid = "TESZT_UID"
        const tid = "TESZT_TID"
        const db: Firestore = {} as Firestore;
        vi.mocked(getDoc).mockResolvedValue({
            id: tid,
            exists: () => (true),
            data: () => ({
                taskName: "Task1"
            })
        } as any)
        expect(await getTask(db, uid, tid)).toEqual({ id: tid, taskName:"Task1" });
        expect(getDoc).toHaveBeenCalledWith({ path: "TESZT_REF_PATH" });
        expect(doc).toHaveBeenCalledWith(db, "users", uid, "tasks", tid);
    });
    test("VALID getTask teszt, ahol nincs ilyen dokumentum", async () => {
        const uid = "TESZT_UID"
        const tid = "TESZT_TID"
        const db: Firestore = {} as Firestore;
        vi.mocked(getDoc).mockResolvedValue({
            exists: () => (false),
            data: () => ({
                tid: tid
            })
        } as any)
        expect(await getTask(db, uid, tid)).toEqual(null);
        expect(getDoc).toHaveBeenCalledWith({ path: "TESZT_REF_PATH" });
        expect(doc).toHaveBeenCalledWith(db, "users", uid, "tasks", tid);
    });
    test("VALID updateTask teszt", async () => {
        const uid = "TESZT_UID"
        const tid = "TESZT_TID"
        const db: Firestore = {} as Firestore;
        const data = {
            taskName: "NewTaskName"
        };
        vi.mocked(updateDoc).mockResolvedValue(undefined);

        await updateTask(db, uid, tid, data);
        expect(updateDoc).toHaveBeenCalledWith({ path: "TESZT_REF_PATH" }, data);
        expect(doc).toHaveBeenCalledWith(db, "users", uid, "tasks", tid);
    });
    test("VALID deleteTask teszt", async () => {
        const uid = "TESZT_UID"
        const tid = "TESZT_TID"
        const db: Firestore = {} as Firestore;
        vi.mocked(deleteDoc).mockResolvedValue(undefined);

        await deleteTask(db, uid, tid);
        expect(deleteDoc).toHaveBeenCalledWith({ path: "TESZT_REF_PATH" });
        expect(doc).toHaveBeenCalledWith(db, "users", uid, "tasks", tid);
    });
});
describe("INVALID Task Service Mocks Teszt", () => {
    test("INVALID createTask teszt", async () => {
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
        vi.mocked(addDoc).mockRejectedValue(new Error("Firebase addDoc error"));

        await expect(createTask(db, uid, data)).rejects.toThrow("Firebase addDoc error");
        expect(addDoc).toHaveBeenCalledWith({ path: "TESZT_COL_PATH" }, data);
        expect(collection).toHaveBeenCalledWith(db, "users", uid, "tasks");
    });
    test("INVALID getTasks teszt", async () => {
        const uid = "TESZT_UID"
        const db: Firestore = {} as Firestore;
        vi.mocked(getDocs).mockRejectedValue(new Error("Firestore getDocs hiba"));
        await expect(getTasks(db, uid)).rejects.toThrow("Firestore getDocs hiba");
        expect(collection).toHaveBeenCalledWith(db, "users", uid, "tasks");
        expect(getDocs).toHaveBeenCalledWith({ path: "TESZT_COL_PATH" });
    });
    test("INVALID getTask teszt", async () => {
        const uid = "TESZT_UID"
        const tid = "TESZT_TID"
        const db: Firestore = {} as Firestore;
        vi.mocked(getDoc).mockRejectedValue(new Error("Firestore getDoc hiba"))
        await expect(getTask(db, uid, tid)).rejects.toThrow("Firestore getDoc hiba");
        expect(getDoc).toHaveBeenCalledWith({ path: "TESZT_REF_PATH" });
        expect(doc).toHaveBeenCalledWith(db, "users", uid, "tasks", tid);
    });
    test("INVALID updateTask teszt", async () => {
        const uid = "TESZT_UID"
        const tid = "TESZT_TID"
        const db: Firestore = {} as Firestore;
        const data = {
            taskName: "NewTaskName"
        };
        vi.mocked(updateDoc).mockRejectedValue(new Error("Firestore updateDoc hiba"));

        await expect(updateTask(db, uid, tid, data)).rejects.toThrow("Firestore updateDoc hiba");
        expect(updateDoc).toHaveBeenCalledWith({ path: "TESZT_REF_PATH" }, data);
        expect(doc).toHaveBeenCalledWith(db, "users", uid, "tasks", tid);
    });
    test("INVALID deleteTask teszt", async () => {
        const uid = "TESZT_UID"
        const tid = "TESZT_TID"
        const db: Firestore = {} as Firestore;
        vi.mocked(deleteDoc).mockRejectedValue(new Error("Firestore deleteDoc hiba"));

        await expect(deleteTask(db, uid, tid)).rejects.toThrow("Firestore deleteDoc hiba");
        expect(deleteDoc).toHaveBeenCalledWith({ path: "TESZT_REF_PATH" });
        expect(doc).toHaveBeenCalledWith(db, "users", uid, "tasks", tid);
    });
})