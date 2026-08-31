import clsx from 'clsx';
import { useId } from 'react';
import { useTranslationFn } from '@/hooks';

interface FilterChipProps {
  label: string;
  count: number;
  selected: boolean;
  disabled?: boolean;
  onChange: () => void;
}

const FilterChip = ({ label, count, selected, disabled, onChange }: FilterChipProps) => {
  const id = useId();
  const t = useTranslationFn();
  const labelTitle = selected
    ? `${t('catalogue.rail.clear_filter')} , ${label}`
    : `${t('catalogue.rail.filter_by')} , ${label}`;

  return (
    <label htmlFor={id} className={clsx('fchip', selected && 'fchip--on')} title={labelTitle}>
      <input
        className="fchip__input visually-hidden"
        id={id}
        type="checkbox"
        checked={selected}
        disabled={disabled ?? (count === 0 && !selected)}
        onChange={onChange}
      />
      <span className="fchip__label" aria-hidden>
        {label}
      </span>
      <span className="fchip__count" aria-hidden>
        {count}
      </span>
    </label>
  );
};

export default FilterChip;
