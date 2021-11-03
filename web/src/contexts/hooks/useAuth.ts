import { useEffect, useState } from 'react';

import api from '../../services/api';

export default function useAuth(){
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token){
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  function handleLogin(token: JSON){
    localStorage.setItem('token', JSON.stringify(token));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setAuthenticated(true);

    api.get('profiles/1')
    .then(res => {
      const profile = {
        id: res.data.id,
        selectedProfile: 1,
        profileName: res.data.name
      }

      localStorage.setItem('profile', JSON.stringify(profile));
    })
    .catch(err => {
      if(!err.response) console.error("Impossível conectar ao servidor!");
      else console.error(err.response.data);
    });
  }

  function handleLogout(){
    setAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    api.defaults.headers.Authorization = undefined;
    window.location.href = "/";
  }
  
  return {authenticated, loading, handleLogin, handleLogout}

}