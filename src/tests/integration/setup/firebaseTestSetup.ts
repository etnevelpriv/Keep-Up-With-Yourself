import { beforeAll, beforeEach, afterAll } from "vitest";
import { initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
        projectId: "keepupwithyourself-test",
        firestore: {
            host: "127.0.0.1",
            port: 8080
        }
    });
    console.log("firebase tesztkornyezet inicializalva");
});

beforeEach(async () => {
    await testEnv.clearFirestore();
    console.log("firestore kiuritve")
});

afterAll(async () => {
    await testEnv.cleanup();
    console.log("tesztkornyezet lezarva");
});