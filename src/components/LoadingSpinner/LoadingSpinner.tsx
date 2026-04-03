import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export default function LoadingSpinner({ className = '', size = 48 }: LoadingSpinnerProps) {
  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
    >
      {/* outer ring — slow spin */}
      <div className={styles.outerRing} />
      {/* inner ring — counter spin */}
      <div className={styles.innerRing} />
      {/* center diamond */}
      <div className={styles.center}>
        <div className={styles.diamond} />
      </div>
    </div>
  );
}
