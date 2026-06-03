import './style.css'
import { v7 } from 'uuid';
import type { UserForm } from './types/UserForm';
import * as db from './userDb';
import type { User } from './types/User';

const form = document.querySelector("form") as HTMLFormElement;
const ul = document.querySelector("ul") as HTMLUListElement;

let editUserContext: User | null = null;

document.addEventListener("DOMContentLoaded", () => {
  renderUI();
});

form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userData = Object.fromEntries(formData) as unknown as UserForm;


  db.addUser({...userData, id: v7()});
  renderUI();
});



function renderUI(){
  ul.innerHTML = "";
  const users = db.getUsers();
  for (const user of users) {
    ul.innerHTML += generateLiElement(user);
  }

  if(editUserContext){
    console.log("edit user", editUserContext);
  }
}



function generateLiElement({username, email, id}: User): string{
  return `
    <li data-userId="${id}">ID: ${id} Username: ${username} E-Mail: ${email}
      <button data-button-type="edit" type="button" data-userID="${id}">Edit</button>
      <button data-button-type="delete" type="button" data-userID="${id}">Delete</button>
    </li>
  `;
}


document.addEventListener("click", (e) => {
  const element = e.target as HTMLElement;
  if(element instanceof HTMLButtonElement && element.type !== "submit"){
    //if the button has a parent with the <LI> tag, get its attached userid data
    if(element.parentElement?.tagName === "LI" && element.parentElement.dataset.userid){
      //get userid from LI data
      const userId = element.parentElement.dataset.userid;

      //get the action (edit, delete) from the button clicked
      const action = element.dataset.buttonType || "";

      //handle click
      handleLiButtonClick(userId, action);
    }
  }
});

function handleLiButtonClick(userId: string, action: string){
  if(action === "delete"){
      db.removeUser(userId);
      renderUI();
      return;
  }

  if(action=== "edit"){
    console.log("edit user");
    editUserContext = db.getUser(userId) ?? null;
    renderUI();
    return;
  }

}