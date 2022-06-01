import {User} from "../types/user";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
    runTransaction
} from "firebase/firestore";
import {db} from "../firebase/app";
import {UploadedFile} from "express-fileupload";
import * as storageService from "./storageService";
import * as movieService from "./movieService";
import {Movie} from "../types/movie";

export const getByEmail = async (email: string): Promise<User | null> => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const users = await getDocs(q);
    if (users.empty) {
        return null;
    }

    const user = users.docs[0];
    return {
        id: user.id,
        ...user.data() as Omit<User, 'id'>,
    }
};

export const getById = async (id: string): Promise<User | null> => {
    const userRef = doc(db, `users/${id}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return null;
    }

    return {
        id: userSnap.id,
        ...userSnap.data() as Omit<User, 'id'>,
    }
};

export const create = async (user: User): Promise<User> => {
    const createdUser = await addDoc(collection(db, 'users'), user);
    return {
        id: createdUser.id,
        ...user,
    }
};

export const deleteBy = async (id: string) => {
    const user = await getById(id);
    if (!user) {
        return false;
    }
    await deleteDoc(doc(db, 'users', id));
    return true;
};

export const update = async (user: Partial<User>, profile?: UploadedFile): Promise<Omit<User, 'passwordHash'>> => {
    if (!user.id) {
        throw new Error('User does not have id field');
    }
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error('User was not found');
    }

    let profileUrl;
    if (profile) {
        const oldProfileUrl = userSnap.data().profile;
        if (oldProfileUrl) {
            storageService.deleteFile(oldProfileUrl);
        }
        profileUrl = await storageService.uploadFile(profile, 'images/user_profiles/').then(profileFile => {
            return storageService.getDownloadUrl(`images/user_profiles/${profileFile}`)
        });
    }

    const {id, ...updateData} = user;
    if (profileUrl) {
        updateData.profile = profileUrl;
    }
    await updateDoc(userRef, updateData as Omit<User, 'id'>);

    const {passwordHash, ...userOldData} = userSnap.data() as Omit<User, 'id'>;

    return {
        ...userOldData,
        ...user,
        profile: profileUrl ?? userSnap.data().profile,
    };
};

export const addFavoriteMovie = async (movieId: string, userId: string) => {
    const movieRef = doc(db, 'users', userId, 'favoriteMovies', movieId);
    await setDoc(movieRef, {exists: true});
};

export const removeFavoriteMovie = async (movieId: string, userId: string) => {
    const movieRef = doc(db, 'users', userId, 'favoriteMovies', movieId);
    await deleteDoc(movieRef);
};

export const checkFavoriteMovie = async (movieId: string, userId: string) => {
    const movieRef = doc(db, 'users', userId, 'favoriteMovies', movieId);
    const movieSnap = await getDoc(movieRef);
    return movieSnap.exists();
};

export const getFavoriteMovies = async (userId: string): Promise<Pick<Movie, 'id' | 'title' | 'poster'>[]> => {
    const q = query(collection(db, 'users', userId, 'favoriteMovies'));
    const favMoviesSnap = await getDocs(q);
    if (favMoviesSnap.empty) {
        return [];
    }

    const promises = favMoviesSnap.docs.map(async favMovieSnap => {
        const movieSnap = await getDoc(doc(db, 'movies', favMovieSnap.id));
        const {title, poster} = movieSnap.data() as Movie;
        return {id: movieSnap.id, title, poster};
    });
    return await Promise.all(promises);
};

export const rateMovie = async (userId: string, movieId: string, userRating: number) => {
    const ratingRef = doc(db, 'users', userId, 'ratedMovies', movieId);
    const ratingSnap = await getDoc(ratingRef);

    await runTransaction(db, async transaction => {
        const movieRef = doc(db, 'movies', movieId);
        const movieSnap = await transaction.get(movieRef);
        if (!movieSnap.exists()) {
            throw 'Movie does not exist';
        }
        const {rating = 0, rateNumber = 0} = movieSnap.data();

        if (ratingSnap.exists()) {
            const {rating: userOldRating} = ratingSnap.data();
            transaction.set(ratingRef, {rating: userRating});

            transaction.update(movieRef, {
                rating: (rating * rateNumber - userOldRating + userRating) / rateNumber,
            });
        } else {
            transaction.set(ratingRef, {rating: userRating});

            transaction.update(movieRef, {
                rateNumber: rateNumber + 1,
                rating: (rating * rateNumber + userRating) / (rateNumber + 1),
            });
        }
    });
};

export const getMovieRating = async (userId: string, movieId: string) => {
    const ratingRef = doc(db, 'users', userId, 'ratedMovies', movieId);
    const ratingSnap = await getDoc(ratingRef);

    if (!ratingSnap.exists()) {
        return null;
    }

    return ratingSnap.data().rating;
};
