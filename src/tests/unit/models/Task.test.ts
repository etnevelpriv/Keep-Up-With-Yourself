import { expect, test, describe } from 'vitest'
import { createTestTask } from './setup/taskTestSetup';

describe("VALID Task class tesztelese", () => {
    test("Valid adatokkal letrehozni a taskot. Mindent ellenorizni", () => {
        const testTask = createTestTask({
            taskDesc: "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            taskDeadline: new Date("2026-09-09"),
            taskCreatedAt: new Date("2026-01-02"),
            taskUpdatedAt: new Date("2026-02-03"),
        });
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskDesc).toBe('TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.');
        expect(testTask.taskDeadline.getTime()).toBe(new Date("2026-09-09").getTime());
        expect(testTask.taskImportance).toBe(3);
        expect(testTask.taskTypeName).toBe('TESZT_TASKTYPENAME');
        expect(testTask.taskStatus).toBe('Folyamatban');
        expect(testTask.taskCompletedAt).toBe(null);
        expect(testTask.taskCreatedAt.getTime()).toBe(new Date("2026-01-02").getTime());
        expect(testTask.taskUpdatedAt.getTime()).toBe(new Date("2026-02-03").getTime());
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskCompletedAt == null", () => {
        const testTask = createTestTask({
            taskCompletedAt: null
        });
        expect(testTask.taskCompletedAt).toBe(null);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskCompletedAt != null", () => {
        const testTask = createTestTask({
            taskCompletedAt: new Date("2026-10-10")
        });
        expect((testTask.taskCompletedAt)?.getTime()).toBe(new Date("2026-10-10").getTime());
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskImportance egy alacsony hatarertek", () => {
        const testTask = createTestTask({
            taskImportance: 1
        });
        expect(testTask.taskImportance).toBe(1);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskImportance egy magas hatarertek", () => {
        const testTask = createTestTask({
            taskImportance: 5
        });
        expect(testTask.taskImportance).toBe(5);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskStatus == Folyamatban", () => {
        const testTask = createTestTask({
            taskStatus: "Folyamatban"
        });
        expect(testTask.taskStatus).toBe('Folyamatban');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskStatus == Lejárt", () => {
        const testTask = createTestTask({
            taskStatus: "Lejárt"
        });
        expect(testTask.taskStatus).toBe('Lejárt');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskStatus == Teljesített", () => {
        const testTask = createTestTask({
            taskStatus: "Teljesített"
        });
        expect(testTask.taskStatus).toBe('Teljesített');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskDesc egy ures string", () => {
        const testTask = createTestTask({
            taskDesc: ""
        });
        expect(testTask.taskDesc).toBe('');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskName trimelve van", () => {
        const testTask = createTestTask({
            taskName: "   TESZT_NEV_TRIM   "
        });
        expect(testTask.taskName).toBe('TESZT_NEV_TRIM');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskDesc trimelve van", () => {
        const testTask = createTestTask({
            taskDesc: "   TESZT_DESC_TRIM   "
        });
        expect(testTask.taskDesc).toBe('TESZT_DESC_TRIM');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskTypeName trimelve van", () => {
        const testTask = createTestTask({
            taskTypeName: "   TESZT_TYPE_TRIM   "
        });
        expect(testTask.taskTypeName).toBe('TESZT_TYPE_TRIM');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskName HTML karaktereket sanitizal", () => {
        const testTask = createTestTask({
            taskName: "<TESZT & NÉV>"
        });
        expect(testTask.taskName).toBe('&lt;TESZT &amp; NÉV&gt;');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskDesc HTML karaktereket sanitizal", () => {
        const testTask = createTestTask({
            taskDesc: 'Leiras <b>"kiemelt"</b> & egyeb'
        });
        expect(testTask.taskDesc).toBe('Leiras &lt;b&gt;&quot;kiemelt&quot;&lt;/b&gt; &amp; egyeb');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskTypeName HTML karaktereket sanitizal", () => {
        const testTask = createTestTask({
            taskTypeName: "<TESZT 'TYPE'>"
        });
        expect(testTask.taskTypeName).toBe('&lt;TESZT &#39;TYPE&#39;&gt;');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskName pontosan 3 karakter", () => {
        const testTask = createTestTask({
            taskName: "Abc"
        });
        expect(testTask.taskName).toBe('Abc');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskName pontosan 50 karakter", () => {
        const fiftyCharacterName = "A".repeat(50);
        const testTask = createTestTask({
            taskName: fiftyCharacterName
        });
        expect(testTask.taskName).toBe(fiftyCharacterName);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskDesc pontosan 300 karakter", () => {
        const threeHundredCharacterDesc = "D".repeat(300);
        const testTask = createTestTask({
            taskDesc: threeHundredCharacterDesc
        });
        expect(testTask.taskDesc).toBe(threeHundredCharacterDesc);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskTypeName pontosan 40 karakter", () => {
        const fortyCharacterTypeName = "T".repeat(40);
        const testTask = createTestTask({
            taskTypeName: fortyCharacterTypeName
        });
        expect(testTask.taskTypeName).toBe(fortyCharacterTypeName);
    });
    test("Valid adatokkal letrehozni a taskot, ahol a hatarido megegyezik a letrehozas idejevel", () => {
        const sameMoment = new Date("2026-01-10T10:00:00.000Z");
        const testTask = createTestTask({
            taskDeadline: sameMoment,
            taskCreatedAt: new Date(sameMoment.getTime()),
            taskUpdatedAt: new Date("2026-01-10T10:30:00.000Z")
        });
        expect(testTask.taskDeadline.getTime()).toBe(sameMoment.getTime());
    });
    test("Valid adatokkal letrehozni a taskot, ahol a letrehozas es a frissites kulon Date peldany", () => {
        const createdAt = new Date("2026-01-11T08:00:00.000Z");
        const updatedAt = new Date("2026-01-11T09:00:00.000Z");
        const testTask = createTestTask({
            taskCreatedAt: new Date(createdAt.getTime()),
            taskUpdatedAt: new Date(updatedAt.getTime())
        });
        expect(testTask.taskCreatedAt.getTime()).toBe(createdAt.getTime());
        expect(testTask.taskUpdatedAt.getTime()).toBe(updatedAt.getTime());
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskCompletedAt ugyanaz az idopont, mint a frissites", () => {
        const completedAt = new Date("2026-10-10T12:00:00.000Z");
        const testTask = createTestTask({
            taskCompletedAt: completedAt,
            taskUpdatedAt: new Date("2026-10-10T12:00:00.000Z")
        });
        expect(testTask.taskCompletedAt?.getTime()).toBe(completedAt.getTime());
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskImportance kozepso ertek", () => {
        const testTask = createTestTask({
            taskImportance: 2
        });
        expect(testTask.taskImportance).toBe(2);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskImportance magasabb kozepso ertek", () => {
        const testTask = createTestTask({
            taskImportance: 4
        });
        expect(testTask.taskImportance).toBe(4);
    });
    test("Valid adatokkal letrehozni a taskot, ahol toString minden fontos adatot tartalmaz", () => {
        const testTask = createTestTask({
            taskName: "TESZT_TO_STRING",
            taskDesc: "Leiras toStringhez",
            taskDeadline: new Date("2026-07-07T07:07:07.000Z"),
            taskImportance: 5,
            taskTypeName: "TESZT_TYPE",
            taskStatus: "Teljesített",
            taskCompletedAt: new Date("2026-05-08T08:08:08.000Z"),
            taskCreatedAt: new Date("2026-05-01T01:01:01.000Z"),
            taskUpdatedAt: new Date("2026-07-09T09:09:09.000Z")
        });
        const result = testTask.toString();
        expect(result).toContain('Nev: TESZT_TO_STRING');
        expect(result).toContain('Leiras:Leiras toStringhez');
        expect(result).toContain('Fontossag:5');
        expect(result).toContain('Tipus:TESZT_TYPE');
        expect(result).toContain('Statusz:Teljesített');
        expect(result).toContain('Befejezve:');
    });
});
describe("INVALID Task class tesztelese", () => {
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskName egy ures string", () => {
        expect(() => createTestTask({
            taskName: ""
        })).toThrow("validation/invalid-task-name");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskName nem string", () => {
        expect(() => createTestTask({
            taskName : 10 as any
        })).toThrow("validation/invalid-text-type");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskName == `   `", () => {
        expect(() => createTestTask({
            taskName: "   "
        })).toThrow("validation/invalid-task-name");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskDesc nem string", () => {
        expect(() => createTestTask({
            taskDesc: 3 as any
        })).toThrow("validation/invalid-text-type");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskName tul rovid", () => {
        expect(() => createTestTask({
            taskName: "Ab"
        })).toThrow("validation/invalid-task-name");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskName tul hosszu", () => {
        expect(() => createTestTask({
            taskName: "A".repeat(51)
        })).toThrow("validation/invalid-task-name");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskDesc tul hosszu", () => {
        expect(() => createTestTask({
            taskDesc: "D".repeat(301)
        })).toThrow("validation/invalid-task-description");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, adattal/adatokkal letrehozni a taskot, ahol taskTypeName taskTypeName ures string", () => {
        expect(() => createTestTask({
            taskTypeName: ""
        })).toThrow("validation/invalid-task-taskType");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskTypeName tul hosszu", () => {
        expect(() => createTestTask({
            taskTypeName: "T".repeat(41)
        })).toThrow("validation/invalid-task-taskType");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskImportance nulla", () => {
        expect(() => createTestTask({
            taskImportance: 0
        })).toThrow("validation/invalid-task-importance");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskImportance tul magas", () => {
        expect(() => createTestTask({
            taskImportance: 6
        })).toThrow("validation/invalid-task-importance");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskImportance nem szam", () => {
        expect(() => createTestTask({
            taskImportance: Number.NaN
        })).toThrow("validation/invalid-task-importance");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskStatus kisbetus", () => {
        expect(() => createTestTask({
            taskStatus: "folyamatban" as any
        })).toThrow("validation/invalid-task-status");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskStatus ures string", () => {
        expect(() => createTestTask({
            taskStatus: "" as any
        })).toThrow("validation/invalid-task-status");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskCreatedAt hibas Date objektum", () => {
        expect(() => createTestTask({
            taskCreatedAt: new Date("invalid-date")
        })).toThrow("validation/invalid-task-createdAt");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskCreatedAt jovobeli datum", () => {
        expect(() => createTestTask({
            taskCreatedAt: new Date("2099-01-01T00:00:00.000Z")
        })).toThrow("validation/invalid-task-createdAt");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskDeadline hibas Date objektum", () => {
        expect(() => createTestTask({
            taskDeadline: new Date("invalid-date")
        })).toThrow("validation/invalid-task-deadline");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskDeadline korabbi mint a letrehozas ideje", () => {
        expect(() => createTestTask({
            taskCreatedAt: new Date("2026-05-10T00:00:00.000Z"),
            taskDeadline: new Date("2026-05-09T00:00:00.000Z")
        })).toThrow("validation/invalid-task-deadline");
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskCompletedAt hibas Date objektum", () => {
        expect(() => createTestTask({
            taskCompletedAt: new Date("invalid-date")
        })).toThrow("validation/invalid-task-completedAt");
    });
});