import type { User } from "./types/User";

export function addUser(user: User){
    const users = JSON.parse(localStorage.getItem("users") ?? "[]") as User[];
    users.push(user);
  
    localStorage.setItem("users", JSON.stringify(users));
}

export function removeUser(id: string){
    const users = getUsers();
    const index = users.findIndex(x => x.id === id);
    localStorage.setItem("users", JSON.stringify(users.toSpliced(index, 1)));
}

export function getUsers(): User[]{
    return JSON.parse(localStorage.getItem("users")!) || [];
}

export function getUser(id: string): User | null{
    const users = getUsers();
    return users.find(x => x.id === id) ?? null;
}