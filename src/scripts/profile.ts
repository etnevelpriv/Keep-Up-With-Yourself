import "../styles/base.css";
import "./header.ts";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();
document.getElementById("signOutButton")?.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("Sikeresen kijelentkezett a felhasznalo.")
    }).catch((error) => {
        throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}`);
    });

});
