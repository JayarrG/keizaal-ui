import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Notification.module.css';

interface Toast {
  id: number;
  text: string;
  icon?: string;
  count: number;
  exiting?: boolean;
}

let nextId = 0;

export function useNotifications(duration = 4000) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const startExit = useCallback((id: number) => {
    // mark as exiting, then remove after animation
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timersRef.current.delete(id);
    }, 300);
  }, []);

  const resetTimer = useCallback((id: number) => {
    const existing = timersRef.current.get(id);
    if (existing) clearTimeout(existing);
    // also un-exit if it was exiting
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: false } : t));
    const timer = setTimeout(() => startExit(id), duration);
    timersRef.current.set(id, timer);
  }, [duration, startExit]);

  const push = useCallback((text: string, icon?: string) => {
    setToasts((prev) => {
      const existing = prev.find(t => t.text === text && t.icon === icon);
      if (existing) {
        resetTimer(existing.id);
        return prev.map(t => t.id === existing.id ? { ...t, count: t.count + 1, exiting: false } : t);
      }
      const id = nextId++;
      resetTimer(id);
      return [...prev, { id, text, icon, count: 1 }];
    });
  }, [resetTimer]);

  return { toasts, push };
}

interface NotificationStackProps {
  className?: string;
  toasts: Toast[];
}

export default function NotificationStack({ className = '', toasts }: NotificationStackProps) {
  return (
    <div className={[styles.stack, className].filter(Boolean).join(' ')}>
      {toasts.map((toast, i) => (
        <ToastItem key={toast.id} toast={toast} index={i} />
      ))}
    </div>
  );
}

function ToastItem({ toast, index }: { toast: Toast; index: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const isVisible = visible && !toast.exiting;

  return (
    <div
      className={`${styles.toast} ${isVisible ? styles.toastVisible : ''}`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {toast.icon && <span className={styles.icon}>{toast.icon}</span>}
      <span className={styles.text}>{toast.text}</span>
      {toast.count > 1 && <span className={styles.count}>x{toast.count}</span>}
    </div>
  );
}
