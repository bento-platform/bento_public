import type { CSSProperties, ReactNode } from 'react';
import { Children } from 'react';

interface ScrollableCardRowProps {
  children: ReactNode;
  gap?: number;
  cardWidth?: number;
  className?: string;
  style?: CSSProperties;
}

const ScrollableCardRow = ({ children, gap = 16, cardWidth = 300, className = '', style }: ScrollableCardRowProps) => {
  const containerStyle: CSSProperties = {
    display: 'flex',
    overflowX: 'scroll',
    gap,
    paddingBottom: 8,
    ...style,
  };

  return (
    <div className={`scrollable-card-row ${className}`.trim()} style={containerStyle}>
      {Children.map(children, (child) => (
        <div style={{ flexShrink: 0, width: cardWidth }}>{child}</div>
      ))}
    </div>
  );
};

export default ScrollableCardRow;
