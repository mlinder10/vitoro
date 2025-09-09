'use client';

import { useEffect, useRef } from 'react';

interface HighlightableTextProps {
  text: string;
  storageKey: string;
  className?: string;
}

export default function HighlightableText({ text, storageKey, className }: HighlightableTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (ref.current && stored) {
      ref.current.innerHTML = stored;
    }
  }, [storageKey]);

  function save() {
    if (ref.current) {
      localStorage.setItem(storageKey, ref.current.innerHTML);
    }
  }

  function handleMouseUp() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!ref.current || !ref.current.contains(range.commonAncestorContainer)) return;
    const span = document.createElement('span');
    span.className = 'highlight';
    range.surroundContents(span);
    selection.removeAllRanges();
    save();
  }

  function handleClick(e: React.MouseEvent<HTMLParagraphElement>) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('highlight')) {
      const parent = target.parentNode as HTMLElement;
      while (target.firstChild) parent.insertBefore(target.firstChild, target);
      parent.removeChild(target);
      save();
    }
  }

  return (
    <p
      ref={ref}
      className={className}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: text }}
    ></p>
  );
}

