import { expect, test, describe } from 'vitest'
import { validateRegisterInput, validateLoginInput } from '../../services/auth/auth.validator'

describe("VALID Auth Validator unit teszt", () => {
    test("VALID register input", async () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(), false)).not.toThrow();
    });
    test("VALID login input", async () => {
        expect(() => validateLoginInput("teszt@google.com", "Password123!")).not.toThrow();
    });
});
describe("INVALID Auth Validator unit teszt", () => {
    test("INVALID register input invalid email", async () => {
        expect(() => validateRegisterInput("TestUser", "nemjoemail", "Password123!", new Date(), false)).toThrow();
    });
    test("INVALID login input invalid email", async () => {
        expect(() => validateLoginInput("tesztgoogle.com", "Password123!")).toThrow();
    });
    test("INVALID register input invalid password", async () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123fdasfefasd fdsafa sdfasfdfsadf !", new Date(), false)).toThrow();
    });
    test("INVALID login input invalid password", async () => {
        expect(() => validateLoginInput("teszt@google.com", "Password123")).toThrow();
    });
    test("INVALID register input invalid name", async () => {
        expect(() => validateRegisterInput("", "teszt@google.com", "Password123!", new Date(), false)).toThrow();
    });
    test("INVALID register input invalid datum", async () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(2999, 12, 12), false)).toThrow();
    });
    test("INVALID register input invalid verified", async () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(2999, 12, 12), "nem bool" as any)).toThrow();
    });
});