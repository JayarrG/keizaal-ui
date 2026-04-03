import { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

interface DropdownOption {
  id: string;
  label: string;
}

interface DropdownProps {
  className?: string;
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  label?: string;
  onChange: (id: string) => void;
}

export default function Dropdown({
  className = '', options, value, placeholder = 'Select...', label, onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={[styles.dropdown, className].filter(Boolean).join(' ')}>
      {label && <span className={styles.label}>{label}</span>}
      <button className={[styles.trigger, open ? styles.open : ''].join(' ')} onClick={() => setOpen(!open)}>
        <span className={selected ? styles.selectedText : styles.placeholder}>
          {selected?.label ?? placeholder}
        </span>
        <span className={styles.arrow}>{'\u25BE'}</span>
      </button>
      {open && (
        <ul className={styles.menu}>
          {options.map((opt) => (
            <li key={opt.id}>
              <button
                className={[styles.option, opt.id === value ? styles.optionActive : ''].join(' ')}
                onClick={() => { onChange(opt.id); setOpen(false); }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
