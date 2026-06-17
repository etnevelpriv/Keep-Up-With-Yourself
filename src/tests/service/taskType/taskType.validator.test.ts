import { expect, test, describe } from 'vitest'
import {
    normalizeTaskType,
    validateTaskTypeValue,
    validateTaskTypesExceedsLimit,
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
    test("VALID taskType erteke megfelelo", () => {
        expect(() => validateTaskTypeValue("Tanulas")).not.toThrow();
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
    test("INVALID taskTypes lista eleri a limitet", () => {
        expect(() => validateTaskTypesExceedsLimit(Array(20).fill("Tanulas"))).toThrow("validation/task-types-exceeds-limit");
    });
    test("INVALID taskType nem string", () => {
        expect(() => validateTaskTypeValue(10 as any)).toThrow("validation/task-type-value-not-accepted");
    });
    test("INVALID taskType elejen szokoz van", () => {
        expect(() => validateTaskTypeValue(" Tanulas")).toThrow("validation/task-type-value-not-accepted");
    });
    test("INVALID taskType vegen szokoz van", () => {
        expect(() => validateTaskTypeValue("Tanulas ")).toThrow("validation/task-type-value-not-accepted");
    });
    test("INVALID taskType dupla szokozt tartalmaz", () => {
        expect(() => validateTaskTypeValue("Valami  Masik")).toThrow("validation/task-type-value-not-accepted");
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
    test("INVALID validateNewTask limites listanal", () => {
        expect(() => validateNewTask(Array(20).fill("Tanulas"), "Takaritas")).toThrow("validation/task-types-exceeds-limit");
    });
    test("INVALID validateNewTask nem string taskType eseten", () => {
        expect(() => validateNewTask(["Tanulas"], 10 as any)).toThrow("validation/task-type-value-not-accepted");
    });
    test("INVALID validateNewTask tul rovid taskType eseten", () => {
        expect(() => validateNewTask(["Tanulas"], "A")).toThrow("validation/task-type-too-short");
    });
    test("INVALID validateNewTask dupla szokozos taskType eseten", () => {
        expect(() => validateNewTask(["Tanulas"], "Valami  Masik")).toThrow("validation/task-type-value-not-accepted");
    });
});
