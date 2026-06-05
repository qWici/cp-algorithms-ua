import React from 'react';
import styles from './styles.module.css';

type Props = {
  /** ID відео на YouTube (частина після watch?v=) */
  id: string;
  /** Назва відео — для атрибута title (доступність) */
  title: string;
};

// Вбудований YouTube-плеєр: адаптивний 16:9, лінива загрузка,
// домен youtube-nocookie.com не ставить куки до початку відтворення.
export default function YouTubeEmbed({id, title}: Props): React.ReactNode {
  return (
    <div className={styles.wrapper}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
