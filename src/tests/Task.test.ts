import { expect, test, describe } from 'vitest'
import { Task } from '../scripts/classes/Task';

describe("VALID Task class tesztelese", () => {
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
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskImportance).toBe(3);
        expect(testTask.taskCompletedAt).toBe(null);
        expect(testTask.taskStatus).toBe('Folyamatban');
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
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskImportance).toBe(3);
        expect((testTask.taskCompletedAt)?.getTime()).toBe(new Date("2026-10-10").getTime());
        expect(testTask.taskStatus).toBe('Folyamatban');
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
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskImportance).toBe(1);
        expect(testTask.taskCompletedAt).toBe(null);
        expect(testTask.taskStatus).toBe('Folyamatban');
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
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskImportance).toBe(5);
        expect(testTask.taskCompletedAt).toBe(null);
        expect(testTask.taskStatus).toBe('Folyamatban');
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
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskImportance).toBe(5);
        expect(testTask.taskCompletedAt).toBe(null);
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
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskImportance).toBe(5);
        expect(testTask.taskCompletedAt).toBe(null);
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
        expect(testTask.taskName).toBe('TESZT_NEV');
        expect(testTask.taskImportance).toBe(5);
        expect(testTask.taskCompletedAt).toBe(null);
        expect(testTask.taskStatus).toBe('Teljesített');
    });
});
