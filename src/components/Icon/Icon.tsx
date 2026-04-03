import styles from './Icon.module.css';

interface IconProps {
  className?: string;
  src: string;
  size?: number;
  tinted?: boolean;
}

export default function Icon({ className = '', src, size = 24, tinted = true }: IconProps) {
  if (tinted) {
    return (
      <div
        className={[styles.icon, styles.tinted, className].filter(Boolean).join(' ')}
        style={{
          width: size,
          height: size,
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
        }}
      />
    );
  }

  return (
    <img
      src={src}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      alt=""
      draggable={false}
    />
  );
}
