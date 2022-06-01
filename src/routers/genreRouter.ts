import {Router} from "express";
import {add, getAll} from "../controllers/genreController";
import {checkAuth} from "../middlewares/authMiddleware";
import {Role} from "../types/role";

const router = Router();
router.get('/genres/', getAll);
router.post('/genres/', checkAuth([Role.admin, Role.manager]), add);

export default router;
