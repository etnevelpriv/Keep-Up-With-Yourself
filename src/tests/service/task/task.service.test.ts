import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, type Firestore } from "firebase/firestore";
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createTask, getTask, getTasks, updateTask, deleteTask } from "../../../services/task/task.service";

vi.mock("firebase/firestore", ()=>({
    addDoc:vi.fn(),
    collection:vi.fn(),
    deleteDoc:vi.fn(),
    doc:vi.fn(),
    getDoc:vi.fn(),
    getDocs:vi.fn(),
    updateDoc:vi.fn(),
}));
beforeEach(()=>{
    vi.resetAllMocks();
});
describe("VALID Task Service Mocks Teszt", ()=>{

});
describe("INVALID Task Service Mocks Teszt", ()=>{

})