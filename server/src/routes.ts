import { Router } from 'express';

import authMiddleware from './middlewares/authMiddleware';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import ProfileController from './controllers/ProfileController';
import MovieController from './controllers/MovieController';

const router = Router();

//users
router.post('/users', UserController.store);
router.post('/auth', AuthController.authenticate);
router.get('/users', authMiddleware, UserController.show);
router.patch('/users', authMiddleware, UserController.update);
router.delete('/users', authMiddleware, UserController.delete);

//profiles
router.post('/profiles', authMiddleware, ProfileController.store);
router.get('/profiles/:profile_id', authMiddleware, ProfileController.show);
router.get('/profiles', authMiddleware, ProfileController.index);
router.put('/profiles/:profile_id', authMiddleware, ProfileController.update);
router.delete('/profiles/:profile_id', authMiddleware, ProfileController.delete);

//movies
router.post('/profiles/:profile_id/movies', authMiddleware, MovieController.store);
router.get('/profiles/:profile_id/movies', authMiddleware, MovieController.index);
router.get('/profiles/:profile_id/movies/search', authMiddleware, MovieController.searchMovies);
router.get('/profiles/:profile_id/movies/watch', authMiddleware, MovieController.watchList);
router.get('/profiles/:profile_id/movies/watched', authMiddleware, MovieController.watchedList);
router.get('/profiles/:profile_id/movies/:movie_id', authMiddleware, MovieController.show);
router.patch('/profiles/:profile_id/movies', authMiddleware, MovieController.confirmWatched);
router.delete('/profiles/:profile_id/movies/:movie_id', authMiddleware, MovieController.delete);

export { router }