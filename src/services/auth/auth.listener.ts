
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

export const initializeAuthListener = function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
        
        } else {

        };
    });
};