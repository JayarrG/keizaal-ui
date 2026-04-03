import styles from './Checkbox.module.css';

interface CheckboxProps {
  className?: string;
  checked: boolean;
  label?: string;
  locked?: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox({ className = '', checked, label, locked = false, onChange }: CheckboxProps) {
  return (
    <label className={[styles.checkbox, locked ? styles.locked : '', className].filter(Boolean).join(' ')} onClick={() => !locked && onChange(!checked)}>
      <div className={[styles.box, checked ? styles.checked : ''].join(' ')}>
        {checked && <span className={styles.check}>{'\u2713'}</span>}
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
