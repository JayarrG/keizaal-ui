import { useState } from 'react';
import styles from './DialogPanel.module.css';
import { hexToHslVars } from '../../utils/color';
import cornerTL from '../../assets/corners/corner_tl.png';
import cornerTR from '../../assets/corners/corner_tr.png';
import cornerBL from '../../assets/corners/corner_bl.png';
import cornerBR from '../../assets/corners/corner_br.png';

const cornerSrcs = [
  { src: cornerTL, cls: 'cornerTL' },
  { src: cornerTR, cls: 'cornerTR' },
  { src: cornerBL, cls: 'cornerBL' },
  { src: cornerBR, cls: 'cornerBR' },
] as const;

interface DialogOption {
  id: string;
  text: string;
  persuasion?: 'intimidate' | 'persuade' | 'bribe';
}

interface DialogPanelProps {
  className?: string;
  speaker: string;
  body: string;
  options: DialogOption[];
  accent?: string;
  position?: 'bottom' | 'center' | 'top';
  onSelect?: (id: string) => void;
}

export default function DialogPanel({
  className = '',
  speaker,
  body,
  options,
  accent,
  position = 'bottom',
  onSelect,
}: DialogPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={[styles.overlay, styles[`pos_${position}`]].join(' ')}>
      <div
        className={[styles.panel, className].filter(Boolean).join(' ')}
        style={accent ? hexToHslVars(accent) : undefined}
      >
        {cornerSrcs.map(({ src, cls }) => (
          <div
            key={cls}
            className={`${styles.corner} ${styles[cls]}`}
            style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
          />
        ))}

        <div className={styles.header}>
          <div className={styles.dividerLine} />
          <h2 className={styles.speaker}>{speaker}</h2>
          <div className={styles.dividerLine} />
        </div>

        <p className={styles.body}>{body}</p>

        <ul className={styles.options}>
          {options.map((opt) => (
            <li key={opt.id}>
              <button
                className={`${styles.option} ${hoveredId === opt.id ? styles.optionHover : ''}`}
                onMouseEnter={() => setHoveredId(opt.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelect?.(opt.id)}
              >
                {opt.persuasion && (
                  <span className={styles.persuasionTag}>
                    [{opt.persuasion}]
                  </span>
                )}
                {opt.text}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <div className={styles.dividerLine} />
        </div>
      </div>
    </div>
  );
}
