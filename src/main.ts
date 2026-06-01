import './style.css'
import * as uuid from "uuid";

interface UserForm{
  username: string;
  email: string;
  id?: string;
}

const form = document.querySelector("form") as HTMLFormElement;

form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const formData = new FormData(form);
  const user = Object.fromEntries(formData) as unknown as UserForm;


  appendUser({...user, id: generateUUID()});
});




function appendUser(user: UserForm){
  const users = JSON.parse(localStorage.getItem("users") ?? "[]") as UserForm[];
  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));
}


function generateUUID() :string{
  return uuid.v7();
}