import "../styles/base.css";
import "./header.ts";

const init = function () {
    console.log('HELLO')
};

document.addEventListener("DOMContentLoaded", init);
document.getElementById("createForm")?.addEventListener("submit", (e)=>{
    e.preventDefault();
    console.log("bibibi");
});