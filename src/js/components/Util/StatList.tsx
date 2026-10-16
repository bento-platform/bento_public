import type { ReactNode } from 'react';
import clsx from 'clsx';

import { useFormatNumber } from '@/hooks';

export interface StatItem {
  key: string;
  label: ReactNode;
  value: number;
  icon?: ReactNode;
  description?: ReactNode;
}

interface StatListProps {
  items: StatItem[];
  variant: 'compact' | 'cards';
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

// Renders labelled counts as a description list so each label is programmatically tied to its value.
const StatList = ({ items, variant, ...ariaProps }: StatListProps) => {
  const fmt = useFormatNumber();
  return (
    <dl className={clsx('stat-list', `stat-list--${variant}`)} {...ariaProps}>
      {items.map(({ key, label, value, icon, description }) => (
        <div key={key} className="stat-list__item">
          <dt className="stat-list__label">{label}</dt>
          <dd className="stat-list__value">
            {icon && (
              <span className="stat-list__icon" aria-hidden="true">
                {icon}
              </span>
            )}
            {fmt(value)}
          </dd>
          {description && <dd className="stat-list__description">{description}</dd>}
        </div>
      ))}
    </dl>
  );
};

export default StatList;
