import type { EditUser } from "./types/EditUser";
import type { User } from "./types/User";

//the current user being edited
let currentUser: User | null = null;

//allows for observers to listen callbacks, make sure to clean this up
let callback: null |( (user:User) =>  void);


const modal = document.getElementById("edit-modal") as HTMLDialogElement;
const form = document.querySelector("#edit-modal form") as HTMLFormElement;

const cancelBtn = form.querySelector('button[type="button"') as HTMLButtonElement;

cancelBtn?.addEventListener("click", () => {

    closeEditModal();
});

form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData) as unknown as EditUser;

    //copy user data from the EditUser model.
    const user:User = {...userData, id: currentUser!.id, passwordHash: currentUser!.passwordHash};
    //inform the observer that the user has been saved
    callback?.call(null, user);
    closeEditModal();
});


//show the modal and fill in information about the user
//store a callback function to let observers know that we saved a user
export function showEditModal(user: User, editCallback: (user: User) => void){
    currentUser = user;
    const usernameField = modal.querySelector('input[data-edit-username]') as HTMLInputElement;
    const emailField = modal.querySelector('input[data-edit-email]') as HTMLInputElement;

    usernameField.value = currentUser.username;
    emailField.value = currentUser.email;


    //set the callback received from the caller, and inform the caller when the state has been saved
    callback = editCallback;
    modal.show();
}

//Close modal and clean up instance variables
export function closeEditModal(){
    //clean up current user
    currentUser = null;

    //clean up callback function
    callback = null;
    modal.close();
}



