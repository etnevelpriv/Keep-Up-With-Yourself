import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(`A felhasznalo bevan jelentkezve. Email: ${user.email}, Nev: ${user.displayName}, UID: ${user.uid} Verfied: ${user.emailVerified}`);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("A felhasznalo letezik az adatbazisban is:", docSnap.data());
            if (user.emailVerified) {
                console.log("A felhasznalo mar hitelesitette az email cimet");
                if (!(docSnap.data().userVerified)) {
                    await updateDoc(doc(db, "users", user.uid), {
                        userVerified: true
                    });
                    console.log("A felhasznalo adatbazisban szereplo dokumentumaban is verified mostmar")
                };

                const currentPath = window.location.pathname.toLowerCase();
                const isLoginPage = currentPath.includes("login");
                const isRegisterPage = currentPath.includes("register");

                if (isLoginPage || isRegisterPage) {
                    window.location.href = "/pages/create.html";
                };

            } else {
                console.log("A felhasznalo meg nem hitelesitette az email cimet", docSnap.data().userVerified);
            };
        } else {
            console.log("A felhasznalo letezik, de az adatbazisban nincs hozza dokumentum.");
        };


    } else {
        console.log("Nincs bejelentkezett felhasznalo")
        const currentPath = window.location.pathname.toLowerCase();
        const isCreatePage = currentPath.includes("create");
        const isProfilePage = currentPath.includes("profile");
        const isTasksPage = currentPath.includes("tasks");

        if (isCreatePage || isProfilePage || isTasksPage) {
            window.location.href = "/pages/login.html";
        };
    };
});

document.getElementById("signOutButton")?.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("Sikeresen kijelentkezett a felhasznalo.")
    }).catch((error) => {
        throw new Error(`Hiba uzener: ${error.code}, Hiba kod: ${error.errorMessage}`);
    });

});