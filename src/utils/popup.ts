import "../styles/popup.css";
import type { PopUpInterface } from "../interfaces/PopUpInterface";

const popupId = "app-popup";
const popupMessageId = "app-popup-message";
const popupHideDelay = 5000;

let hideTimer: number | null = null;

const hidePopUp = function () {
    if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
    }
    const popupElement = document.getElementById(popupId);
    const messageElement = document.getElementById(popupMessageId);
    if (messageElement) {
        messageElement.textContent = "";
    }
    if (popupElement) {
        popupElement.classList.remove("is-visible", "app-popup--error", "app-popup--info");
    }
};

const ensurePopupElement = function () {
    let popupElement = document.getElementById(popupId) as HTMLDivElement | null;
    if (popupElement) {
        return popupElement;
    };
    popupElement = document.createElement("div");
    popupElement.id = popupId;
    popupElement.className = "app-popup";
    const messageElement = document.createElement("p");
    messageElement.id = popupMessageId;
    messageElement.className = "app-popup__message";
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "app-popup__close";
    closeButton.textContent = "x";
    closeButton.addEventListener("click", hidePopUp);
    popupElement.append(messageElement, closeButton);
    document.body.append(popupElement);
    return popupElement;
};

const showPopUp = function (options: PopUpInterface) {
    const trimmedMessage = options.message.trim();

    if (!trimmedMessage) {
        hidePopUp();
        return;
    }

    const popupElement = ensurePopupElement();
    const messageElement = document.getElementById(popupMessageId);

    hidePopUp();

    popupElement.classList.add(options.type === "error" ? "app-popup--error" : "app-popup--info");
    popupElement.setAttribute("role", options.type === "error" ? "alert" : "status");
    popupElement.setAttribute("aria-live", options.type === "error" ? "assertive" : "polite");

    if (messageElement) {
        messageElement.textContent = trimmedMessage;
    }

    popupElement.classList.add("is-visible");
    hideTimer = window.setTimeout(() => {
        hidePopUp();
    }, popupHideDelay);
};

export const showErrorPopUp = function (message: string) {
    showPopUp({
        type: "error",
        message,
    });
};

export const showInfoPopUp = function (message: string) {
    showPopUp({
        type: "info",
        message
    });
};