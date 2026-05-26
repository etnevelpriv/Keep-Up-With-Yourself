import { beforeAll, beforeEach, afterAll } from "vitest";
import { initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
    console.log("beforeall lefutott");
});

beforeEach(async () => {
    console.log("beforech lefutott");
});

afterAll(async () => {
    console.log("afterall lefutott");
});