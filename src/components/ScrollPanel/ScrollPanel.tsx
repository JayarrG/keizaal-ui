import { type ReactNode, useRef, useState, useEffect, useCallback } from 'react';
import styles from './ScrollPanel.module.css';

interface ScrollPanelProps {
  children: ReactNode;
  className?: string;
  maxHeight?: number | string;
}

export default function ScrollPanel({ children, className = '', maxHeight = 300 }: ScrollPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(40);
  const [thumbTop, setThumbTop] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragStart = useRef({ y: 0, scrollTop: 0 });

  const updateThumb = useCallback(() => {
    const el = contentRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const { scrollHeight, clientHeight, scrollTop } = el;
    const needsScroll = scrollHeight > clientHeight;
    setVisible(needsScroll);

    if (!needsScroll) return;

    const trackHeight = track.clientHeight;
    const ratio = clientHeight / scrollHeight;
    const tHeight = Math.max(32, trackHeight * ratio);
    const tTop = (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - tHeight);

    setThumbHeight(tHeight);
    setThumbTop(tTop);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    updateThumb();
    el.addEventListener('scroll', updateThumb, { passive: true });

    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', updateThumb);
      ro.disconnect();
    };
  }, [updateThumb]);

  const onThumbDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    dragStart.current = {
      y: e.clientY,
      scrollTop: contentRef.current?.scrollTop ?? 0,
    };
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      const el = contentRef.current;
      const track = trackRef.current;
      if (!el || !track) return;

      const trackHeight = track.clientHeight;
      const ratio = el.scrollHeight / el.clientHeight;
      const deltaY = e.clientY - dragStart.current.y;
      const scrollDelta = deltaY * ratio * (el.clientHeight / trackHeight);
      el.scrollTop = dragStart.current.scrollTop + scrollDelta;
    };

    const onUp = () => setDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  const onTrackClick = useCallback((e: React.MouseEvent) => {
    const el = contentRef.current;
    const track = trackRef.current;
    if (!el || !track || e.target === thumbRef.current) return;

    const rect = track.getBoundingClientRect();
    const clickRatio = (e.clientY - rect.top) / rect.height;
    el.scrollTop = clickRatio * (el.scrollHeight - el.clientHeight);
  }, []);

  return (
    <div
      className={[styles.wrapper, dragging ? styles.dragging : '', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={contentRef}
        className={styles.content}
        style={{ maxHeight }}
      >
        {children}
      </div>

      {/* custom scrollbar */}
      <div className={[styles.scrollbar, visible ? styles.visible : '', (hovered || dragging) ? styles.active : ''].filter(Boolean).join(' ')}>
        {/* top cap ornament */}
        <div className={styles.capTop}>
          <div className={styles.capDiamond} />
        </div>

        {/* track */}
        <div ref={trackRef} className={styles.track} onClick={onTrackClick}>
          {/* central groove channel */}
          <div className={styles.groove} />

          {/* thumb */}
          <div
            ref={thumbRef}
            className={[styles.thumb, dragging ? styles.thumbDragging : ''].filter(Boolean).join(' ')}
            style={{ height: thumbHeight, top: thumbTop }}
            onMouseDown={onThumbDown}
          >
            <div className={styles.thumbGrip} />
          </div>
        </div>

        {/* bottom cap ornament */}
        <div className={styles.capBottom}>
          <div className={styles.capDiamond} />
        </div>
      </div>
    </div>
  );
}
