import "../styles/base.css";
import "../styles/tasks.css";
import "./header.ts";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.ts"
import { Task } from "./classes/Task.ts";

const init = function () {

};
document.addEventListener("DOMContentLoaded", init);