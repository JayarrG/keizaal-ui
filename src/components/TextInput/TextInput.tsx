import styles from './TextInput.module.css';

interface TextInputProps {
  className?: string;
  value: string;
  placeholder?: string;
  label?: string;
  error?: string;
  locked?: boolean;
  onChange: (value: string) => void;
}

export default function TextInput({
  className = '', value, placeholder, label, error, locked = false, onChange,
}: TextInputProps) {
  return (
    <div className={[styles.wrapper, error ? styles.hasError : '', locked ? styles.locked : '', className].filter(Boolean).join(' ')}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={locked}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
