import { type ReactNode, useId } from 'react';
import clsx from 'clsx';

export type KeyValueItem = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  span?: boolean;
};

const KeyValueItemDisplay = ({ label, value, valueClassName, span }: KeyValueItem) => {
  const keyId = useId();
  return (
    <div className={clsx('kv-row', { span })} role="row">
      <div className="kv-k" id={keyId} role="rowheader">
        {label}
      </div>
      <div className={clsx('kv-v', valueClassName)} role="gridcell" aria-labelledby={keyId}>
        {value}
      </div>
    </div>
  );
};

const KeyValueDisplay = ({ items }: { items: KeyValueItem[] }) => {
  return (
    <div className="kv" role="grid">
      {items.map((item, idx) => (
        <KeyValueItemDisplay key={idx} {...item} />
      ))}
    </div>
  );
};

export default KeyValueDisplay;
