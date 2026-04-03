import { useEffect, useState } from 'react';
import styles from './ConfirmDialog.module.css';
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

interface ConfirmDialogProps {
  className?: string;
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  className = '', open, title = 'Confirm', message,
  confirmText = 'Yes', cancelText = 'No',
  onConfirm, onCancel,
}: ConfirmDialogProps) {
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

  if (!mounted) return null;

  return (
    <div className={`${styles.backdrop} ${visible ? styles.backdropVisible : ''}`} onClick={onCancel}>
      <div className={[styles.dialog, visible ? styles.dialogVisible : '', className].filter(Boolean).join(' ')} onClick={(e) => e.stopPropagation()}>
        {cornerSrcs.map(({ src, cls }) => (
          <div
            key={cls}
            className={`${styles.corner} ${styles[cls]}`}
            style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
          />
        ))}
        <div className={styles.topAccent} />
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <button className={styles.cancel} onClick={onCancel}>{cancelText}</button>
            <button className={styles.confirm} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
