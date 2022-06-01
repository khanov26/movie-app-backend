import {Actor} from "./actor";
import {Movie} from "./movie";

export interface Character {
    id?: string;
    name: string;
    actor: Pick<Actor, 'id' | 'name' | 'profile'>;
    movie: Pick<Movie, 'id' | 'title' | 'poster'>;
}
