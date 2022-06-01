import {Request, Response} from "express";
import * as characterService from "../services/characterService";

export const create = async (req: Request, res: Response) => {
    try {
        const character = await characterService.create(req.body);
        return res.json(character);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const deleteById = async (req: Request, res: Response) => {
    try {
        await characterService.deleteById(req.params.id);
        return res.status(204).send();
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

