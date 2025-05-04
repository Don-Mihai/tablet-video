import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Preview.module.css';

export default function Preview() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/main');
  };

  return (
    <div
      className={styles.container}
      onClick={handleClick}
      // onTouchStart={handleClick}
    >
      <video
        className={styles.video}
        src="/path/to/your/video.mp4" // укажите путь к вашему видео
        autoPlay
        loop
        muted
        playsInline
      />

      <div className={styles.overlay}>
        {/* <div className={styles.top}>
          <img src="/images/elipse.png" alt="Логотип" />
          <h1 className={styles.title}>
            Современное <br /> вооружение
          </h1>
          <img src="/images/elipse.png" alt="Логотип" />
        </div> */}

        <p className={styles.subtitle}>
          Коснитесь экрана, <br /> чтобы узнать подробнее
        </p>
      </div>
    </div>
  );
}
