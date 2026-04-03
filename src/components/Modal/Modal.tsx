import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Modal.module.css';
import { hexToHslVars } from '../../utils/color';
import cornerTL from '../../assets/corners/corner_tl.png';
import cornerTR from '../../assets/corners/corner_tr.png';
import cornerBL from '../../assets/corners/corner_bl.png';
import cornerBR from '../../assets/corners/corner_br.png';

const cornerSrcs = [
  { src: cornerTL, cls: 'tl' },
  { src: cornerTR, cls: 'tr' },
  { src: cornerBL, cls: 'bl' },
  { src: cornerBR, cls: 'br' },
] as const;

interface ModalProps {
  children: ReactNode;
  className?: string;
  open: boolean;
  accent?: string;
  onClose?: () => void;
}

export default function Modal({ children, className = '', open, accent, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !onClose) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className={`${styles.backdrop} ${visible ? styles.backdropVisible : ''}`} onClick={onClose}>
      <div
        className={[styles.modal, visible ? styles.modalVisible : '', className].filter(Boolean).join(' ')}
        style={accent ? hexToHslVars(accent) : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {cornerSrcs.map(({ src, cls }) => (
          <div
            key={cls}
            className={`${styles.corner} ${styles[cls]}`}
            style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
          />
        ))}
        <div className={styles.topAccent} />
        {onClose && (
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
