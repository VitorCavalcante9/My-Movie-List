import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import movieApi from '../services/theMovieDbApi';

import { AppError } from '../models/AppError';
import { MoviesRepository } from '../repositories/MoviesRepository';
import MoviesView from '../views/MoviesView';
import { ProfilesRepository } from '../repositories/ProfilesRepository';

class MovieController{
  async store(req: Request, res: Response){
    const { movie_id } = req.body;
    const { profile_id } = req.params;
    const moviesRepository = getCustomRepository(MoviesRepository);

    try{      
      const existingMovieInList = await moviesRepository.findOne({ where: { profile_id, movie_id }});
      if(!existingMovieInList){
        const movie = moviesRepository.create({ profile_id: Number(profile_id), movie_id, watched: false });

        await moviesRepository.save(movie);
      }

      return res.status(201).json({ message: 'Adicionado com sucesso' });
    } 
    catch(err){
      throw new AppError(err.message);
    }

  }

  async show(req: Request, res: Response){
    const { profile_id, movie_id } = req.params;
    const moviesRepository = getCustomRepository(MoviesRepository);

    let movie: any;
    try{
      await movieApi.get(`movie/${movie_id}?api_key=${process.env.MOVIE_API_KEY}&language=pt-BR`)
        .then(response => {
          movie = response.data;
        })
        .catch(err => {
          throw new AppError(err.response.data.status_message);
        });

      const existingMovieInList = await moviesRepository.findOne({ where: { profile_id, movie_id }});
      let inList: any = false;
      if(existingMovieInList){
        inList = existingMovieInList.watched ? 'watched' : 'plan to watch';
      }

      res.json(MoviesView.renderDetails(movie, inList));
    }
    catch (err){
      throw new AppError(err.message)
    }
  }

  async index(req: Request, res: Response){
    const { profile_id } = req.params;

    let popularMovies;
    let similarMoviesToWatch = [];
    let similarMoviesWatched = [];

    try{
      await movieApi.get(`movie/popular?api_key=${process.env.MOVIE_API_KEY}&language=pt-BR`)
        .then(response => {
          popularMovies = MoviesView.renderMany(response.data.results);
        })
        .catch(err => {
          throw new AppError(err.response.data.status_message);
        });

      const profilesRepository = getCustomRepository(ProfilesRepository);
      const profile = await profilesRepository.findOneOrFail(profile_id, {
        relations: ['movies']
      });

      const planToWatchMovies = profile.movies.filter(movie => movie.watched == false);
      const watchedMovies = profile.movies.filter(movie => movie.watched == true);

      for(let movie of planToWatchMovies){
        await movieApi.get(`movie/${movie.movie_id}/recommendations?api_key=${process.env.MOVIE_API_KEY}&language=pt-BR`)
        .then(response => {
          const allSimilar = response.data.results;

          if(similarMoviesToWatch.length < 20){
            for(let i = 0; i < 2; i++){
              similarMoviesToWatch.push(MoviesView.render(allSimilar[i]));
            }
          }
        })
        .catch(err => {
          throw new AppError(err.response.data.status_message);
        }); 
      }

      for(let movie of watchedMovies){
        await movieApi.get(`movie/${movie.movie_id}/recommendations?api_key=${process.env.MOVIE_API_KEY}&language=pt-BR`)
        .then(response => {
          const allSimilar = response.data.results;

          if(similarMoviesWatched.length < 20){
            for(let i = 0; i < 2; i++){
              similarMoviesWatched.push(MoviesView.render(allSimilar[i]));
            }
          }
        })
        .catch(err => {
          throw new AppError(err.response.data.status_message);
        }); 
      }
      
      return res.json({ popularMovies, similarMoviesToWatch, similarMoviesWatched});
    } 
    catch (err) {
      throw new AppError(err.message)
    }

  }

  async watchList(req: Request, res: Response){
    const { profile_id } = req.params;

    try{
      const profilesRepository = getCustomRepository(ProfilesRepository);
      const profile = await profilesRepository.findOneOrFail(profile_id, {
        relations: ['movies']
      });

      const planToWatchMoviesIds = profile.movies.filter(movie => movie.watched == false);

      let planToWatchMovies = [];
      for(let movie of planToWatchMoviesIds){
        await movieApi.get(`movie/${movie.movie_id}?api_key=${process.env.MOVIE_API_KEY}&language=pt-BR`)
          .then(response => {
            planToWatchMovies.push(response.data);
          })
          .catch(err => {
            throw new AppError(err.response.data.status_message);
          }); 
      }

      return res.json(MoviesView.renderMany(planToWatchMovies));

    }
    catch(err){
      throw new AppError(err.message);
    }
  }

  async watchedList(req: Request, res: Response){
    const { profile_id } = req.params;

    try{
      const profilesRepository = getCustomRepository(ProfilesRepository);
      const profile = await profilesRepository.findOneOrFail(profile_id, {
        relations: ['movies']
      });

      const watchedMoviesIds = profile.movies.filter(movie => movie.watched == true);
      
      let watchedMovies = [];
      for(let movie of watchedMoviesIds){
        await movieApi.get(`movie/${movie.movie_id}?api_key=${process.env.MOVIE_API_KEY}&language=pt-BR`)
          .then(response => {
            watchedMovies.push(response.data);
          })
          .catch(err => {
            throw new AppError(err.response.data.status_message);
          }); 
      }

      return res.json(MoviesView.renderMany(watchedMovies));

    }
    catch(err){
      throw new AppError(err.message);
    }
  }

  async searchMovies(req: Request, res: Response){
    const { name } = req.query;

    let movies;
    try{
      await movieApi.get(`search/movie?api_key=${process.env.MOVIE_API_KEY}&language=pt-BR&query=${name}`)
      .then(response => {
        movies = response.data.results;
      })
      .catch(err => {
        throw new AppError(err.response.data.status_message);
      });

      return res.json(MoviesView.renderMany(movies));
    }
    catch(err) {
      throw new AppError(err.message)
    }

  }

  async confirmWatched(req: Request, res: Response){
    const { profile_id } = req.params;
    const { movie_id } = req.body;

    const moviesRepository = getCustomRepository(MoviesRepository);

    try{
      const movie = await moviesRepository.findOneOrFail({ where: { profile_id, movie_id }});
      
      const newMovieData = {
        ...movie,
        watched: true
      }
      await moviesRepository.update(movie.id, newMovieData);

      res.json('Adicionado à lista de assistidos');
    }
    catch(err) {
      throw new AppError(err.message);
    }
  }

  async delete(req: Request, res: Response){
    const { profile_id, movie_id } = req.params;
    const moviesRepository = getCustomRepository(MoviesRepository);
    
    try{
      const movie = await moviesRepository.findOneOrFail({ where: { profile_id, movie_id }});
      
      await moviesRepository.delete(movie.id);

      res.sendStatus(200);
    }
    catch(err) {
      throw new AppError('Este filme está em nenhuma lista');
    }
  }
}

export default new MovieController();