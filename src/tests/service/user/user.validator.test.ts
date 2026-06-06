import { expect, test, describe } from 'vitest'
import {
    validateRegisterInput,
    validateLoginInput,
    validateUserEmail,
    validateUserPassword,
    validateUserName,
    validateCreateDate,
    validateUserVerified,
} from '../../../services/user/user.validator'

describe("VALID Auth Validator unit teszt", () => {
    test("VALID register input", () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(), false)).not.toThrow();
    });
    test("VALID login input", () => {
        expect(() => validateLoginInput("teszt@google.com", "Password123!")).not.toThrow();
    });
    test("VALID user email", () => {
        expect(() => validateUserEmail("teszt@google.com")).not.toThrow();
    });
    test("VALID user password, ahol undefined", () => {
        expect(() => validateUserPassword(undefined)).not.toThrow();
    });
    test("VALID user password", () => {
        expect(() => validateUserPassword("Password123!")).not.toThrow();
    });
    test("VALID user name", () => {
        expect(() => validateUserName("TestUser")).not.toThrow();
    });
    test("VALID create date", () => {
        expect(() => validateCreateDate(new Date())).not.toThrow();
    });
    test("VALID user verified", () => {
        expect(() => validateUserVerified(true)).not.toThrow();
    });
});
describe("INVALID Auth Validator unit teszt", () => {
    test("INVALID register input invalid email", () => {
        expect(() => validateRegisterInput("TestUser", "nemjoemail", "Password123!", new Date(), false)).toThrow("validation/invalid-email");
    });
    test("INVALID login input invalid email", () => {
        expect(() => validateLoginInput("tesztgoogle.com", "Password123!")).toThrow("validation/invalid-email");
    });
    test("INVALID register input invalid password", () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123fdasfefasd fdsafa sdfasfdfsadf !", new Date(), false)).toThrow("validation/invalid-password-requirements");
    });
    test("INVALID login input invalid password", () => {
        expect(() => validateLoginInput("teszt@google.com", "Password123")).toThrow("validation/invalid-password-requirements");
    });
    test("INVALID register input invalid name", () => {
        expect(() => validateRegisterInput("", "teszt@google.com", "Password123!", new Date(), false)).toThrow("validation/invalid-name");
    });
    test("INVALID register input invalid datum", () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(2999, 12, 12), false)).toThrow("validation/invalid-createDate");
    });
    test("INVALID register input invalid verified", () => {
        expect(() => validateRegisterInput("TestUser", "teszt@google.com", "Password123!", new Date(), "nem bool" as any)).toThrow("validation/invalid-verified");
    });
    test("INVALID user email, ahol ures string", () => {
        expect(() => validateUserEmail("")).toThrow("validation/invalid-email");
    });
    test("INVALID user password, ahol ures string", () => {
        expect(() => validateUserPassword("")).toThrow("validation/invalid-password");
    });
    test("INVALID user password, ahol hianyzik a kisbetu", () => {
        expect(() => validateUserPassword("PASSWORD123!")).toThrow("validation/invalid-password-requirements");
    });
    test("INVALID user password, ahol hianyzik a nagybetu", () => {
        expect(() => validateUserPassword("password123!")).toThrow("validation/invalid-password-requirements");
    });
    test("INVALID user password, ahol hianyzik a szam", () => {
        expect(() => validateUserPassword("Password!!!")).toThrow("validation/invalid-password-requirements");
    });
    test("INVALID user password, ahol hianyzik a specialis karakter", () => {
        expect(() => validateUserPassword("Password123")).toThrow("validation/invalid-password-requirements");
    });
    test("INVALID user name, ahol ures string", () => {
        expect(() => validateUserName("")).toThrow("validation/invalid-name");
    });
    test("INVALID create date, ahol jovo beli datum", () => {
        expect(() => validateCreateDate(new Date("2999-01-01T00:00:00.000Z"))).toThrow("validation/invalid-createDate");
    });
    test("INVALID user verified, ahol nem boolean", () => {
        expect(() => validateUserVerified("true" as any)).toThrow("validation/invalid-verified");
    });
});