import {Request, Response} from "express";
import {Actor} from "../types/actor";
import * as actorService from "../services/actorService";
import * as characterService from "../services/characterService";

export const create = async (req: Request, res: Response) => {
    try {
        const actor: Actor = {
            name: req.body.name,
            biography: req.body.biography || '',
            gender: Number(req.body.gender),
            birthday: req.body.birthday || '',
            deathday: req.body.deathday || '',
        };


        let profile = req.files?.profile;
        if (Array.isArray(profile)) {
            profile = profile[0];
        }

        const createdActor = await actorService.create(actor, profile);
        return res.json(createdActor);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const actor = await actorService.getById(req.params.id);
        if (actor) {
            return res.json(actor);
        }
        return res.status(404).send('Actor was not found');
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const actors = await actorService.getAll(req.query.name as string);
        return res.json(actors);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const actor: Actor = {
            id: req.body.id,
            name: req.body.name,
            biography: req.body.biography,
            gender: Number(req.body.gender),
            birthday: req.body.birthday,
            deathday: req.body.deathday,
        };

        let profile = req.files?.profile;
        if (Array.isArray(profile)) {
            profile = profile[0];
        }
        const updatedActor = await actorService.update(actor, profile);
        return res.json(updatedActor);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const deleteById = async (req: Request, res: Response) => {
    try {
        const result = await actorService.deleteById(req.params.id);
        if (result) {
            return res.status(204).send();
        }
        return res.status(400).send('Actor was not found');
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const getCharacters = async (req: Request, res: Response) => {
    try {
        const characters = await characterService.getByActorId(req.params.id);
        return res.json(characters);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
