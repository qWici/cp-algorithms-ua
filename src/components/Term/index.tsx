import React from 'react';
import styles from './styles.module.css';

type Props = {
  /** Просте пояснення В КОНТЕКСТІ фрази (без формул — звичайний текст) */
  tip: string;
  /** Слово або фраза, яку пояснюємо */
  children: React.ReactNode;
};

// Підказка для незрозумілого терміна: пунктирне підкреслення,
// пояснення з'являється при наведенні (або фокусі з клавіатури / тапі).
export default function Term({tip, children}: Props): React.ReactNode {
  return (
    <span className={styles.term} tabIndex={0} data-tip={tip}>
      {children}
    </span>
  );
}
