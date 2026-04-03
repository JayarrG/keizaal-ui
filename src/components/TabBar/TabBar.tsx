import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './TabBar.module.css';

interface Tab {
  id: string;
  label: string;
  className?: string;
}

interface TabBarProps {
  className?: string;
  tabs: Tab[];
  activeId?: string;
  bumperLeft?: ReactNode;
  bumperRight?: ReactNode;
  onSelect?: (id: string) => void;
}

export default function TabBar({
  className = '',
  tabs,
  activeId,
  bumperLeft = '[LB]',
  bumperRight = '[RB]',
  onSelect,
}: TabBarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <nav className={[styles.bar, className].filter(Boolean).join(' ')}>
      {bumperLeft && <div className={styles.bumper}>{bumperLeft}</div>}
      <ul className={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          const isHovered = tab.id === hoveredId;
          return (
            <li key={tab.id}>
              <button
                className={[
                  styles.tab,
                  isActive ? styles.tabActive : '',
                  isHovered && !isActive ? styles.tabHover : '',
                  tab.className || '',
                ].filter(Boolean).join(' ')}
                onMouseEnter={() => setHoveredId(tab.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelect?.(tab.id)}
              >
                {tab.label}
                {isActive && <span className={styles.indicator} />}
              </button>
            </li>
          );
        })}
      </ul>
      {bumperRight && <div className={styles.bumper}>{bumperRight}</div>}
    </nav>
  );
}
