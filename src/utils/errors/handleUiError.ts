import { showErrorPopUp } from "../popup";
import { getErrorMessage } from "./getErrorMessage";

export const handleUiError = function (error:unknown) {
    showErrorPopUp(getErrorMessage(error));
    console.error(error)
};