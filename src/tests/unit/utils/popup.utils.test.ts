/**
 * @vitest-environment jsdom
 */
// https://vitest.dev/config/environment
// https://github.com/jsdom/jsdom

import { describe, test, expect, beforeEach, vi } from "vitest";
import { showInfoPopUp, showErrorPopUp } from "../../../utils/popup";

describe("Popup Unit Teszt", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });
    test("showErrorPopUp letrehozza a dom elemet", () => {
        expect(document.getElementById("app-popup")).toBe(null)
        showErrorPopUp("XY hiba tortent");
        expect(document.getElementById("app-popup")?.classList.contains("is-visible")).toBe(true)
    });
    test("showInfoPopUp letrehozza a dom elemet", () => {
        expect(document.getElementById("app-popup")).toBe(null)
        showInfoPopUp("Siker");
        expect(document.getElementById("app-popup")?.classList.contains("is-visible")).toBe(true)
    });
    test("ures uzenet eseten a popup nem jelenik meg", () => {
        expect(document.getElementById("app-popup")).toBe(null)
        showInfoPopUp("  ");
        expect(document.getElementById("app-popup")).toBe(null)
    });
    test("Close gomb elrejti a popupot", () => {
        expect(document.getElementById("app-popup")).toBe(null)
        showErrorPopUp("XY hiba tortent");
        expect(document.getElementById("app-popup")?.classList.contains("is-visible")).toBe(true);
        const closeButton = document.querySelector(".app-popup__close") as HTMLButtonElement
        closeButton?.click();
        expect(document.getElementById("app-popup")?.classList.contains("is-visible")).toBe(false);
    });
});

