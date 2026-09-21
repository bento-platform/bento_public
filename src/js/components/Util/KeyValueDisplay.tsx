import type { ReactNode } from 'react';
import clsx from 'clsx';

export type KeyValueItem = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  valueClassName?: string;
  span?: boolean;
};

const KeyValueItemDisplay = ({ icon, label, value, valueClassName, span }: KeyValueItem) => (
  <div className={clsx('kv-row', { span })}>
    <dt className="kv-k">
      {icon && (
        <span className="kv-icon" aria-hidden>
          {icon}
        </span>
      )}
      {label}
    </dt>
    <dd className={clsx('kv-v', valueClassName)}>{value}</dd>
  </div>
);

const KeyValueDisplay = ({ items }: { items: KeyValueItem[] }) => (
  <dl className="kv">
    {items.map((item, idx) => (
      <KeyValueItemDisplay key={idx} {...item} />
    ))}
  </dl>
);

export default KeyValueDisplay;
