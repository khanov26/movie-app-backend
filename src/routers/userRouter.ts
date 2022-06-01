import {Router} from "express";
import {
    addFavoriteMovie,
    checkFavoriteMovie,
    getById,
    getFavoriteMovies,
    getMovieRating,
    rateMovie,
    removeFavoriteMovie,
    update
} from "../controllers/userController";

const router = Router();
router.post('/user/favorite-movies', addFavoriteMovie);
router.get('/user/favorite-movies', checkFavoriteMovie);
router.delete('/user/:userId/favorite-movies/:movieId', removeFavoriteMovie);
router.get('/user/:id/favorite-movies', getFavoriteMovies);

router.post('/user/rate-movie', rateMovie);
router.get('/user/rate-movie', getMovieRating);

router.get('/user/:id', getById);
router.put('/user', update);

export default router;
