import {Request, Response} from "express";
import * as genreService from "../services/genreService";

export const getAll = async (req: Request, res: Response) => {
    try {
        const genres = await genreService.getAll(req.query.name as string);
        res.json(genres);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const add = async (req: Request, res: Response) => {
    try {
        const {genres} = req.body;
        if (!Array.isArray(genres) || !genres.length) {
            return res.status(400).send('Invalid genres data');
        }
        await genreService.add(genres);
        res.status(204).send();
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};