import {db} from '../firebase/app';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
    orderBy,
    limit
} from 'firebase/firestore';
import {Movie} from "../types/movie";
import {UploadedFile} from "express-fileupload";
import {add as addGenres} from './genreService';
import {deleteFile, getDownloadUrl, uploadFile} from "./storageService";
import {deleteByMovieId as deleteCharactersByMovieId} from "./characterService";
import firebase from "firebase/compat";
import {FirestoreFilter, FirestoreOrder} from "../types/firestore";


export const create = async (movie: Movie, poster?: UploadedFile, backdrop?: UploadedFile): Promise<Movie> => {
    let posterPromise;
    if (poster) {
        posterPromise = uploadFile(poster, 'images/posters/').then(posterFile => {
            return getDownloadUrl(`images/posters/${posterFile}`)
        });
    }

    let backdropPromise;
    if (backdrop) {
        backdropPromise = uploadFile(backdrop, 'images/backdrops/').then(backdropFile => {
            return getDownloadUrl(`images/backdrops/${backdropFile}`)
        });
    }

    const [posterUrl, backdropUrl] = await Promise.all([
        posterPromise,
        backdropPromise
    ]);

    const data = {...movie};
    data.rating = 0;

    if (posterUrl) {
        data.poster = posterUrl;
    }
    if (backdropUrl) {
        data.backdrop = backdropUrl;
    }

    const docRef = await addDoc(collection(db, 'movies'), data);

    addGenres(data.genres);

    return {
        id: docRef.id,
        ...data
    }
};

export const update = async (movie: Movie, poster?: UploadedFile, backdrop?: UploadedFile): Promise<Movie> => {
    if (!movie.id) {
        throw new Error('Movie does not have id field');
    }
    const movieRef = doc(db, 'movies', movie.id);
    const movieSnap = await getDoc(movieRef);

    if (!movieSnap.exists()) {
        throw new Error('Movie was not found');
    }

    let posterPromise;
    if (poster) {
        const oldPosterFilename = movieSnap.data().poster;
        if (oldPosterFilename) {
            deleteFile(oldPosterFilename);
        }
        posterPromise = uploadFile(poster, 'images/posters/').then(posterFile => {
            return getDownloadUrl(`images/posters/${posterFile}`);
        });
    }

    let backdropPromise;
    if (backdrop) {
        const oldBackdropFilename = movieSnap.data().backdrop;
        if (oldBackdropFilename) {
            deleteFile(oldBackdropFilename);
        }
        backdropPromise = uploadFile(backdrop, 'images/backdrops/').then(backdropFile => {
            return getDownloadUrl(`images/backdrops/${backdropFile}`);
        });
    }

    const [posterUrl, backdropUrl] = await Promise.all([
        posterPromise,
        backdropPromise
    ]);

    const {id, ...updateData} = movie;

    if (posterUrl) {
        updateData.poster = posterUrl;
    }
    if (backdropUrl) {
        updateData.backdrop = backdropUrl;
    }

    await updateDoc(movieRef, updateData as Omit<Movie, 'id'>);
    addGenres(movie.genres);

    return {
        ...movie,
        rating: movieSnap.data().rating,
        poster: posterUrl ?? movieSnap.data().poster,
        backdrop: backdropUrl ?? movieSnap.data().backdrop,
    };
};

export const getById = async (id: string): Promise<Movie | null> => {
    const movieRef = doc(db, 'movies', id);
    const movieSnap = await getDoc(movieRef);

    if (!movieSnap.exists()) {
        return null;
    }

    return {
        ...movieSnap.data() as Omit<Movie, 'id'>,
        id,
    }
};

export const deleteById = async (id: string): Promise<boolean> => {
    const movie = await getById(id);
    if (!movie) {
        return false;
    }
    if (movie.poster) {
        deleteFile(movie.poster);
    }
    if (movie.backdrop) {
        deleteFile(movie.backdrop);
    }
    deleteCharactersByMovieId(id);
    await deleteDoc(doc(db, 'movies', id));
    return true;
};

export const getAll = async (filters: FirestoreFilter[], order?: FirestoreOrder): Promise<Movie[]> => {
    const moviesRef = collection(db, 'movies');
    const queryConstraints = filters.map(({field, comparison, value}) => {
        return where(field, comparison, value);
    });

    if (order) {
        queryConstraints.push(orderBy(order.field, order.direction));
    }

    const q = query(moviesRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    const movies: Movie[] = [];
    querySnapshot.forEach(doc => {
        movies.push({
            id: doc.id,
            ...doc.data() as Omit<Movie, 'id'>,
        });
    });

    return movies;
};
