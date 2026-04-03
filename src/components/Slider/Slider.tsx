import { useRef, useCallback } from 'react';
import styles from './Slider.module.css';

interface SliderProps {
  className?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  locked?: boolean;
  onChange: (value: number) => void;
}

export default function Slider({
  className = '', value, min = 0, max = 100, step = 1,
  label, showValue = true, locked = false, onChange,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackRef = useRef<HTMLDivElement>(null);

  const commit = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(Math.max(min, Math.min(max, stepped)));
  }, [min, max, step, onChange]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (locked) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    commit(e.clientX);
  }, [commit, locked]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (locked || e.buttons === 0) return;
    commit(e.clientX);
  }, [commit, locked]);

  return (
    <div className={[styles.slider, locked ? styles.locked : '', className].filter(Boolean).join(' ')}>
      {label && <span className={styles.label}>{label}</span>}

      <div className={styles.wrapper}>
        {/* end cap left */}
        <div className={styles.capLeft} />

        <div
          ref={trackRef}
          className={styles.track}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {/* groove */}
          <div className={styles.groove} />

          {/* filled portion */}
          <div className={styles.fill} style={{ width: `${pct}%` }} />

          {/* thumb */}
          <div className={styles.thumb} style={{ left: `${pct}%` }}>
            <div className={styles.thumbDiamond} />
          </div>
        </div>

        {/* end cap right */}
        <div className={styles.capRight} />
      </div>

      {showValue && <span className={styles.value}>{value}</span>}
    </div>
  );
}
