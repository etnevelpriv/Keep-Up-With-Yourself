import { expect, test, describe } from 'vitest'
import { Task } from '../scripts/classes/Task';

describe("Task class tesztelese", ()=>{
    test("Valid adatok:", ()=>{
        const testTask = new Task("TESZT_NEV", "TESZT_DESCRIPTION_Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur accusantium pariatur minus tenetur, quos velit illo officiis magnam autem cupiditate temporibus sed ex provident, voluptates quaerat doloribus. Sapiente, sunt repellendus.", new Date("2026-09-09"), 3, "TESZT_TASKTYPENAME", "Folyamatban", null, new Date("2026-01-02"), new Date("2026-02-03"));
    });
});