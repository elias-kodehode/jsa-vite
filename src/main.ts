import './style.css'
import { v7 } from 'uuid';

interface UserForm{
  username: string;
  email: string;
}

interface User{
  username: string;
  email: string;
  id?: string;
}

const form = document.querySelector("form") as HTMLFormElement;
const ul = document.querySelector("ul") as HTMLUListElement;

form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const formData = new FormData(form);
  const user = Object.fromEntries(formData) as unknown as UserForm;


  appendUser({...user, id: v7()});
});




function appendUser(user: User){
  const users = JSON.parse(localStorage.getItem("users") ?? "[]") as User[];
  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));

  renderUI();
}



function renderUI(){
  ul.innerHTML = "";
  const users = getUsers();
  for (const user of users) {
    ul.innerHTML += 
    `<li>
      ID: ${user.id} Username: ${user.username} Email: ${user.email} <button type="button" data-userID="${user.id}">Delete</button>
    </li>`;
  }
}

function deleteUser(id: string = "123"){
  const users = getUsers();
  const index = users.findIndex(x => x.id === id);
  localStorage.setItem("users", JSON.stringify(users.toSpliced(index, 1)));
  renderUI();
}

function getUsers(): User[]{
  return JSON.parse(localStorage.getItem("users")!);
}


document.addEventListener("DOMContentLoaded", () => {
  renderUI();
});

document.addEventListener("click", (e) => {
  const element = e.target as HTMLElement;
  if(element instanceof HTMLButtonElement && element.type !== "submit"){
    deleteUser(element.dataset.userid);
  }
});