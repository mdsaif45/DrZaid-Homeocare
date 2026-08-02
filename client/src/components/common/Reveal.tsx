import type { ElementType, ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

/**
 * Reveals its children when scrolled into view.
 *
 * `stagger` cascades direct children in sequence instead of moving the whole
 * block as one unit — used for card grids. The actual motion lives in
 * index.css so it can be disabled wholesale under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  stagger = false,
  threshold,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: boolean;
  threshold?: number;
}) {
  const { ref, revealed, instant } = useReveal<HTMLElement>({ threshold });

  return (
    <Tag
      ref={ref}
      data-revealed={revealed}
      data-instant={instant || undefined}
      className={`${stagger ? 'stagger' : 'reveal'} ${className}`}
      style={delay ? { ['--reveal-delay' as string]: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
