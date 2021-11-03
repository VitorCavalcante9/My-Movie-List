import { InputHTMLAttributes } from 'react';

import styles from '../styles/components/InputLabel.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  name: string;
  label: string;
  inputRef?: any;
}

export function InputLabel({name, className, label, inputRef, ...rest}:InputProps){
  return(
    <div className={`${styles.inputBlock} ${className}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...rest} ref={inputRef}/>
    </div>
  );
}