import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import api from '../services/api';

import styles from '../styles/pages/Login.module.css';
import { useHistory } from 'react-router';

import { AuthContext } from '../contexts/AuthContext';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { InputLabel } from '../components/InputLabel';

export function Login(){
  const { handleLogin } = useContext(AuthContext);
  const [isRegistered, setIsRegistered] = useState(true);
  const { register, handleSubmit, reset, errors } = useForm();
  const history = useHistory();
  const alert = useAlert();

  useEffect(()=> {
    if(errors.name) alert.error("Insira um nome")
    else if(errors.email) alert.error("Insira um email")
    else if(errors.password) alert.error("Insira uma senha")
  }, [errors, alert])

  const onLogin = async(data: any) =>{
    api.post('auth', data).then((response) => {
      const { data: { token } } = response;
      handleLogin(token);
      history.push('/home');
    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }

  const onRegister = async(data: any) =>{
    await api.post('users', data).then(() => {
      const login = {
        email: data.email,
        password: data.password
      }
  
      api.post('auth', login).then((response) => {
        const { data: { token } } = response;
        handleLogin(token);
        history.push('/home');
      }).catch(err => {
        if(!err.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(err.response.data.message);
      });
      
    })
    .catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(err.response.data.message);
    })
  }

  const toggleForm = () =>{
    const new_value = isRegistered ? false : true;
    setIsRegistered(new_value);
    reset({something: ''});
  }
  
  return(
    <div className={styles.pageContainer}>
      <div className={styles.startContainer}>
        <div className={styles.logoContainer}>
          <h1>My Movie List</h1>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.registerContainer}>
          {isRegistered ? (
            <>
            <h2>Login</h2>

            <form onSubmit={handleSubmit(onLogin)}>
              <Input
                name="email"
                type="email"
                placeholder="Insira seu email"
                maxLength={50}
                inputRef={register({required: true})}
              />
              <Input
                name="password"
                type="password"
                placeholder="Insira sua senha"
                maxLength={50}
                inputRef={register({required: true})}
                style={{marginBottom: '5rem'}}
              />

              <Button type="submit" text="Entrar" />
              <hr/>

              <p onClick={toggleForm}>Não tenho conta. Fazer cadastro</p>

            </form>
            </>
          ) : (
            <>
            <h2>Register</h2>

            <form onSubmit={handleSubmit(onRegister)}>
              <InputLabel
                name="name"
                type="text"
                label="Insira seu nome"
                maxLength={50}
                inputRef={register({required: true})}
                style={{marginBottom: '0rem'}}
              />
              <InputLabel
                name="email"
                type="email"
                label="Insira seu email"
                maxLength={50}
                inputRef={register({required: true})}
              />
              <InputLabel
                name="password"
                type="password"
                label="Insira sua senha"
                maxLength={50}
                inputRef={register({required: true})}
                style={{marginBottom: '0rem'}}
              />
              <InputLabel
                name="birthDate"
                label="Insira sua data de nascimento"
                type="date"
                inputRef={register({required: true})}
                style={{marginBottom: '5rem'}}
              />

              <Button type="submit" text="Registrar" />
              
              <hr/>

              <p onClick={toggleForm}>Já tenho conta. Fazer login</p>

            </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}