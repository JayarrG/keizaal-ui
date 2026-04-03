import type { ReactNode } from 'react';
import styles from './Button.module.css';
import { hexToHslVars } from '../../utils/color';

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  variant?: 'cube' | 'circle' | 'diamond' | 'text';
  size?: number;
  accent?: string;
  active?: boolean;
  disabled?: boolean;
  locked?: boolean;
  /** Cut corners at 45deg. Number = all corners, or per-corner object. */
  notch?: number | { tl?: number; tr?: number; bl?: number; br?: number };
  onClick?: () => void;
}

function buildNotchClip(notch: ButtonProps['notch']): string | undefined {
  if (!notch) return undefined;
  const n = typeof notch === 'number'
    ? { tl: notch, tr: notch, bl: notch, br: notch }
    : { tl: 0, tr: 0, bl: 0, br: 0, ...notch };

  const pts: string[] = [];
  // top-left
  pts.push(n.tl ? `${n.tl}px 0` : '0 0');
  // top-right
  if (n.tr) { pts.push(`calc(100% - ${n.tr}px) 0`, `100% ${n.tr}px`); }
  else { pts.push('100% 0'); }
  // bottom-right
  if (n.br) { pts.push(`100% calc(100% - ${n.br}px)`, `calc(100% - ${n.br}px) 100%`); }
  else { pts.push('100% 100%'); }
  // bottom-left
  if (n.bl) { pts.push(`${n.bl}px 100%`, `0 calc(100% - ${n.bl}px)`); }
  else { pts.push('0 100%'); }
  // close top-left
  if (n.tl) { pts.push(`0 ${n.tl}px`); }

  return `polygon(${pts.join(', ')})`;
}

export default function Button({
  children,
  className = '',
  variant = 'cube',
  size,
  accent,
  active = false,
  disabled = false,
  locked = false,
  notch,
  onClick,
}: ButtonProps) {
  const clipPath = buildNotchClip(notch);

  const inlineStyle: React.CSSProperties = {
    ...(size && variant !== 'text' ? { '--btn-size': `${size}px` } as React.CSSProperties : {}),
    ...(accent ? hexToHslVars(accent) : {}),
  };

  if (!clipPath) {
    return (
      <button
        className={[
          styles.btn,
          styles[variant],
          active ? styles.active : '',
          disabled ? styles.disabled : '',
          locked ? styles.locked : '',
          className,
        ].filter(Boolean).join(' ')}
        style={inlineStyle}
        onClick={onClick}
        disabled={disabled || locked}
      >
        <span className={styles.inner}>{children}</span>
      </button>
    );
  }

  // Notched button — use wrapper for border effect
  return (
    <div
      className={[
        styles.notchedWrap,
        active ? styles.notchedActive : '',
        disabled ? styles.disabled : '',
        locked ? styles.locked : '',
      ].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      <div className={styles.notchedBorderOuter} style={{ clipPath }} />
      <div className={styles.notchedGap} style={{ clipPath }} />
      <div className={styles.notchedBorderInner} style={{ clipPath }} />
      <button
        className={[
          styles.btn,
          styles[variant],
          styles.notched,
          active ? styles.active : '',
          className,
        ].filter(Boolean).join(' ')}
        style={{ ...inlineStyle, clipPath }}
        onClick={onClick}
        disabled={disabled || locked}
      >
        <span className={styles.inner}>{children}</span>
      </button>
    </div>
  );
}
