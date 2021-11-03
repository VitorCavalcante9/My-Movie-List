/* eslint-disable react-hooks/exhaustive-deps */
import React, { HTMLAttributes, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { AuthContext } from '../contexts/AuthContext';

import styles from '../styles/components/Layout.module.css';

import home from '../assets/icons/home.svg';
import user from '../assets/icons/user.svg';
import settings from '../assets/icons/settings.svg';

interface LayoutProps extends HTMLAttributes<HTMLDivElement>{}

export function Layout({children}:LayoutProps){
  const { handleLogout } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('profile');

    if(profile){
      const profileData = JSON.parse(profile);
      setName(profileData.profileName);
    }
  }, [window.location]);

  return(
    <>
    {/* The Delete Modal */}
    <div className={styles.modal} style={{display: openLogoutModal ? 'block' : 'none'}}>
      <div className={styles.modalContent}>
        <h2>Logout</h2>

        <p>Deseja sair da conta?</p>

        <div className={styles.buttons}>
          <button type='button' onClick={() => {setOpenLogoutModal(false)}}>Cancelar</button>
          <button type='button' onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </div>
    
    <div className={styles.pageContainer}>
      <div className={styles.sideBar}>
        <h2>Perfil: {name}</h2>

        <div className={styles.menu}>
          <div className={styles.icon}>
            <Link to='/account'>
              <img src={user} alt="Conta" />
              <p>Conta</p>
            </Link>
          </div>  
          <div className={styles.icon}>
            <Link to="/home">
              <img className={styles.home} src={home} alt="Home" />
              <p>Home</p>
            </Link>
          </div> 
          <div className={styles.icon}>
            <Link to='#' onClick={() => setOpenLogoutModal(true)}>
              <img src={settings} alt="Configurações" />
              <p>Conta</p>
            </Link>
          </div>
        </div>

      </div>
      <div className={styles.mainBlockContainer}>
        {children}
      </div>
    </div>
    </>
  );
}