import { expect, test, describe, vi, beforeEach } from 'vitest';
import { getAuthUser } from '../../../services/auth/auth.service';
import { updateUserDocumentInDatabase } from '../../../services/user/user.service';
import { db } from '../../../scripts/firebase';
import { getTaskTypes, uploadTaskType } from '../../../services/taskType/taskType.service';

vi.mock("../../../scripts/firebase", () => ({
    db: { path: "TESZT_DB" }
}));

vi.mock("../../../services/auth/auth.service", () => ({
    getAuthUser: vi.fn()
}));

vi.mock("../../../services/user/user.service", () => ({
    updateUserDocumentInDatabase: vi.fn()
}));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("VALID TaskType Service Mock teszt", () => {
    test("VALID getTaskTypes visszaadja a user taskTypes listajat", () => {
        const user = {
            taskTypes: ["Tanulas", "Munka", "Takaritas"]
        };

        expect(getTaskTypes(user)).toEqual(["Tanulas", "Munka", "Takaritas"]);
    });
    test("VALID uploadTaskType uj taskType-ot ment", async () => {
        const user = {
            taskTypes: ["Tanulas", "Munka"]
        };
        vi.mocked(getAuthUser).mockReturnValue({ uid: "TESZT_UID" } as any);
        vi.mocked(updateUserDocumentInDatabase).mockResolvedValue(undefined);

        await uploadTaskType(user, "Takaritas");

        expect(user.taskTypes).toEqual(["Tanulas", "Munka", "Takaritas"]);
        expect(getAuthUser).toHaveBeenCalled();
        expect(updateUserDocumentInDatabase).toHaveBeenCalledWith(db, "TESZT_UID", {
            taskTypes: ["Tanulas", "Munka", "Takaritas"]
        });
    });
});

describe("INVALID TaskType Service Mock teszt", () => {
    test("INVALID uploadTaskType duplikalt taskType eseten hibat dob", async () => {
        const user = {
            taskTypes: ["Tanulas", "Munka"]
        };

        await expect(uploadTaskType(user, "tanulas")).rejects.toThrow("appTaskType/task-type-already-exists");
        expect(updateUserDocumentInDatabase).not.toHaveBeenCalled();
    });
    test("INVALID uploadTaskType tul rovid taskType eseten hibat dob", async () => {
        const user = {
            taskTypes: ["Tanulas", "Munka"]
        };

        await expect(uploadTaskType(user, "A")).rejects.toThrow("validation/task-type-too-short");
        expect(updateUserDocumentInDatabase).not.toHaveBeenCalled();
    });
    test("INVALID uploadTaskType elejen szokozt tartalmazo taskType eseten hibat dob", async () => {
        const user = {
            taskTypes: ["Tanulas", "Munka"]
        };

        await expect(uploadTaskType(user, " Takaritas")).rejects.toThrow("validation/task-type-value-not-accepted");
        expect(updateUserDocumentInDatabase).not.toHaveBeenCalled();
    });
    test("INVALID uploadTaskType adatbazis hiba eseten tovabbdobja a hibat", async () => {
        const user = {
            taskTypes: ["Tanulas", "Munka"]
        };
        vi.mocked(getAuthUser).mockReturnValue({ uid: "TESZT_UID" } as any);
        vi.mocked(updateUserDocumentInDatabase).mockRejectedValue(new Error("Firestore update hiba"));

        await expect(uploadTaskType(user, "Takaritas")).rejects.toThrow("Firestore update hiba");
        expect(updateUserDocumentInDatabase).toHaveBeenCalledWith(db, "TESZT_UID", {
            taskTypes: ["Tanulas", "Munka", "Takaritas"]
        });
    });
});
