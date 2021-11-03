import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { Link, useHistory } from 'react-router-dom';

import api from '../services/api';

import { Layout } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import styles from '../styles/pages/Home.module.css';

import search from '../assets/icons/search.svg';

interface Movie{
  id: number;
  title: string;
  poster: string;
}

export function Home(){
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [similarMoviesToWatch, setSimilarMoviesToWatch] = useState<Movie[]>([]);
  const [similarMoviesWatched, setSimilarMoviesWatched] = useState<Movie[]>([]);

  const [moviesToWatch, setMoviesToWatch] = useState<Movie[]>([]);
  const [moviesWatched, setMoviesWatched] = useState<Movie[]>([]);
  const [moviesSearched, setMoviesSearched] = useState<Movie[]>([]);

  const { register, handleSubmit, reset } = useForm();

  const [selectedItem, setSelectedItem] = useState('recommendations');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const profileData = localStorage.getItem('profile');
    let id = 0;
    if(profileData){
      id = (JSON.parse(profileData)).id;
    }

    api.get(`profiles/${id}/movies`).then(res => {
      setPopularMovies(res.data.popularMovies);
      setSimilarMoviesToWatch(res.data.similarMoviesToWatch);
      setSimilarMoviesWatched(res.data.similarMoviesWatched);
    }).catch(err => console.log(err.response.data));

    api.get(`profiles/${id}/movies/watch`).then(res => {
      setMoviesToWatch(res.data);
    }).catch(err => console.log(err.response.data));

    api.get(`profiles/${id}/movies/watched`).then(res => {
      setMoviesWatched(res.data);
    }).catch(err => console.log(err.response.data));

  }, []);

  async function searchMovies(data: any){
    const profileData = localStorage.getItem('profile');
    let id = 0;
    if(profileData){
      id = (JSON.parse(profileData)).id;
    }
    
    api.get(`profiles/${id}/movies/search?name=${data.name}`)
      .then(res => {
        setMoviesSearched(res.data);
        setIsSearching(true);
        reset({something: ''});
      })
      .catch(err => console.log(err.response.data))
  }

  return(
    <Layout>
      <div className={styles.content}>

        <div className={styles.menu}>
          <div className={styles.item}>
            <button type='button' onClick={() => setSelectedItem('recommendations')}>
              Recomendações
            </button>
            <hr className={classnames({[styles.selectedItem]: selectedItem === 'recommendations'})} />
          </div>

          <div className={styles.item}>
            <button type='button' onClick={() => setSelectedItem('to watch')}>
              Para ver
            </button>
            <hr className={classnames({[styles.selectedItem]: selectedItem === 'to watch'})} />
          </div>

          <div className={styles.item}>
            <button type='button' onClick={() => setSelectedItem('watched')}>
              Já visto
            </button>
            <hr className={classnames({[styles.selectedItem]: selectedItem === 'watched'})} />
          </div>

        </div>

        <div className="contentArea">
          {(() => {
            if(selectedItem === 'recommendations'){
              return(
                <>
                
                <form onSubmit={handleSubmit(searchMovies)}>
                  <Input 
                    name="name"
                    type="text" 
                    placeholder='Pesquise por algum filme' 
                    id={styles.searchInput}
                    inputRef={register({required: true})}
                  />
                  <button type='submit'>
                    <img src={search} alt="Pesquisar" />
                  </button>

                  {(() => {
                    if(isSearching) return <button className={styles.buttonBack} onClick={() => { setIsSearching(false); reset({something: ''}) }}>Voltar</button>
                  })()}
                </form>

                {(() => {
                  if(isSearching){
                    return(
                      <div className={styles.movieList}>
                        {moviesSearched.map(movie => {
                          return(
                            <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.movieItem}>
                              <div className={styles.poster}>
                                <img className='poster' src={movie.poster} alt={movie.title}/>
                              </div>

                              <p>{movie.title}</p>
                            </Link>
                          )
                        })}
                      </div>
                    )
                  } else {
                    return(
                      <>
                      <div className={styles.contentContainer}>
                        <h1>Filmes Populares</h1>
                        <div className={styles.elementsList}>          
                          {popularMovies.map(movie => {
                            return(
                              <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.movieItem}>
                                <div className={styles.poster}>
                                  <img className='poster' src={movie.poster} alt={movie.title}/>
                                </div>

                                <p>{movie.title}</p>
                              </Link>
                            )
                          })}
                        </div>
                      </div>

                      <div className={styles.contentContainer}>
                        <h1>Filmes similares aos que você já viu</h1>
                        <div className={styles.elementsList}>          
                          {similarMoviesWatched.map(movie => {
                            return(
                              <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.movieItem}>
                                <div className={styles.poster}>
                                  <img className='poster' src={movie.poster} alt={movie.title}/>
                                </div>

                                <p>{movie.title}</p>
                              </Link>
                            )
                          })}
                        </div>
                      </div>

                      <div className={styles.contentContainer}>
                        <h1>Filmes similares aos que você quer ver</h1>
                        <div className={styles.elementsList}>          
                          {similarMoviesToWatch.map(movie => {
                            return(
                              <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.movieItem}>
                                <div className={styles.poster}>
                                  <img className='poster' src={movie.poster} alt={movie.title}/>
                                </div>

                                <p>{movie.title}</p>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                      </>
                    )
                  }
                })()}
                </>
              )
            }
            else if(selectedItem === 'to watch'){
              return(
                <div className={styles.movieList}>
                  {moviesToWatch.map(movie => {
                    return(
                      <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.movieItem}>
                        <div className={styles.poster}>
                          <img className='poster' src={movie.poster} alt={movie.title}/>
                        </div>

                        <p>{movie.title}</p>
                      </Link>
                    )
                  })}
                </div>
              )
              
            }
            else if(selectedItem === 'watched'){
              return(
                <div className={styles.movieList}>
                  {moviesWatched.map(movie => {
                    return(
                      <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.movieItem}>
                        <div className={styles.poster}>
                          <img className='poster' src={movie.poster} alt={movie.title}/>
                        </div>

                        <p>{movie.title}</p>
                      </Link>
                    )
                  })}
                </div>
              )
            }
          })()}
        </div>
    
      </div>
    </Layout>
  )
}