import { expect, test, describe } from 'vitest'
import { sanitizeText } from '../../../services/sanitization/sanitizeText'

describe("VALID sanitizeText unit teszt", () => {
    test("VALID sanitizeText trims and escapes html karaktereket", () => {
        expect(sanitizeText("  <User & 'Name'>  ")).toBe("&lt;User &amp; &#39;Name&#39;&gt;");
    });
    test("VALID sanitizeText hagyja az egyszeru szoveget valtozatlanul, csak trim-el", () => {
        expect(sanitizeText("  Teszt User  ")).toBe("Teszt User");
    });
});

describe("INVALID sanitizeText unit teszt", () => {
    test("INVALID sanitizeText, ahol a bemenet nem string", () => {
        expect(() => sanitizeText(10 as any)).toThrow("validation/invalid-text-type");
    });
});