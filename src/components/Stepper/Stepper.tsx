import styles from './Stepper.module.css';

interface StepperProps {
  className?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onChange: (value: number) => void;
}

export default function Stepper({
  className = '', value, min = 0, max = 99, step = 1, label, onChange,
}: StepperProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div className={[styles.stepper, className].filter(Boolean).join(' ')}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.controls}>
        <button className={styles.btn} onClick={dec} disabled={value <= min}>&minus;</button>
        <span className={styles.value}>{value}</span>
        <button className={styles.btn} onClick={inc} disabled={value >= max}>+</button>
      </div>
    </div>
  );
}
