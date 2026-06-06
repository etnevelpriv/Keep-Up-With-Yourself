import { AppError } from "../../models/AppError.ts";
export const sanitizeText = function (text: string) {
    if (typeof text !== "string") {
        throw new AppError("validation/invalid-text-type");
    };
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    };

    return text.trim().replace(/[&<>"']/g, char => map[char]);
};