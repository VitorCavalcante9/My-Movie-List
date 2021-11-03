import {ButtonHTMLAttributes} from 'react';

import styles from '../styles/components/Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  text: string;
}

export function Button({
  text,
  className,
  ...rest}: ButtonProps){
  return(
    <div className={`${styles.buttonBlock} ${className}`}>
      <button {...rest}>{text}</button>
    </div>
  );
}