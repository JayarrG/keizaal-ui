import styles from './Divider.module.css';

interface DividerProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  ornament?: boolean;
}

export default function Divider({ className = '', direction = 'horizontal', ornament = false }: DividerProps) {
  return (
    <div className={[styles.divider, styles[direction], ornament ? styles.ornament : '', className].filter(Boolean).join(' ')}>
      {ornament && direction === 'horizontal' && (
        <>
          <span className={styles.line} />
          <span className={styles.diamond}>{'\u25C7'}</span>
          <span className={styles.line} />
        </>
      )}
    </div>
  );
}
