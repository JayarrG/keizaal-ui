import type { ReactNode } from 'react';
import styles from './Grid.module.css';
import { hexToHslVars } from '../../utils/color';

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: number;
  cellSize?: number;
  gap?: number;
  accent?: string;
  framed?: boolean;
}

export default function Grid({
  children, className = '', cols = 4, cellSize = 64, gap = 4,
  accent, framed = false,
}: GridProps) {
  const inner = (
    <div
      className={[styles.grid, className].filter(Boolean).join(' ')}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
        gap: `${gap}px`,
        ...(accent ? hexToHslVars(accent) : {}),
      }}
    >
      {children}
    </div>
  );

  if (!framed) return inner;

  return (
    <div className={styles.frame} style={accent ? hexToHslVars(accent) : undefined}>
      {inner}
    </div>
  );
}
