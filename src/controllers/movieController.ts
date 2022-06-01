import {Request, Response} from 'express';
import * as movieService from '../services/movieService';
import * as characterService from '../services/characterService';
import {Movie} from "../types/movie";
import firebase from "firebase/compat";
import OrderByDirection = firebase.firestore.OrderByDirection;
import {FirestoreFilter, FirestoreOrder} from "../types/firestore";
import {getUpperConstraint} from "../utils/search";

export const create = async (req: Request, res: Response) => {
    try {
        const movie: Movie = {
            title: req.body.title,
            overview: req.body.overview,
            releaseDate: Number(req.body.releaseDate),
            genres: req.body['genres[]'],
            runtime: Number(req.body.runtime),
        };

        let poster = req.files?.poster;
        if (Array.isArray(poster)) {
            poster = poster[0];
        }

        let backdrop = req.files?.backdrop;
        if (Array.isArray(backdrop)) {
            backdrop = backdrop[0];
        }

        const createdMovie = await movieService.create(movie, poster, backdrop);
        return res.json(createdMovie);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const movie: Movie = {
            id: req.body.id,
            title: req.body.title,
            overview: req.body.overview,
            releaseDate: Number(req.body.releaseDate),
            genres: req.body['genres[]'],
            runtime: Number(req.body.runtime),
        };

        let poster = req.files?.poster;
        if (Array.isArray(poster)) {
            poster = poster[0];
        }

        let backdrop = req.files?.backdrop;
        if (Array.isArray(backdrop)) {
            backdrop = backdrop[0];
        }

        const updatedMovie = await movieService.update(movie, poster, backdrop);
        return res.json(updatedMovie);

    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const movie = await movieService.getById(req.params.id);
        if (movie) {
            return res.json(movie);
        }
        return res.status(404).send('Movie was not found');
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const deleteById = async (req: Request, res: Response) => {
    try {
        const result = await movieService.deleteById(req.params.id);
        if (result) {
            return res.status(204).send();
        }
        return res.status(400).send('Movie was not found');
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const {
            title,
            maxRuntime,
            minRuntime,
            maxReleaseDate,
            minReleaseDate,
            maxRating,
            minRating,
            genres,
            orderField,
            orderDir,
        } = req.query;

        const filters: FirestoreFilter[] = [];
        if (title) {
            filters.push({
                field: 'title',
                comparison: '>=',
                value: String(title),
            });
            filters.push({
                field: 'title',
                comparison: '<',
                value: getUpperConstraint(String(title)),
            });
        }

        if (maxRuntime) {
            filters.push({
                field: 'runtime',
                comparison: '<=',
                value: Number(maxRuntime),
            });
        }
        if (minRuntime) {
            filters.push({
                field: 'runtime',
                comparison: '>=',
                value: Number(minRuntime),
            });
        }

        if (maxReleaseDate) {
            filters.push({
                field: 'releaseDate',
                comparison: '<=',
                value: Number(maxReleaseDate),
            });
        }
        if (minReleaseDate) {
            filters.push({
                field: 'releaseDate',
                comparison: '>=',
                value: Number(minReleaseDate),
            });
        }

        if (maxRating) {
            filters.push({
                field: 'rating',
                comparison: '<=',
                value: Number(maxRating),
            });
        }
        if (minRating) {
            filters.push({
                field: 'rating',
                comparison: '>=',
                value: Number(minRating),
            });
        }

        if (genres && Array.isArray(genres)) {
            filters.push({
                field: 'genres',
                comparison: 'array-contains-any',
                value: genres as string[],
            });
        }

        let order: FirestoreOrder | undefined;
        if (orderField) {
            order = {field: orderField as string};

            if (orderDir) {
                order.direction = orderDir as OrderByDirection;
            }
        }

        const movies = await movieService.getAll(filters, order);
        return res.json(movies);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const getCharacters = async (req: Request, res: Response) => {
    try {
        const characters = await characterService.getByMovieId(req.params.id);
        return res.json(characters);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
