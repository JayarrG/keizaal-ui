import type { ReactNode } from 'react';
import styles from './List.module.css';

interface ListItem {
  id: string;
  content: ReactNode;
}

interface ListProps {
  className?: string;
  items: ListItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export default function List({ className = '', items, selectedId, onSelect }: ListProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <li
          key={item.id}
          className={[
            styles.row,
            i % 2 === 1 ? styles.alt : '',
            item.id === selectedId ? styles.selected : '',
          ].filter(Boolean).join(' ')}
          onClick={() => onSelect?.(item.id)}
        >
          {item.content}
        </li>
      ))}
    </ul>
  );
}
