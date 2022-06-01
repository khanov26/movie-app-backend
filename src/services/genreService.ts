import {addDoc, collection, getDocs, query, where, orderBy} from "firebase/firestore";
import {db} from "../firebase/app";
import {QueryConstraint, DocumentReference} from "@firebase/firestore";
import {getUpperConstraint} from "../utils/search";

export const getAll = async (name?: string): Promise<string[]> => {
    const genresRef = collection(db, 'genres');
    const queryConstraints: QueryConstraint[] = [];
    if (name) {
        queryConstraints.push(where('name', '>=', name));
        queryConstraints.push(where('name', '<', getUpperConstraint(name)));
    }
    const q = query(genresRef, ...queryConstraints, orderBy('name'));
    const genresSnap = await getDocs(q);

    const genres: string[] = [];
    genresSnap.forEach(genre => {
        genres.push(genre.data().name);
    });

    return genres;
};

export const add = async (genreNames: string[]): Promise<void> => {
    if (!genreNames.length) {
        return;
    }

    const genresRef = collection(db, 'genres');
    const q = query(genresRef, where('name', 'in', genreNames));
    const genresSnap = await getDocs(q);

    if (genreNames.length === genresSnap.size) {
        return;
    }

    const genresDb: string[] = [];
    genresSnap.forEach(genre => {
        genresDb.push(genre.data().name);
    });

    const newGenres = genreNames.filter(genre => !genresDb.includes(genre));
    const genreAddPromises: Promise<DocumentReference>[] = [];
    newGenres.forEach(newGenre => {
        const genreAddPromise = addDoc(genresRef, {name: newGenre});
        genreAddPromises.push(genreAddPromise);
    });
    await Promise.all(genreAddPromises);
};
