import "../styles/base.css";
import "../styles/landing.css";
import "./header.ts";

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