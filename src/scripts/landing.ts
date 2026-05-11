import "../styles/base.css";
import "../styles/landing.css";

document.getElementById('navToggle')?.addEventListener('click', () => {
    const hamburger = document.getElementById('navToggle');
    hamburger?.classList.toggle('active')

    const navList = document.getElementById('navList');
    navList?.classList.toggle('is-open')
});