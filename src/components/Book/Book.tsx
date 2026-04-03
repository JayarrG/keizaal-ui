import { useState, type ReactNode } from 'react';
import styles from './Book.module.css';

interface BookProps {
  title: string;
  author?: string;
  pages: ReactNode[];
  className?: string;
  coverColor?: string;
}

export default function Book({ title, author, pages, className = '', coverColor }: BookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null);
  const [pagesMounted, setPagesMounted] = useState(false);
  const [pagesVisible, setPagesVisible] = useState(false);

  // each spread shows 2 pages: [0,1], [2,3], [4,5], etc.
  const totalSpreads = Math.ceil(pages.length / 2);
  const leftIdx = spreadIndex * 2;
  const rightIdx = spreadIndex * 2 + 1;
  const hasNext = spreadIndex < totalSpreads - 1;
  const hasPrev = spreadIndex > 0;

  const flipNext = () => {
    if (flipping || !hasNext) return;
    setFlipping('next');
    setTimeout(() => {
      setSpreadIndex(s => s + 1);
      setFlipping(null);
    }, 500);
  };

  const flipPrev = () => {
    if (flipping || !hasPrev) return;
    setFlipping('prev');
    setTimeout(() => {
      setSpreadIndex(s => s - 1);
      setFlipping(null);
    }, 500);
  };

  const openBook = () => {
    if (isOpen) return;
    setPagesMounted(true);
    setIsOpen(true);
    setTimeout(() => setPagesVisible(true), 150);
  };

  const closeCover = () => {
    setIsOpen(false);
    setTimeout(() => setPagesVisible(false), 200);
    setTimeout(() => {
      setPagesMounted(false);
      setSpreadIndex(0);
      setFlipping(null);
    }, 800);
  };

  const coverStyle = coverColor ? {
    background: `linear-gradient(135deg, ${coverColor} 0%, color-mix(in srgb, ${coverColor}, black 40%) 40%, color-mix(in srgb, ${coverColor}, black 30%) 100%)`,
  } : undefined;

  return (
    <div className={[styles.bookWrapper, className].filter(Boolean).join(' ')}>
      <div className={[styles.book, isOpen ? styles.bookOpen : ''].filter(Boolean).join(' ')}>
        {/* cover */}
        <div
          className={`${styles.cover} ${isOpen ? styles.coverOpen : ''}`}
          onClick={openBook}
        >
          <div className={styles.coverFront} style={coverStyle}>
            <div className={styles.coverBorder} />
            <div className={styles.coverContent}>
              <div className={styles.coverOrnamentTop} />
              <h2 className={styles.coverTitle}>{title}</h2>
              {author && <p className={styles.coverAuthor}>{author}</p>}
              <div className={styles.coverOrnamentBottom} />
            </div>
          </div>
          <div className={styles.coverBack} />
        </div>

        {/* two-page spread */}
        {pagesMounted && (
          <div className={[styles.pageArea, pagesVisible ? styles.pageAreaVisible : ''].filter(Boolean).join(' ')}>
            <div className={`${styles.page} ${styles.pageLeft}`}>
              <div className={styles.pageContent}>
                {leftIdx < pages.length ? pages[leftIdx] : null}
              </div>
              <span className={styles.pageNumber}>{leftIdx + 1}</span>
            </div>
            <div className={styles.spine} />
            <div className={`${styles.page} ${styles.pageRight}`}>
              <div className={styles.pageContent}>
                {rightIdx < pages.length ? pages[rightIdx] : null}
              </div>
              {rightIdx < pages.length && <span className={styles.pageNumber}>{rightIdx + 1}</span>}
            </div>

            {/* flip overlay — next */}
            {flipping === 'next' && (
              <div className={`${styles.flipPage} ${styles.flipNext}`}>
                <div className={styles.flipFront}>
                  <div className={styles.pageContent}>
                    {rightIdx < pages.length ? pages[rightIdx] : null}
                  </div>
                </div>
                <div className={styles.flipBack}>
                  <div className={styles.pageContent}>
                    {(spreadIndex + 1) * 2 < pages.length ? pages[(spreadIndex + 1) * 2] : null}
                  </div>
                </div>
              </div>
            )}

            {/* flip overlay — prev */}
            {flipping === 'prev' && (
              <div className={`${styles.flipPage} ${styles.flipPrev}`}>
                <div className={styles.flipFront}>
                  <div className={styles.pageContent}>
                    {(spreadIndex - 1) * 2 + 1 < pages.length ? pages[(spreadIndex - 1) * 2 + 1] : null}
                  </div>
                </div>
                <div className={styles.flipBack}>
                  <div className={styles.pageContent}>
                    {leftIdx < pages.length ? pages[leftIdx] : null}
                  </div>
                </div>
              </div>
            )}

            {/* navigation */}
            <div className={styles.nav}>
              {hasPrev && (
                <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={flipPrev} disabled={!!flipping}>
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <span className={styles.pageIndicator}>{leftIdx + 1}–{Math.min(rightIdx + 1, pages.length)}</span>
              {hasNext && (
                <button className={`${styles.navBtn} ${styles.navNext}`} onClick={flipNext} disabled={!!flipping}>
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <button className={`${styles.navBtn} ${styles.navClose}`} onClick={closeCover}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
