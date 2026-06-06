import { expect, test, describe } from 'vitest'
import {
	validateTaskName,
	validateTaskDescription,
	validateTaskCreatedAt,
	validateTaskDeadline,
	validateTaskImportance,
	validateTaskTaskType,
	validateTaskStatus,
	validateTaskCompletedAt,
	validateTaskUpdatedAt,
	taskDataValidationProcess,
} from '../../../services/task/task.validator.ts'

describe("VALID Task Validator unit teszt", () => {
	test("VALID task name", () => {
		expect(() => validateTaskName("TESZT_TASK")).not.toThrow();
	});
	test("VALID task description", () => {
		expect(() => validateTaskDescription("TESZT leiras" )).not.toThrow();
	});
	test("VALID task createdAt", () => {
		expect(() => validateTaskCreatedAt(new Date())).not.toThrow();
	});
	test("VALID task deadline", () => {
		const createdAt = new Date("2026-01-01T10:00:00.000Z");
		const deadline = new Date("2026-01-02T10:00:00.000Z");
		expect(() => validateTaskDeadline(deadline, createdAt)).not.toThrow();
	});
	test("VALID task importance", () => {
		expect(() => validateTaskImportance(3)).not.toThrow();
	});
	test("VALID task type name", () => {
		expect(() => validateTaskTaskType("TESZT_TYPE" )).not.toThrow();
	});
	test("VALID task status", () => {
		expect(() => validateTaskStatus("Folyamatban")).not.toThrow();
	});
	test("VALID task completedAt null", () => {
		expect(() => validateTaskCompletedAt(null)).not.toThrow();
	});
	test("VALID task completedAt", () => {
		expect(() => validateTaskCompletedAt(new Date())).not.toThrow();
	});
	test("VALID task updatedAt", () => {
		expect(() => validateTaskUpdatedAt(new Date())).not.toThrow();
	});
	test("VALID taskDataValidationProcess", () => {
		const createdAt = new Date("2026-01-01T10:00:00.000Z");
		const updatedAt = new Date("2026-01-01T11:00:00.000Z");
		const deadline = new Date("2026-01-02T10:00:00.000Z");
		expect(() => taskDataValidationProcess("TESZT_TASK", "TESZT leiras", deadline, 3, "TESZT_TYPE", "Folyamatban", null, createdAt, updatedAt)).not.toThrow();
	});
});

describe("INVALID Task Validator unit teszt", () => {
	test("INVALID task name, ahol ures string", () => {
		expect(() => validateTaskName("")).toThrow("validation/invalid-task-name");
	});
	test("INVALID task name, ahol tul rovid", () => {
		expect(() => validateTaskName("Ab")).toThrow("validation/invalid-task-name");
	});
	test("INVALID task name, ahol tul hosszu", () => {
		expect(() => validateTaskName("A".repeat(51))).toThrow("validation/invalid-task-name");
	});
	test("INVALID task description, ahol tul hosszu", () => {
		expect(() => validateTaskDescription("D".repeat(301))).toThrow("validation/invalid-task-description");
	});
	test("INVALID task createdAt, ahol hibas Date objektum", () => {
		expect(() => validateTaskCreatedAt(new Date("invalid-date"))).toThrow("validation/invalid-task-createdAt");
	});
	test("INVALID task createdAt, ahol jovobeli datum", () => {
		expect(() => validateTaskCreatedAt(new Date("2099-01-01T00:00:00.000Z"))).toThrow("validation/invalid-task-createdAt");
	});
	test("INVALID task deadline, ahol korabbi mint a createdAt", () => {
		expect(() => validateTaskDeadline(new Date("2026-01-01T00:00:00.000Z"), new Date("2026-01-02T00:00:00.000Z"))).toThrow("validation/invalid-task-deadline");
	});
	test("INVALID task importance, ahol nulla", () => {
		expect(() => validateTaskImportance(0)).toThrow("validation/invalid-task-importance");
	});
	test("INVALID task importance, ahol tul magas", () => {
		expect(() => validateTaskImportance(6)).toThrow("validation/invalid-task-importance");
	});
	test("INVALID task importance, ahol nem szam", () => {
		expect(() => validateTaskImportance(Number.NaN)).toThrow("validation/invalid-task-importance");
	});
	test("INVALID task type name, ahol ures string", () => {
		expect(() => validateTaskTaskType("")).toThrow("validation/invalid-task-taskType");
	});
	test("INVALID task type name, ahol tul hosszu", () => {
		expect(() => validateTaskTaskType("T".repeat(41))).toThrow("validation/invalid-task-taskType");
	});
	test("INVALID task status, ahol ismeretlen ertek", () => {
		expect(() => validateTaskStatus("Kesz" as any)).toThrow("validation/invalid-task-status");
	});
	test("INVALID task completedAt, ahol hibas Date objektum", () => {
		expect(() => validateTaskCompletedAt(new Date("invalid-date"))).toThrow("validation/invalid-task-completedAt");
	});
	test("INVALID task updatedAt, ahol hibas Date objektum", () => {
		expect(() => validateTaskUpdatedAt(new Date("invalid-date"))).toThrow("validation/invalid-task-updatedAt");
	});
	test("INVALID taskDataValidationProcess, ahol a name hibas", () => {
		const createdAt = new Date("2026-01-01T10:00:00.000Z");
		const updatedAt = new Date("2026-01-01T11:00:00.000Z");
		const deadline = new Date("2026-01-02T10:00:00.000Z");
		expect(() => taskDataValidationProcess("", "TESZT leiras", deadline, 3, "TESZT_TYPE", "Folyamatban", null, createdAt, updatedAt)).toThrow("validation/invalid-task-name");
	});
	test("INVALID taskDataValidationProcess, ahol a status hibas", () => {
		const createdAt = new Date("2026-01-01T10:00:00.000Z");
		const updatedAt = new Date("2026-01-01T11:00:00.000Z");
		const deadline = new Date("2026-01-02T10:00:00.000Z");
		expect(() => taskDataValidationProcess("TESZT_TASK", "TESZT leiras", deadline, 3, "TESZT_TYPE", "Kesz" as any, null, createdAt, updatedAt)).toThrow("validation/invalid-task-status");
	});
});
