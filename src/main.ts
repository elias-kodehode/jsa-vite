import './style.css'
import { v7 } from 'uuid';
import type { UserForm } from './types/UserForm';
import * as db from './userDb';
import type { User } from './types/User';
import { showEditModal } from './editUserModal';
import * as bcrypt from 'bcryptjs';
import { showPasswordModal } from './passwordModal';

const form = document.querySelector("form") as HTMLFormElement;
const ul = document.querySelector("ul") as HTMLUListElement;

let editUserContext: User | null = null;

document.addEventListener("DOMContentLoaded", () => {
  renderUI();
});

form?.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  //convert formdata to UserForm
  const formData = Object.fromEntries(new FormData(form)) as unknown as UserForm;

  //destructure the formdata so we can separate password and data that should be stored
  const  {password, ...userData} = formData;

  const passwordHash = await bcrypt.hash(password, 12);
  //store user in database, with a new GUIDV7 and with a generated password hash
  db.addUser({...userData, id: v7(), passwordHash: passwordHash});

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
      <button data-button-type="password" type="button" data-userID="${id}">Login</button>
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
    //user SHOULD be guranteed since the button is attached to an user
    const user = db.getUser(userId)!;

    //show the modal to edit the user, and receive a notification when its been saved
    showEditModal(user, (editedUser) => {
      db.editUser(editedUser);
      renderUI();
    });

    renderUI();
    return;
  }

  if(action === "password"){
    showPasswordModal(userId);
  }

}