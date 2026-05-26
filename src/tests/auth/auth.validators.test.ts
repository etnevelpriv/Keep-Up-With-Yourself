import { expect, test, describe } from 'vitest'
import { validateRegisterInput, validateLoginInput } from '../../services/auth/auth.validator'

describe("VALID Auth Validator unit teszt", () => {
    test("VALID register input", async () => {
        expect(()=>validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(), false)).not.toThrow();
    });
});

