import {Gender} from "./gender";

export interface Actor {
    id?: string;
    name: string;
    gender: Gender;
    profile?: string;
    birthday?: string;
    deathday?: string;
    biography?: string;
}
