import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Main.module.css';
import Preview from '../Preview/Preview';

export default function Main() {
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    // Периодический запрос для получения события от другого сайта
    const checkEvent = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/event'); // API для получения события
        if (response.data.event === 'start-video') {
          setIsWaiting(false);
        }
      } catch (error) {
        console.error('Ошибка получения события:', error);
      }
    };

    const intervalId = setInterval(checkEvent, 2000); // проверяем событие каждые 2 секунды

    return () => clearInterval(intervalId); // Очищаем интервал при размонтировании компонента
  }, []);

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
