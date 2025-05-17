import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Main.module.css';
import Preview from '../Preview/Preview';

export default function Main() {
  const [bit1On, setBit1On] = useState(false);
  const [bit2On, setBit2On] = useState(false);
  const [bit3On, setBit3On] = useState(false);
  const [bit4On, setBit4On] = useState(false);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const videoRef4 = useRef(null);

  // 1) Периодически опрашиваем XML и обновляем состояния обоих битов
  useEffect(() => {
    const checkEvent = async () => {
      try {
        const { data: xmlString } = await axios.get('http://192.168.0.10/state.xml', {
          responseType: 'text',
        });
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
        // 12‑й символ (индекс 11) — третий бит
        const isThirdOn = str.charAt(11) === '1';
        // 13‑й символ (индекс 12) — четвертый бит
        const isFourthOn = str.charAt(12) === '1';

        setBit1On(isFirstOn);
        setBit2On(isSecondOn);
        setBit3On(isThirdOn);
        setBit4On(isFourthOn);
      } catch (e) {
        console.error('Ошибка получения/parsing XML:', e);
      }
    };

    const interval = setInterval(checkEvent, 2000);
    return () => clearInterval(interval);
  }, []);

  // 1) Управление первым видео
  useEffect(() => {
    const vid = videoRef1.current;
    if (!vid) return;
    if (bit1On) {
      vid.muted = false;
      vid.style.display = 'block';
      vid.play().catch(console.warn);
    } else {
      vid.pause();
      vid.currentTime = 0;
      vid.muted = true;
      vid.style.display = 'none';
    }
  }, [bit1On]);

  // 2) Управление вторым видео
  useEffect(() => {
    const vid = videoRef2.current;
    if (!vid) return;
    if (bit2On) {
      vid.muted = false;
      vid.style.display = 'block';
      vid.play().catch(console.warn);
    } else {
      vid.pause();
      vid.currentTime = 0;
      vid.muted = true;
      vid.style.display = 'none';
    }
  }, [bit2On]);

  useEffect(() => {
    const vid = videoRef3.current;
    if (!vid) return;
    if (bit3On) {
      vid.muted = false;
      vid.style.display = 'block';
      vid.play().catch(console.warn);
    } else {
      vid.pause();
      vid.currentTime = 0;
      vid.muted = true;
      vid.style.display = 'none';
    }
  }, [bit3On]);

  useEffect(() => {
    const vid = videoRef4.current;
    if (!vid) return;
    if (bit4On) {
      vid.muted = false;
      vid.style.display = 'block';
      vid.play().catch(console.warn);
    } else {
      vid.pause();
      vid.currentTime = 0;
      vid.muted = true;
      vid.style.display = 'none';
    }
  }, [bit4On]);

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
      <video ref={videoRef1} className={styles.video} onEnded={handleEnded1} style={{ display: 'none' }} muted>
        <source src="/videos/video1.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      <video ref={videoRef2} className={styles.video} onEnded={handleEnded2} style={{ display: 'none' }} muted>
        <source src="/videos/video2.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      <video ref={videoRef3} className={styles.video} style={{ display: 'none' }} loop muted>
        <source src="/videos/video1.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      <video ref={videoRef4} className={styles.video} style={{ display: 'none' }} loop muted>
        <source src="/videos/video2.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      {/* Плейсхолдер, когда ничего не воспроизводится */}
      {!bit1On && !bit2On && !bit3On && !bit4On && <Preview />}
    </>
  );
}
