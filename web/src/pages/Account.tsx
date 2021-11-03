/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';

import api from '../services/api';

import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

import styles from '../styles/pages/Account.module.css';

import edit from '../assets/icons/edit.svg';
import trash from '../assets/icons/trash.svg';

interface User {
  id: string,
  name: string,
  email: string,
  birthDate: string
}

interface Profile {
  id: string,
  name: string,
  user_id: string,
  number: number
}

export function Account(){
  const alert = useAlert();

  const [user, setUser] = useState<User>();
  const [profiles, setProfiles] = useState<Profile[]>();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<number>(0);

  const [name, setName] = useState('');

  useEffect(() => {
    api.get('users').then(res => {
      setUser(res.data);
    }).catch(err => console.log(err.response.data));

    api.get('profiles').then(res => {
      setProfiles(res.data);
    }).catch(err => console.log(err.response.data));

  }, [window.location, openAddModal, openDeleteModal, openEditModal])

  const addProfile = async() => {
    api.post(`profiles`, { name }).then(res => {
      setOpenAddModal(false);
      setName('');
    }).catch(err => alert.error(err.response.data.message));
  }

  const editProfile = async() => {
    api.put(`profiles/${selectedProfile}`, { name }).then(() => {
      setOpenEditModal(false);
      setName('');
      setSelectedProfile(0);
    }).catch(err => console.log(err.response.data));
  }

  async function deleteProfile(){
    api.delete(`profiles/${selectedProfile}`).then(() => {
      setOpenDeleteModal(false);
      setSelectedProfile(0);
    }).catch(err => alert.error(err.response.data.message))
  }

  function changeProfile(numberProfile: number){
    api.get(`profiles/${numberProfile}`).then(res => {
      const { id, name: profileName} = res.data;
      const profile = localStorage.getItem('profile');

      if(profile){
        const profileData = {
          id,
          selectedProfile: numberProfile,
          profileName
        }
  
        localStorage.setItem('profile', JSON.stringify(profileData));
      }
    }).catch(err => alert.error(err.response.data.message))
  }

  return(
    <>
    {/* The Delete Modal */}
    <div className={styles.modal} style={{display: openDeleteModal ? 'block' : 'none'}}>
      <div className={styles.modalContent}>
        <h2>Deletar Perfil</h2>

        <p>Você tem certeza que quer deletar este perfil?</p>

        <div className={styles.buttons}>
          <button type='button' onClick={() => {setOpenDeleteModal(false)}}>Cancelar</button>
          <button type='button' onClick={() => deleteProfile()}>Deletar</button>
        </div>
      </div>
    </div>

    {/* The Add Modal */}
    <div className={styles.modal} style={{display: openAddModal ? 'block' : 'none'}}>
      <div className={styles.modalContent}>
        <h2>Adicionar Perfil</h2>

        <form>
          <Input 
            name='name' 
            type='text'
            value={name}
            placeholder='Insira o nome do perfil'
            onChange={e => setName(e.target.value)} 
          />

          <button type='button' onClick={addProfile}>Adicionar</button>
        </form>

        <div className={styles.buttons}>
          <button type='button' onClick={() => {setName(''); setOpenAddModal(false)}}>Cancelar</button>
        </div>
      </div>
    </div>

    {/* The Edit Modal */}
    <div className={styles.modal} style={{display: openEditModal ? 'block' : 'none'}}>
      <div className={styles.modalContent}>
        <h2>Editar Perfil</h2>

        <form>
          <Input 
            name='name' 
            type='text'
            value={name}
            placeholder='Insira o nome do perfil' 
            onChange={e => setName(e.target.value)}
          />

          <button type='button' onClick={editProfile}>Salvar</button>
        </form>

        <div className={styles.buttons}>
          <button type='button' onClick={() => {setOpenEditModal(false)}}>Cancelar</button>
        </div>
      </div>
    </div>

    <Layout>
      <div className={styles.content}>
        <h1>Conta</h1>

        <div className={styles.info}>
          <p><b>Nome:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
          <p><b>Data de Nascimento:</b> {user?.birthDate}</p>
        </div>

        <div className={styles.profiles}>
          <h2>Perfis</h2>

          <div className={styles.profilesList}>
            {profiles?.map(profile => {
              return(
                <div key={profile.number} className={styles.profileItem}>
                  <p>{profile.name}</p>
                  <div className={styles.options}>
                    <button type='button' onClick={() => { setName(profile.name); setSelectedProfile(profile.number); setOpenEditModal(true) }}>
                      <img src={edit} alt="Editar Perfil"/>
                    </button>

                    <button type='button' onClick={() => { setSelectedProfile(profile.number); setOpenDeleteModal(true) }}>
                      <img src={trash} alt="Excluir Perfil"/>
                    </button>

                    <button type='button' onClick={() => changeProfile(profile.number)} className={styles.selectButton}>
                      Selecionar
                    </button>
                  </div>
                </div>
              )
            })}

            <Button 
              className={styles.addProfile} 
              disabled={profiles?.length === 4 ? true : false} 
              text='Adicionar'
              onClick={() => setOpenAddModal(true)}
            />
          </div>
        </div>
      </div>
    </Layout>
    </>
  )
}