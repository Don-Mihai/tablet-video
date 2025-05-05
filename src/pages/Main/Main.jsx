import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Main.module.css';
import Preview from '../Preview/Preview';

export default function Main() {
  const [isWaiting, setIsWaiting] = useState(true);
  const videoRef = useRef(null);

  console.log('__dirname', __dirname);

  useEffect(() => {
    // Периодический запрос для получения события от другого сайта
    const checkEvent = async () => {
      try {
        const response = await axios.get(
          '192.168.0.10:2424/cmd.cgi?user=admin&psw=Jerome&cmd=GET,KE,10'
        ); // API для получения события
        if (response.data === 'KE,10,1') {
          setIsWaiting(false);
        }
      } catch (error) {
        console.error('Ошибка получения события:', error);
      }
    };

    const intervalId = setInterval(checkEvent, 2000); // проверяем событие каждые 2 секунды

    return () => clearInterval(intervalId); // Очищаем интервал при размонтировании компонента
  }, []);

  useEffect(() => {
    // Когда видео начинает отображаться, начинаем его воспроизведение
    if (!isWaiting && videoRef.current) {
      videoRef.current.play();
    }
  }, [isWaiting]);

  const handleVideoEnd = () => {
    setIsWaiting(true);
  };

  return (
    <>
      {isWaiting ? (
        <Preview />
      ) : (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            controls
            autoPlay
            onEnded={handleVideoEnd}
          >
            <source src="/videos/video.mp4" type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        </div>
      )}
    </>
  );
}
