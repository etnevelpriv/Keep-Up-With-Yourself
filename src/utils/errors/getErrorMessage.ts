import { AppError } from "../../models/AppError";
import { errorMessages } from "./errorMessages";

export const getErrorMessage = function (error:unknown) {
    if (error instanceof AppError) {
        return errorMessages[error.code]
    };
    return errorMessages["unknown"];
}