import { expect, test, describe } from 'vitest'
import { validateRegisterInput, validateLoginInput } from '../../../services/user/user.validator'

describe("VALID Auth Validator unit teszt", () => {
    test("VALID register input", () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(), false)).not.toThrow();
    });
    test("VALID login input", () => {
        expect(() => validateLoginInput("teszt@google.com", "Password123!")).not.toThrow();
    });
});
describe("INVALID Auth Validator unit teszt", () => {
    test("INVALID register input invalid email", () => {
        expect(() => validateRegisterInput("TestUser", "nemjoemail", "Password123!", new Date(), false)).toThrow();
    });
    test("INVALID login input invalid email", () => {
        expect(() => validateLoginInput("tesztgoogle.com", "Password123!")).toThrow();
    });
    test("INVALID register input invalid password", () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123fdasfefasd fdsafa sdfasfdfsadf !", new Date(), false)).toThrow();
    });
    test("INVALID login input invalid password", () => {
        expect(() => validateLoginInput("teszt@google.com", "Password123")).toThrow();
    });
    test("INVALID register input invalid name", () => {
        expect(() => validateRegisterInput("", "teszt@google.com", "Password123!", new Date(), false)).toThrow();
    });
    test("INVALID register input invalid datum", () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(2999, 12, 12), false)).toThrow();
    });
    test("INVALID register input invalid verified", () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(), "nem bool" as any)).toThrow();
    });
});