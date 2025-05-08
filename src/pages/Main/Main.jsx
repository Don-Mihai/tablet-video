import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Main.module.css';
import Preview from '../Preview/Preview';

export default function Main() {
  // bitOn == true  → показываем видео
  // bitOn == false → показываем превью
  const [bitOn, setBitOn] = useState(false);
  const videoRef = useRef(null);

  // 1) Периодически опрашиваем XML и обновляем bitOn
  useEffect(() => {
    const checkEvent = async () => {
      try {
        const { data: xmlString } = await axios.get(
          'http://192.168.0.10/cmd.cgi?cmd=GET,OUT,10',
          { responseType: 'text' }
        );
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'application/xml');
        const node = xml.getElementsByTagName('iovalue')[0];
        if (!node) {
          console.warn('<iovalue> не найден');
          return;
        }
        const str = node.textContent?.trim() ?? '';
        // 10‑й символ: индекс 9
        const isOn = str.charAt(9) === '1';
        setBitOn(isOn);
      } catch (e) {
        console.error('Ошибка получения/parsing XML:', e);
      }
    };

    const interval = setInterval(checkEvent, 2000);
    return () => clearInterval(interval);
  }, []); // пустой массив, т. к. сам эффект следит за внешним API

  // 2) Как только бит включился — запускаем проигрывание
  useEffect(() => {
    if (bitOn && videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.warn('Не удалось запустить видео:', e);
      });
    }
    // если бит выключился, а видео всё ещё есть — остановим и сбросим
    if (!bitOn && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [bitOn]);

  // 3) Когда видео доиграет — отправляем команду выключить бит и сразу сбрасываем UI
  const handleEnded = async () => {
    try {
      await axios.get('http://192.168.0.10/cmd.cgi?cmd=OUT,10,0', {
        headers: { 'Content-Type': 'text/plain' },
      });
    } catch (e) {
      console.error('Не удалось выключить бит на устройстве:', e);
    }
    // локально сразу переключим на превью
    setBitOn(false);
  };

  return (
    <>
      {bitOn ? (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            controls
            onEnded={handleEnded}
          >
            <source src="/videos/video.mp4" type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        </div>
      ) : (
        <Preview />
      )}
    </>
  );
}
