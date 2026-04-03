import { useState, useCallback } from 'react';
import styles from './ColorPicker.module.css';

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorPicker() {
  const [color, setColor] = useState('#ffffff');
  const [open, setOpen] = useState(false);
  const [blur, setBlur] = useState(3);
  const [darken, setDarken] = useState(75);

  const apply = useCallback((hex: string) => {
    setColor(hex);
    const [h, s, l] = hexToHsl(hex);
    const root = document.documentElement;
    root.style.setProperty('--accent-h', String(h));
    root.style.setProperty('--accent-s', `${s}%`);
    root.style.setProperty('--accent-l', `${l}%`);
    // text-on-accent: dark text for bright accents, light text for dark
    root.style.setProperty('--color-accent-on', l > 60 ? '#1a1a1a' : '#f0ece4');
  }, []);

  const applyBlur = useCallback((val: number) => {
    setBlur(val);
    document.documentElement.style.setProperty('--bg-blur', `${val}px`);
  }, []);

  const applyDarken = useCallback((val: number) => {
    setDarken(val);
    document.documentElement.style.setProperty('--bg-darken', String(val / 100));
  }, []);

  const presets = ['#c4a46c', '#6ca4c4', '#c46c6c', '#6cc470', '#a06cc4', '#c4c46c', '#c47a6c', '#8888aa'];

  return (
    <div className={styles.picker}>
      <button className={styles.toggle} onClick={() => setOpen(!open)}>
        <div className={styles.swatch} style={{ backgroundColor: color }} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          <label className={styles.label}>accent color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => apply(e.target.value)}
            className={styles.colorInput}
          />
          <div className={styles.presets}>
            {presets.map((p) => (
              <button
                key={p}
                className={`${styles.preset} ${p === color ? styles.presetActive : ''}`}
                style={{ backgroundColor: p }}
                onClick={() => apply(p)}
              />
            ))}
          </div>

          <div className={styles.divider} />

          <label className={styles.label}>background blur</label>
          <div className={styles.sliderRow}>
            <input
              type="range"
              min={0}
              max={20}
              value={blur}
              onChange={(e) => applyBlur(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.sliderValue}>{blur}px</span>
          </div>

          <label className={styles.label}>background darken</label>
          <div className={styles.sliderRow}>
            <input
              type="range"
              min={0}
              max={90}
              value={darken}
              onChange={(e) => applyDarken(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.sliderValue}>{darken}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
