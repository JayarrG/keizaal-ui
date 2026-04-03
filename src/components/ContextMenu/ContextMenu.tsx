import { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import styles from './ContextMenu.module.css';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
  className?: string;
  onSelect: (id: string) => void;
}

export default function ContextMenu({ children, items, className = '', onSelect }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleContext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [mounted, close]);

  return (
    <div
      ref={wrapperRef}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      onContextMenu={handleContext}
    >
      {children}
      {mounted && (
        <div
          ref={menuRef}
          className={`${styles.menu} ${visible ? styles.menuVisible : ''}`}
          style={{ left: pos.x, top: pos.y }}
        >
          <div className={styles.topAccent} />
          {items.map((item) =>
            item.divider ? (
              <div key={item.id} className={styles.divider} />
            ) : (
              <button
                key={item.id}
                className={[
                  styles.item,
                  item.disabled ? styles.disabled : '',
                  item.danger ? styles.danger : '',
                ].filter(Boolean).join(' ')}
                onClick={() => {
                  if (!item.disabled) {
                    onSelect(item.id);
                    close();
                  }
                }}
                disabled={item.disabled}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span className={styles.label}>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
