import {Character} from "../types/character";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase/app";

export const create = async (character: Character): Promise<Character> => {
    const characterRef = await addDoc(collection(db, `characters`), {
        name: character.name,
        actorId: character.actor.id,
        movieId: character.movie.id,
    });

    return {
        ...character,
        id: characterRef.id,
    }
};

export const deleteById = async (characterId: string): Promise<void> => {
    await deleteDoc(doc(db, 'characters', characterId));
};

export const deleteByMovieId = async (movieId: string): Promise<void> => {
    const q = query(collection(db, 'characters'), where('movieId', '==', movieId));
    const charactersSnapshot = await getDocs(q);
    charactersSnapshot.forEach(characterSnapshot => {
        deleteDoc(characterSnapshot.ref);
    });
};

export const deleteByActorId = async (actorId: string): Promise<void> => {
    const q = query(collection(db, 'characters'), where('actorId', '==', actorId));
    const charactersSnapshot = await getDocs(q);
    charactersSnapshot.forEach(characterSnapshot => {
        deleteDoc(characterSnapshot.ref);
    });
};

export const getByMovieId = async (movieId: string): Promise<Character[]> => {
    const q = query(collection(db, 'characters'), where('movieId', '==', movieId));
    const charactersSnapshot = await getDocs(q);
    if (charactersSnapshot.empty) {
        return [];
    }

    const promises = charactersSnapshot.docs.map(async characterSnapshot => {
        const {name, actorId, movieId} = characterSnapshot.data();
        const actorSnapshot = await getDoc(doc(db, 'actors', actorId));
        const {name: actorName, profile} = actorSnapshot.data()!;
        return {
            id: characterSnapshot.id,
            name,
            movie: {id: movieId},
            actor: {
                id: actorId,
                name: actorName,
                profile,
            }
        } as Character
    });
    return await Promise.all(promises);
};

export const getByActorId = async (actorId: string): Promise<Character[]> => {
    const q = query(collection(db, 'characters'), where('actorId', '==', actorId));
    const charactersSnapshot = await getDocs(q);
    if (charactersSnapshot.empty) {
        return [];
    }

    const promises = charactersSnapshot.docs.map(async characterSnapshot => {
        const {name, actorId, movieId} = characterSnapshot.data();
        const movieSnapshot = await getDoc(doc(db, 'movies', movieId));
        const {title, poster} = movieSnapshot.data()!;
        return {
            id: characterSnapshot.id,
            name,
            actor: {id: actorId},
            movie: {
                id: movieId,
                title,
                poster,
            }
        } as Character
    });
    return await Promise.all(promises);
};
