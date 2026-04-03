import styles from './StatLine.module.css';

interface StatLineProps {
  className?: string;
  label: string;
  value: string | number;
}

export default function StatLine({ className = '', label, value }: StatLineProps) {
  return (
    <div className={[styles.stat, className].filter(Boolean).join(' ')}>
      <span className={styles.label}>{label}</span>
      <span className={styles.dots} />
      <span className={styles.value}>{value}</span>
    </div>
  );
}
