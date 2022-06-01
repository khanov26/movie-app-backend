import {Router} from 'express';
import {create, deleteById, getAll, getById, getCharacters, update} from "../controllers/movieController";
import {checkAuth} from "../middlewares/authMiddleware";
import {Role} from "../types/role";

const router = Router();
router.post('/movie', checkAuth([Role.admin, Role.manager]), create);
router.put('/movie', checkAuth([Role.admin, Role.manager]), update);
router.get('/movie/:id', getById);
router.delete('/movie/:id', checkAuth([Role.admin]), deleteById);
router.get('/movies', getAll);
router.get('/movie/:id/characters', getCharacters);

export default router;
