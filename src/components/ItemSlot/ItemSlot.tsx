import type { ReactNode } from 'react';
import styles from './ItemSlot.module.css';

interface ItemSlotProps {
  className?: string;
  size?: number;
  image?: string;
  count?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  selected?: boolean;
  empty?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

export default function ItemSlot({
  className = '', size = 64, image, count, rarity,
  selected = false, empty = false, children, onClick,
}: ItemSlotProps) {
  return (
    <div
      className={[
        styles.slot,
        selected ? styles.selected : '',
        empty ? styles.empty : '',
        rarity ? styles[rarity] : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {image && <img src={image} className={styles.image} alt="" draggable={false} />}
      {children}
      {count != null && count > 1 && <span className={styles.count}>{count}</span>}
    </div>
  );
}
