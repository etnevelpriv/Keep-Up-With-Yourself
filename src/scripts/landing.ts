import "../styles/base.css";
import "../styles/landing.css";

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

const setHeaderState = function () {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const revealElements = document.querySelectorAll(
    ".hero-textContent, .task-board, .feature-card, .section-head, .problem-card, .solution-card, .workflow-item, .statistics-card, .security-visual, .cta-card"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
    });

    revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
}