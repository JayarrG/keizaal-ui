export function hexToHslVars(hex: string): React.CSSProperties {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return {
      '--accent-h': '0',
      '--accent-s': '0%',
      '--accent-l': `${Math.round(l * 100)}%`,
    } as React.CSSProperties;
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  const lPct = Math.round(l * 100);
  return {
    '--accent-h': String(Math.round(h * 360)),
    '--accent-s': `${Math.round(s * 100)}%`,
    '--accent-l': `${lPct}%`,
    '--color-accent-on': lPct > 60 ? '#1a1a1a' : '#f0ece4',
  } as React.CSSProperties;
}
