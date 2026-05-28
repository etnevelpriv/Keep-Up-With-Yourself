import { showErrorPopUp } from "../popup.ts";
import { getErrorMessage } from "./getErrorMessage.ts";

export const handleUiError = function (error:unknown) {
    showErrorPopUp(getErrorMessage(error));
    console.error(error)
};