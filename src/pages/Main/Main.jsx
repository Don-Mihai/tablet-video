import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Main.module.css';
import Preview from '../Preview/Preview';

export default function Main() {
  // bit1On == true  → показываем первое видео
  // bit2On == true  → показываем второе видео
  // оба бита == false → показываем превью
  const [bit1On, setBit1On] = useState(false);
  const [bit2On, setBit2On] = useState(false);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  // 1) Периодически опрашиваем XML и обновляем состояния обоих битов
  useEffect(() => {
    const checkEvent = async () => {
      try {
        const { data: xmlString } = await axios.get(
          'http://192.168.0.10/state.xml',
          {
            responseType: 'text',
          }
        );
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'application/xml');
        const node = xml.getElementsByTagName('iovalue')[0];
        if (!node) {
          console.warn('<iovalue> не найден');
          return;
        }
        const str = node.textContent?.trim() ?? '';
        // 10‑й символ (индекс 9) — первый бит
        const isFirstOn = str.charAt(9) === '1';
        // 11‑й символ (индекс 10) — второй бит
        const isSecondOn = str.charAt(10) === '1';
        setBit1On(isFirstOn);
        setBit2On(isSecondOn);
      } catch (e) {
        console.error('Ошибка получения/parsing XML:', e);
      }
    };

    const interval = setInterval(checkEvent, 2000);
    return () => clearInterval(interval);
  }, []);

  // 2a) Управление первым видео
  useEffect(() => {
    if (bit1On && videoRef1.current) {
      videoRef1.current
        .play()
        .catch((e) => console.warn('Не удалось запустить видео 1:', e));
    } else if (!bit1On && videoRef1.current) {
      videoRef1.current.pause();
      videoRef1.current.currentTime = 0;
    }
  }, [bit1On]);

  // 2b) Управление вторым видео
  useEffect(() => {
    if (bit2On && videoRef2.current) {
      videoRef2.current
        .play()
        .catch((e) => console.warn('Не удалось запустить видео 2:', e));
    } else if (!bit2On && videoRef2.current) {
      videoRef2.current.pause();
      videoRef2.current.currentTime = 0;
    }
  }, [bit2On]);

  // 3a) Завершение первого видео
  const handleEnded1 = async () => {
    try {
      await axios.get('http://192.168.0.10/cmd.cgi?cmd=OUT,10,0', {
        headers: { 'Content-Type': 'text/plain' },
      });
    } catch (e) {
      console.error('Не удалось выключить бит 10 на устройстве:', e);
    }
    setBit1On(false);
  };

  // 3b) Завершение второго видео
  const handleEnded2 = async () => {
    try {
      await axios.get('http://192.168.0.10/cmd.cgi?cmd=OUT,11,0', {
        headers: { 'Content-Type': 'text/plain' },
      });
    } catch (e) {
      console.error('Не удалось выключить бит 11 на устройстве:', e);
    }
    setBit2On(false);
  };

  return (
    <>
      {bit2On ? (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef2}
            className={styles.video}
            onEnded={handleEnded2}
          >
            <source src="/videos/video2.mp4" type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        </div>
      ) : bit1On ? (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef1}
            className={styles.video}
            onEnded={handleEnded1}
          >
            <source src="/videos/video1.mp4" type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        </div>
      ) : (
        <Preview />
      )}
    </>
  );
}
