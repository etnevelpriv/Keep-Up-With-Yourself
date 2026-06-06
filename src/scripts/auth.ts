import { initializeAuthListener } from "../services/auth/auth.listener.ts"
import { handleUiError } from "../utils/errors/handleUiError.ts"
import { db } from "./firebase.ts";

try {
    initializeAuthListener(db, handleUiError)
} catch (err) {
    handleUiError(err);
};
