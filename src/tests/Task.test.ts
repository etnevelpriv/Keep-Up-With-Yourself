import { expect, test, describe } from 'vitest'
import { Task } from '../scripts/classes/Task';
import { createTestTask } from './testUtils';

describe("VALID Task class tesztelese", () => {
    test("Valid adatokkal letrehozni a taskot. Mindent ellenorizni", () => {
        const testTask = createTestTask({
            taskDesc: "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            taskDeadline: new Date("2026-09-09"),
            TaskCreatedAt: new Date("2026-01-02"),
            taskUpdatedAt: new Date("2026-02-03"),
        });
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskDesc).toBe('TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.');
        expect(testTask.taskDeadline.getTime()).toBe(new Date("2026-09-09").getTime());
        expect(testTask.taskImportance).toBe(3);
        expect(testTask.taskTypeName).toBe('TESZT_TASKTYPENAME');
        expect(testTask.taskStatus).toBe('Folyamatban');
        expect(testTask.taskCompletedAt).toBe(null);
        expect(testTask.TaskCreatedAt.getTime()).toBe(new Date("2026-01-02").getTime());
        expect(testTask.taskUpdatedAt.getTime()).toBe(new Date("2026-02-03").getTime());
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskCompletedAt == null", () => {
        const testTask = new Task(
            "TESZT_NEV",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            3,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        );
        expect(testTask.taskCompletedAt).toBe(null);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskCompletedAt != null", () => {
        const testTask = new Task(
            "TESZT_NEV",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            3,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            new Date("2026-10-10"),
            new Date("2026-01-02"),
            new Date("2026-02-03")
        );
        expect((testTask.taskCompletedAt)?.getTime()).toBe(new Date("2026-10-10").getTime());
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskImportance egy alacsony hatarertek", () => {
        const testTask = new Task(
            "TESZT_NEV",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            1,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        );
        expect(testTask.taskImportance).toBe(1);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskImportance egy magas hatarertek", () => {
        const testTask = new Task(
            "TESZT_NEV",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            5,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        );
        expect(testTask.taskImportance).toBe(5);
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskStatus == Folyamatban", () => {
        const testTask = new Task(
            "TESZT_NEV",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            5,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        );
        expect(testTask.taskStatus).toBe('Folyamatban');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskStatus == Lejárt", () => {
        const testTask = new Task(
            "TESZT_NEV",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            5,
            "TESZT_TASKTYPENAME",
            "Lejárt",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        );
        expect(testTask.taskStatus).toBe('Lejárt');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskStatus == Teljesített", () => {
        const testTask = new Task(
            "TESZT_NEV",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            5,
            "TESZT_TASKTYPENAME",
            "Teljesített",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        );
        expect(testTask.taskStatus).toBe('Teljesített');
    });
    test("Valid adatokkal letrehozni a taskot, ahol taskDesc egy ures string", () => {
        const testTask = new Task(
            "TESZT_NEV",
            "",
            new Date("2026-09-09"),
            5,
            "TESZT_TASKTYPENAME",
            "Teljesített",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        );
        expect(testTask.taskStatus).toBe('Teljesített');
    });
});
describe("INVALID Task class tesztelese", () => {
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskName egy ures string", () => {
        expect(() => new Task(
            "",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            3,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        )).toThrow(
            new Error('A feladat neve érvénytelen.'),
        );
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskName nem string", () => {
        expect(() => new Task(
            3,
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            3,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        )).toThrow(
            new Error('Ahol a szöveget kell megadni, ott szöveg legyen megadva. Valamelyik adat érvénytelen.'),
        );
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskName == `   `", () => {
        expect(() => new Task(
            "   ",
            "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.",
            new Date("2026-09-09"),
            3,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        )).toThrow(
            new Error('A feladat neve érvénytelen.'),
        );
    });
    test("Invalid adattal/adatokkal letrehozni a taskot, ahol taskDesc nem string", () => {
        expect(() => new Task(
            "TESZT_NEV",
            6,
            new Date("2026-09-09"),
            3,
            "TESZT_TASKTYPENAME",
            "Folyamatban",
            null,
            new Date("2026-01-02"),
            new Date("2026-02-03")
        )).toThrow(
            new Error('Ahol a szöveget kell megadni, ott szöveg legyen megadva. Valamelyik adat érvénytelen.'),
        );
    });
});