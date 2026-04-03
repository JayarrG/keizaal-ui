import styles from './ProgressBar.module.css';
import { hexToHslVars } from '../../utils/color';

interface ProgressBarProps {
  className?: string;
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  accent?: string;
}

export default function ProgressBar({
  className = '', value, max = 100, label, showValue = false, accent,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div
      className={[styles.bar, className].filter(Boolean).join(' ')}
      style={{
        ...(accent ? hexToHslVars(accent) : {}),
        '--color-accent': accent ? undefined : 'hsl(var(--accent-h), var(--accent-s), var(--accent-l))',
        '--color-accent-dim': accent ? undefined : 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) - 15%))',
        '--color-accent-bright': accent ? undefined : 'hsl(var(--accent-h), var(--accent-s), calc(var(--accent-l) + 12%))',
      } as React.CSSProperties}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.track}>
        {/* cap left */}
        <div className={styles.capLeft} />
        {/* fill */}
        <div className={styles.fill} style={{ width: `${pct}%` }}>
          <div className={styles.fillShine} />
        </div>
        {/* cap right */}
        <div className={styles.capRight} />
      </div>
      {showValue && <span className={styles.value}>{value} / {max}</span>}
    </div>
  );
}
