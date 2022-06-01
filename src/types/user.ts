import {Role} from "./role";

export interface User {
    id?: string;
    email: string;
    name: string;
    role: Role;
    passwordHash: string;
    profile?: string;
}
