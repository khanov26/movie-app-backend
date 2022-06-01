import {Router} from "express";
import {create, deleteById, getById, update, getCharacters, getAll} from "../controllers/actorController";
import {checkAuth} from "../middlewares/authMiddleware";
import {Role} from "../types/role";

const router = Router();
router.post('/actor', checkAuth([Role.admin, Role.manager]), create);
router.put('/actor', checkAuth([Role.admin, Role.manager]), update);
router.get('/actors', getAll);
router.get('/actor/:id', getById);
router.delete('/actor/:id', checkAuth([Role.admin]), deleteById);
router.get('/actor/:id/characters', getCharacters);

export default router;
