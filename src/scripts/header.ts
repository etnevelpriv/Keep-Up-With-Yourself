import "../styles/header.css";

const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");
const header = document.querySelector("header");

const closeNavigation = function () {
    navToggle?.classList.remove("active");
    navList?.classList.remove("is-open");
};

navToggle?.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navList?.classList.toggle("is-open");
});

navList?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeNavigation();
    }
});
