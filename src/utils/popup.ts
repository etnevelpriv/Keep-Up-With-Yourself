import "../styles/popup.css";

type PopupType = "error" | "info";

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
    }

    popupElement = document.createElement("div");
    popupElement.id = popupId;
    popupElement.className = "app-popup";
    popupElement.setAttribute("role", "status");
    popupElement.setAttribute("aria-live", "polite");

    const messageElement = document.createElement("p");
    messageElement.id = popupMessageId;
    messageElement.className = "app-popup__message";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "app-popup__close";
    closeButton.textContent = "x";
    closeButton.setAttribute("aria-label", "Popup bezárása");
    closeButton.addEventListener("click", hidePopUp);

    popupElement.append(messageElement, closeButton);
    document.body.append(popupElement);

    return popupElement;
};

const showPopUp = function (type: PopupType, message: string) {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
        hidePopUp();
        return;
    }

    const popupElement = ensurePopupElement();
    const messageElement = document.getElementById(popupMessageId);

    hidePopUp();

    popupElement.classList.add(type === "error" ? "app-popup--error" : "app-popup--info");
    popupElement.setAttribute("role", type === "error" ? "alert" : "status");
    popupElement.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

    if (messageElement) {
        messageElement.textContent = trimmedMessage;
    }

    popupElement.classList.add("is-visible");
    hideTimer = window.setTimeout(() => {
        hidePopUp();
    }, popupHideDelay);
};

export const showErrorPopUp = function (message: string) {
    showPopUp("error", message);
};

export const showInfoPopUp = function (message: string) {
    showPopUp("info", message);
};