import { expect, test, describe } from 'vitest'
import createTestUser from './userTestSetup';

describe("VALID User class tesztelese", () => {
    test("Valid adatokkal letrehozni a usert. Mindent ellenorizni", () => {
        const testUser = createTestUser();
        expect(testUser.name).toBe('TESZT USER NAME');
        expect(testUser.password).toBe('Password123!');
        expect(testUser.email).toBe('tesztuseremail@gmail.com');
        expect(testUser.createdAt.getTime()).toBe(new Date(2025, 5, 5).getTime());
        expect(testUser.verified).toBe(true);
    });
    test("Valid adatokkal letrehozni a usert, ahol a password undefined", () => {
        const testUser = createTestUser({
            password: undefined
        });
        expect(testUser.password).toBeUndefined();
    });
    test("Valid adatokkal letrehozni a usert, ahol verified false", () => {
        const testUser = createTestUser({
            verified: false
        });
        expect(testUser.verified).toBe(false);
    });
    test("Valid adatokkal letrehozni a usert, ahol a name harom karakteres", () => {
        const testUser = createTestUser({
            name: "AAA"
        });
        expect(testUser.name).toBe('AAA');
    });
    test("Valid adatokkal letrehozni a usert, ahol a name tartalmaz szokozeket", () => {
        const testUser = createTestUser({
            name: "TESZT USER FULL"
        });
        expect(testUser.name).toBe('TESZT USER FULL');
    });
    test("Valid adatokkal letrehozni a usert, ahol a name tartalmaz diakritikus karaktereket", () => {
        const testUser = createTestUser({
            name: "Árvíztűrő Tükörfúrógép"
        });
        expect(testUser.name).toBe('Árvíztűrő Tükörfúrógép');
    });
    test("Valid adatokkal letrehozni a usert, ahol az email subdomaines", () => {
        const testUser = createTestUser({
            email: "user@mail.example.com"
        });
        expect(testUser.email).toBe('user@mail.example.com');
    });
    test("Valid adatokkal letrehozni a usert, ahol az email pluszos alias", () => {
        const testUser = createTestUser({
            email: "teszt+alias@gmail.com"
        });
        expect(testUser.email).toBe('teszt+alias@gmail.com');
    });
    test("Valid adatokkal letrehozni a usert, ahol a jelszo pontosan 8 karakter", () => {
        const testUser = createTestUser({
            password: "Aa1!bcde"
        });
        expect(testUser.password).toBe('Aa1!bcde');
    });
    test("Valid adatokkal letrehozni a usert, ahol a jelszo pontosan 16 karakter", () => {
        const testUser = createTestUser({
            password: "Aa1!bcdefGhijkLM"
        });
        expect(testUser.password).toBe('Aa1!bcdefGhijkLM');
    });
    test("Valid adatokkal letrehozni a usert, ahol a jelszo tartalmaz kotojelet", () => {
        const testUser = createTestUser({
            password: "Aa1!-bcde"
        });
        expect(testUser.password).toBe('Aa1!-bcde');
    });
    test("Valid adatokkal letrehozni a usert, ahol a jelszo tartalmaz kettospont helyett hash jelet", () => {
        const testUser = createTestUser({
            password: "Aa1#bcde"
        });
        expect(testUser.password).toBe('Aa1#bcde');
    });
    test("Valid adatokkal letrehozni a usert, ahol a jelszo tartalmaz plusz jelet", () => {
        const testUser = createTestUser({
            password: "Aa1+bcde"
        });
        expect(testUser.password).toBe('Aa1+bcde');
    });
    test("Valid adatokkal letrehozni a usert, ahol a jelszo tartalmaz pontot", () => {
        const testUser = createTestUser({
            password: "Aa1.bcde"
        });
        expect(testUser.password).toBe('Aa1.bcde');
    });
    test("Valid adatokkal letrehozni a usert, ahol a jelszo tartalmaz amperzandot", () => {
        const testUser = createTestUser({
            password: "Aa1&bcde"
        });
        expect(testUser.password).toBe('Aa1&bcde');
    });
    test("Valid adatokkal letrehozni a usert, ahol a createdAt egy konkret datum", () => {
        const createdAt = new Date("2026-03-15T10:20:30.000Z");
        const testUser = createTestUser({
            createdAt: new Date(createdAt.getTime())
        });
        expect(testUser.createdAt.getTime()).toBe(createdAt.getTime());
    });
    test("Valid adatokkal letrehozni a usert, ahol a createdAt egy korabbi datum", () => {
        const testUser = createTestUser({
            createdAt: new Date("2020-01-01T00:00:00.000Z")
        });
        expect(testUser.createdAt.getTime()).toBe(new Date("2020-01-01T00:00:00.000Z").getTime());
    });
    test("Valid adatokkal letrehozni a usert, ahol a nev hosszu, de ervenyes", () => {
        const longName = "A".repeat(30);
        const testUser = createTestUser({
            name: longName
        });
        expect(testUser.name).toBe(longName);
    });
    test("Valid adatokkal letrehozni a usert, ahol a toString minden fontos adatot tartalmaz", () => {
        const testUser = createTestUser({
            name: "TESZT_TO_STRING",
            password: "Aa1!bcde",
            email: "to.string@test.hu",
            createdAt: new Date("2025-07-07T07:07:07.000Z"),
            verified: false
        });
        const result = testUser.toString();
        expect(result).toContain('Nev: TESZT_TO_STRING');
        expect(result).toContain('Jelszo:Aa1!bcde');
        expect(result).toContain('Email:to.string@test.hu');
        expect(result).toContain('Verified:false');
        expect(result).toContain('Datum:');
    });
    test("Valid adatokkal letrehozni a usert, ahol a toString kezeli az undefined jelszot", () => {
        const testUser = createTestUser({
            password: undefined,
            name: "TESZT_TO_STRING_UNDEF",
            email: "undef@test.hu",
            verified: true
        });
        const result = testUser.toString();
        expect(result).toContain('Jelszo:undefined');
        expect(result).toContain('Nev: TESZT_TO_STRING_UNDEF');
    });
});

describe("INVALID User class tesztelese", () => {
    test.each([
        ["name ures string", { name: "" }, 'A név nincs megfelelően megadva: '],
        ["name nem string", { name: 10 as any }, 'A név nincs megfelelően megadva: 10'],
        ["email ures string", { email: "" }, 'Az e-mail cím nincs megfelelően megadva: '],
        ["email hibas formatum", { email: "tesztuseremailgmail.com" }, 'Az e-mail cím nincs megfelelően megadva: tesztuseremailgmail.com'],
        ["email nem string", { email: 10 as any }, 'Az e-mail cím nincs megfelelően megadva: 10'],
        ["password ures string", { password: "" }, 'A jelszó nincs megfelelően megadva: '],
        ["password tul rovid", { password: "Aa1!b" }, 'A jelszó nem felel meg a követelményeknek.'],
        ["password hianyzo specialis karakter", { password: "Aa1bcdef" }, 'A jelszó nem felel meg a követelményeknek.'],
        ["createdAt hibas Date objektum", { createdAt: new Date("invalid-date") }, 'A létrehozás dátuma nincs megfelelően megadva: Invalid Date'],
        ["verified nem boolean", { verified: "true" as any }, 'Az ellenőrzöttség nincs megfelelően megadva: true'],
    ])("Invalid adattal/adatokkal letrehozni a usert, ahol %s", (_label, overrides, expectedMessage) => {
        expect(() => createTestUser(overrides)).toThrow(new Error(expectedMessage));
    });
});
