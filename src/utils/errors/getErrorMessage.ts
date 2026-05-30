import { FirebaseError } from "firebase/app";
import { AppError } from "../../models/AppError.ts";
import { errorMessages } from "./errorMessages.ts";

export const getErrorMessage = function (error: unknown) {
    if ((error instanceof AppError || error instanceof FirebaseError) && (errorMessages[error.code])) {
        return errorMessages[error.code];
    };
    return errorMessages["unknown"];
};