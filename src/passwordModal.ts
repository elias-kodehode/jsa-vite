import { comparePassword } from "./userDb";

const modal = document.getElementById("password-modal") as HTMLDialogElement;
const form = document.querySelector("#password-modal form") as HTMLFormElement;

const cancelBtn = form.querySelector('button[type="button"') as HTMLButtonElement;

const inputField = form.querySelector("input") as HTMLInputElement;

cancelBtn.addEventListener("click", () => {
    closePasswordModal();
});

let currentUserId: string | null = null;


form.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(form);
    const input = Object.fromEntries(formData) as unknown as PasswordInput;
    
    var result  = await comparePassword(currentUserId!, input.password);
    closePasswordModal();

    if(result)
        alert("SUCCESS!");
    else
        alert("Wrong password");

});


export function showPasswordModal(userId: string){
    currentUserId = userId;
    modal.show();
}


function closePasswordModal(){
    currentUserId = null;
    inputField.value = "";
    modal.close();
}


type PasswordInput = {
    password: string
}