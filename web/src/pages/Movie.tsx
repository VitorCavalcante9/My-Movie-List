/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useParams } from 'react-router';

import api from '../services/api';

import { Layout } from '../components/Layout';

import styles from '../styles/pages/Movie.module.css';

interface MovieInterface{
  id: number;
  title: string;
  original_title: string;
  poster: string;
  overview: string;
  genres: Array<string>;
  release_data: string;
  inList: any;
}

interface MovieParams{
  id: string;
}

export function Movie(){
  const params = useParams<MovieParams>();
  const [movie, setMovie] = useState<MovieInterface>();
  const [profileId, setProfileId] = useState<number>();  

  useEffect(() => {
    const profileData = localStorage.getItem('profile');
    let id = 0;
    if(profileData){
      id = (JSON.parse(profileData)).id;
      setProfileId((JSON.parse(profileData)).id);
    }

    api.get(`profiles/${id}/movies/${params.id}`).then(res => {
      setMovie(res.data);
    }).catch(err => console.log(err.response.data))
  }, [params.id, addList, removeMovie]);

  async function addList(){
    if(!movie?.inList){
      api.post(`profiles/${profileId}/movies`, {
        movie_id: params.id
      }).then(res => console.log(res.data.message)).catch(err => console.log(err.response.data));
    } 
    else if(movie.inList === 'plan to watch'){
      api.patch(`profiles/${profileId}/movies`, {
        movie_id: params.id
      }).then().catch(err => console.log(err.response.data));
    }
  }

  async function removeMovie(){
    api.delete(`profiles/${profileId}/movies/${params.id}`).then()
      .catch(err => console.log(err.response.data))
  }

  return(
    <Layout>
      <div className={styles.content}>
        <div className={styles.head}>
          <div className={styles.poster}>
            <img className='poster' src={movie?.poster} alt={movie?.title}/>
          </div>

          <div className={styles.info}>
            <h1>{movie?.title}</h1>
            <p>Título Original: {movie?.original_title}</p>
            <p>Gêneros: {movie?.genres}</p>
            <p>Data de Lançamento: {movie?.release_data}</p>
            <div className={styles.buttons}>
              <button type='button' onClick={addList} className={classnames({
                [styles.addList]: !movie?.inList, 
                [styles.toWatch]: movie?.inList === 'plan to watch',
                [styles.watched]: movie?.inList === 'watched'
              })}>
              </button>
              {(() => {
                if(movie?.inList){
                  return <button type='button' onClick={removeMovie}>Remover da Lista</button>
                }
              })()}
            </div>
          </div>
        </div>
        <div className={styles.sinopse}>
          <h2>Sinopse</h2>
          <p>{movie?.overview}</p>
        </div>
      </div>
    </Layout>
  )
}