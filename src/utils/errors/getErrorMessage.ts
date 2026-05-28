import { AppError } from "../../models/AppError.ts";
import { errorMessages } from "./errorMessages.ts";

export const getErrorMessage = function (error:unknown) {
    if (error instanceof AppError) {
        if (errorMessages[error.code]) {
            return errorMessages[error.code];
        } else {
            return errorMessages["unknown"];
        };
    };
    return errorMessages["unknown"];
}