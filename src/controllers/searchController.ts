import {Request, Response} from "express";
import * as actorService from "../services/actorService";
import * as movieService from '../services/movieService';
import {getUpperConstraint} from "../utils/search";

export const search = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;
        if (!query) {
            return res.status(400).send('Invalid query term');
        }
        const actorsQuery = actorService.getAll(query);
        const moviesQuery = movieService.getAll([
            {
                field: 'title',
                comparison: '>=',
                value: query,
            },
            {
                field: 'title',
                comparison: '<',
                value: getUpperConstraint(query),
            }
        ], {field: 'title'});
        const [movies, actors] = await Promise.all([moviesQuery, actorsQuery]);
        return res.json({movies, actors});
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
