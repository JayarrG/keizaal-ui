import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import styles from './Accordion.module.css';

interface AccordionProps {
  title: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, className = '', defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (open && innerRef.current) {
      setBodyHeight(innerRef.current.scrollHeight);
    } else {
      setBodyHeight(0);
    }
  }, [open]);

  return (
    <div className={[styles.accordion, open ? styles.open : '', className].filter(Boolean).join(' ')}>
      {/* left accent bar */}
      <div className={styles.accentBar} />

      <button className={styles.header} onClick={() => setOpen(!open)}>
        {/* ornamental diamond bullet */}
        <span className={styles.bullet} />
        <span className={styles.title}>{title}</span>
        <span className={styles.chevron}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* ornamental divider between header and body */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerDot} />
        <span className={styles.dividerLine} />
      </div>

      <div
        ref={bodyRef}
        className={styles.bodyWrapper}
        style={{ height: bodyHeight !== undefined ? bodyHeight : 'auto' }}
      >
        <div ref={innerRef} className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}
