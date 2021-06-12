import React from 'react';
import classnames from 'classnames';
import { AlertComponentPropsWithStyle } from 'react-alert';

import styles from '../styles/components/Alert.module.css';

export default function Alert(
  { message, options, style, close}: AlertComponentPropsWithStyle
){
  return(
    <div className={styles.alertsContainer} >
      <div className={classnames(styles.alert, {
        [styles.success]: options.type === 'success',
        [styles.error]: options.type === 'error',
        [styles.info]: options.type === 'info'
      })}>
        <div className={styles.alertHeader}>
          <h1>Alerta</h1>
          <button onClick={close}>
            <span>&times;</span>
          </button>
        </div>
        <div className={styles.alertContent}>
          <p>{message}</p>
        </div>
      </div>
    </div>
  )
}