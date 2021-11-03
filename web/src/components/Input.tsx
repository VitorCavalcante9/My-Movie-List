import {InputHTMLAttributes} from 'react';

import styles from '../styles/components/Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  placeholder: string;
  inputRef?: any;
}

export function Input({placeholder, inputRef, ...rest}: InputProps){
  return(
    <div className={styles.inputBlock}>
      <input placeholder={placeholder} {...rest} ref={inputRef} />
    </div>
  );
}