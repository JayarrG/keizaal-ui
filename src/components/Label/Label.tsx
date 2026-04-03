import type { ReactNode } from 'react';
import styles from './Label.module.css';

interface LabelProps {
  children: ReactNode;
  className?: string;
  size?: 'caption' | 'body' | 'heading' | 'title';
  color?: 'default' | 'dim' | 'bright' | 'accent';
  uppercase?: boolean;
}

export default function Label({
  children, className = '', size = 'body', color = 'default', uppercase = false,
}: LabelProps) {
  return (
    <span className={[
      styles.label,
      styles[`size_${size}`],
      styles[`color_${color}`],
      uppercase ? styles.upper : '',
      className,
    ].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
