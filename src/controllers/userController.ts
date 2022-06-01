import {Request, Response} from "express";
import * as userService from "../services/userService";
import {User} from "../types/user";

export const getById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getById(req.params.id);
        if (!user) {
            return res.status(404).send('Пользоваетль не найден');
        }
        const {passwordHash, ...data} = user;
        return res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const user: Partial<User> = {
            id: req.body.id,
            name: req.body.name,
        };

        let profile = req.files?.profile;
        if (Array.isArray(profile)) {
            profile = profile[0];
        }

        const updatedUser = await userService.update(user, profile);
        return res.json(updatedUser);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const addFavoriteMovie = async (req: Request, res: Response) => {
    try {
        const {movieId, userId} = req.body;
        await userService.addFavoriteMovie(movieId, userId);
        return res.status(204).send();
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const removeFavoriteMovie = async (req: Request, res: Response) => {
    try {
        const {movieId, userId} = req.params;
        await userService.removeFavoriteMovie(movieId, userId);
        return res.status(204).send();
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const checkFavoriteMovie = async (req: Request, res: Response) => {
    try {
        const {movieId, userId} = req.query;
        const isFavorite = await userService.checkFavoriteMovie(movieId as string, userId as string);
        return res.json({isFavorite});
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const getFavoriteMovies = async (req: Request, res: Response) => {
    try {
        const {id: userId} = req.params;
        const movies = await userService.getFavoriteMovies(userId);
        return res.json(movies);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const rateMovie = async (req: Request, res: Response) => {
    try {
        const {userId, movieId, userRating} = req.body;
        await userService.rateMovie(userId, movieId, Number(userRating));
        return res.status(204).send();
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const getMovieRating = async (req: Request, res: Response) => {
    try {
        const {userId, movieId} = req.query;
        const rating = await userService.getMovieRating(userId as string, movieId as string);
        return res.json({rating});
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
