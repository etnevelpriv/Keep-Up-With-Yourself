import { AppError } from "../../models/AppError";
import { errorMessages } from "./errorMessages";

export const getErrorMessage = function (error:AppError) {
    if (error instanceof AppError) {
        return errorMessages[error.code]
    };
    return errorMessages["unknown"];
}