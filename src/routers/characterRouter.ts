import {Router} from "express";
import {create, deleteById} from "../controllers/characterController";
import {checkAuth} from "../middlewares/authMiddleware";
import {Role} from "../types/role";

const router = Router();
router.post('/character', checkAuth([Role.admin, Role.manager]), create);
router.delete('/character/:id', checkAuth([Role.admin, Role.manager]), deleteById);

export default router;
