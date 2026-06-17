import { expect, test, describe } from 'vitest'
import {
    normalizeTaskType,
    validateTaskTypesExceedsLimit,
    validateisAllTaskTypeString,
    validateisTaskTypeString,
    validateEachTaskTypeLength,
    validateTaskTypeLength,
    validateNewTask,
} from '../../../services/taskType/taskType.validator'

describe("VALID TaskType Validator unit teszt", () => {
    test("VALID normalizeTaskType levagja a szokozoket es kisbetusit", () => {
        expect(normalizeTaskType("  Teszt   TaskType  ")).toBe("teszt tasktype");
    });
    test("VALID taskTypes lista hossza", () => {
        expect(() => validateTaskTypesExceedsLimit(["Tanulas", "Munka"])).not.toThrow();
    });
    test("VALID minden taskType string", () => {
        expect(() => validateisAllTaskTypeString(["Tanulas", "Munka"])).not.toThrow();
    });
    test("VALID taskType string", () => {
        expect(() => validateisTaskTypeString("Tanulas")).not.toThrow();
    });
    test("VALID minden taskType hossza megfelelo", () => {
        expect(() => validateEachTaskTypeLength(["Tanulas", "Munka"])).not.toThrow();
    });
    test("VALID taskType hossza megfelelo", () => {
        expect(() => validateTaskTypeLength("Tanulas")).not.toThrow();
    });
    test("VALID validateNewTask", () => {
        expect(() => validateNewTask(["Tanulas", "Munka"], "Takaritas")).not.toThrow();
    });
});

describe("INVALID TaskType Validator unit teszt", () => {
    test("INVALID taskTypes lista tobb mint 20 elemu", () => {
        expect(() => validateTaskTypesExceedsLimit(Array(21).fill("Tanulas"))).toThrow("validation/task-types-exceeds-limit");
    });
    test("INVALID nem minden taskType string", () => {
        expect(() => validateisAllTaskTypeString(["Tanulas", 10] as any)).toThrow("validation/not-all-task-types-string");
    });
    test("INVALID taskType nem string", () => {
        expect(() => validateisTaskTypeString(10 as any)).toThrow("validation/task-type-not-string");
    });
    test("INVALID egyik taskType tul rovid", () => {
        expect(() => validateEachTaskTypeLength(["Tanulas", "A"])).toThrow("validation/some-task-type-too-short");
    });
    test("INVALID egyik taskType tul hosszu", () => {
        expect(() => validateEachTaskTypeLength(["Tanulas", "A".repeat(41)])).toThrow("validation/some-task-type-too-long");
    });
    test("INVALID taskType tul rovid", () => {
        expect(() => validateTaskTypeLength("A")).toThrow("validation/task-type-too-short");
    });
    test("INVALID taskType tul hosszu", () => {
        expect(() => validateTaskTypeLength("A".repeat(41))).toThrow("validation/task-type-too-long");
    });
    test("INVALID validateNewTask tul hosszu listanal", () => {
        expect(() => validateNewTask(Array(21).fill("Tanulas"), "Takaritas")).toThrow("validation/task-types-exceeds-limit");
    });
    test("INVALID validateNewTask nem string taskType eseten", () => {
        expect(() => validateNewTask(["Tanulas"], 10 as any)).toThrow("validation/task-type-not-string");
    });
    test("INVALID validateNewTask tul rovid taskType eseten", () => {
        expect(() => validateNewTask(["Tanulas"], "A")).toThrow("validation/task-type-too-short");
    });
});
