import styles from './Toggle.module.css';

interface ToggleProps {
  className?: string;
  checked: boolean;
  label?: string;
  locked?: boolean;
  onChange: (checked: boolean) => void;
}

export default function Toggle({ className = '', checked, label, locked = false, onChange }: ToggleProps) {
  return (
    <label className={[styles.toggle, locked ? styles.locked : '', className].filter(Boolean).join(' ')}>
      <div className={[styles.track, checked ? styles.on : ''].join(' ')} onClick={() => !locked && onChange(!checked)}>
        <div className={styles.thumb} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
