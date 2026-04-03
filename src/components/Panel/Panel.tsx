import type { ReactNode } from 'react';
import styles from './Panel.module.css';
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

interface PanelProps {
  children: ReactNode;
  className?: string;
  corners?: boolean;
  topAccent?: boolean;
  interactive?: boolean;
  active?: boolean;
  accent?: string;
  bg?: string;
  bgPosition?: string;
  /** Cut corners at 45deg. Number = size in px, or per-corner object. */
  notch?: number | { tl?: number; tr?: number; bl?: number; br?: number };
  /** Indent sides inward at midpoint. Number = depth in px, or per-side object. */
  indent?: number | { left?: number; right?: number; top?: number; bottom?: number };
  onClick?: () => void;
}

function buildClipPath(
  notch?: PanelProps['notch'],
  indent?: PanelProps['indent'],
): string | undefined {
  if (!notch && !indent) return undefined;

  const n = typeof notch === 'number'
    ? { tl: notch, tr: notch, bl: notch, br: notch }
    : { tl: 0, tr: 0, bl: 0, br: 0, ...notch };

  const ind = typeof indent === 'number'
    ? { left: indent, right: indent, top: 0, bottom: 0 }
    : { left: 0, right: 0, top: 0, bottom: 0, ...indent };

  // Build polygon points clockwise from top-left
  const points: string[] = [];

  // Top-left corner
  if (n.tl) {
    points.push(`${n.tl}px 0`);
  } else {
    points.push('0 0');
  }

  // Top edge (with optional indent)
  if (ind.top) {
    points.push(`calc(50% - ${ind.top}px) 0`);
    points.push(`50% ${ind.top}px`);
    points.push(`calc(50% + ${ind.top}px) 0`);
  }

  // Top-right corner
  if (n.tr) {
    points.push(`calc(100% - ${n.tr}px) 0`);
    points.push(`100% ${n.tr}px`);
  } else {
    points.push('100% 0');
  }

  // Right edge (with optional indent)
  if (ind.right) {
    points.push(`100% calc(50% - ${ind.right}px)`);
    points.push(`calc(100% - ${ind.right}px) 50%`);
    points.push(`100% calc(50% + ${ind.right}px)`);
  }

  // Bottom-right corner
  if (n.br) {
    points.push(`100% calc(100% - ${n.br}px)`);
    points.push(`calc(100% - ${n.br}px) 100%`);
  } else {
    points.push('100% 100%');
  }

  // Bottom edge (with optional indent)
  if (ind.bottom) {
    points.push(`calc(50% + ${ind.bottom}px) 100%`);
    points.push(`50% calc(100% - ${ind.bottom}px)`);
    points.push(`calc(50% - ${ind.bottom}px) 100%`);
  }

  // Bottom-left corner
  if (n.bl) {
    points.push(`${n.bl}px 100%`);
    points.push(`0 calc(100% - ${n.bl}px)`);
  } else {
    points.push('0 100%');
  }

  // Left edge (with optional indent)
  if (ind.left) {
    points.push(`0 calc(50% + ${ind.left}px)`);
    points.push(`${ind.left}px 50%`);
    points.push(`0 calc(50% - ${ind.left}px)`);
  }

  // Close back to top-left
  if (n.tl) {
    points.push(`0 ${n.tl}px`);
  }

  return `polygon(${points.join(', ')})`;
}

export default function Panel({
  children,
  className = '',
  corners = true,
  topAccent = false,
  interactive = false,
  active = false,
  accent,
  bg,
  bgPosition = 'center bottom',
  notch,
  indent,
  onClick,
}: PanelProps) {
  const clipPath = buildClipPath(notch, indent);
  const hasShaped = !!clipPath;

  const inlineStyle: React.CSSProperties = {
    ...(accent ? hexToHslVars(accent) : {}),
  };

  const panelContent = (
    <div
      className={[
        styles.panel,
        corners && !hasShaped ? styles.withCorners : '',
        topAccent && !hasShaped ? styles.topAccent : '',
        interactive ? styles.interactive : '',
        active ? styles.active : '',
        hasShaped ? styles.shaped : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ ...inlineStyle, ...(hasShaped ? { clipPath } : {}) }}
      onClick={onClick}
    >
      {bg && (
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${bg})`, backgroundPosition: bgPosition }}
        />
      )}
      {corners && !hasShaped && cornerSrcs.map(({ src, cls }) => (
        <div
          key={cls}
          className={`${styles.corner} ${styles[cls]}`}
          style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
        />
      ))}
      {children}
    </div>
  );

  // For shaped panels, render double-border lines as stacked clip-path layers
  if (hasShaped) {
    return (
      <div
        className={[styles.shapedBorder, interactive ? styles.interactive : '', active ? styles.active : ''].filter(Boolean).join(' ')}
        style={inlineStyle}
        onClick={onClick}
      >
        <div className={styles.shapedOutline} style={{ clipPath }} />
        <div className={styles.shapedGapOuter} style={{ clipPath }} />
        <div className={styles.shapedInline} style={{ clipPath }} />
        <div className={styles.shapedGapInner} style={{ clipPath }} />
        {panelContent}
      </div>
    );
  }

  return panelContent;
}
