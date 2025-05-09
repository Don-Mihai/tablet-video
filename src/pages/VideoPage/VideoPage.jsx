import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './VideoPage.module.css'; // Импортируем CSS-модуль
import Bottom from '../../components/Bottom/Bottom';

export default function VideoPage() {
  const { videoId } = useParams();

  return (
    <div className={styles.container}>
      <video className={styles.video} controls autoPlay>
        <source src={`/videos/video${videoId}.mp4`} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      <br />
      <Bottom backUrl={`/`} />
    </div>
  );
}
