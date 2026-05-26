import { beforeAll, beforeEach, afterAll } from "vitest";

beforeAll(async () => {
    console.log("beforeall lefutott");
});

beforeEach(async () => {
    console.log("beforech lefutott");
});

afterAll(async () => {
    console.log("afterall lefutott");
});