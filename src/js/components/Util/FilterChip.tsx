import clsx from 'clsx';
import { useId } from 'react';

interface FilterChipProps {
  label: string;
  count: number;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const FilterChip = ({ label, count, selected, disabled, onClick }: FilterChipProps) => {
  const id = useId();

  return (
    <label htmlFor={id} className={clsx('fchip', selected && 'fchip--on')}>
      <input
        className="fchip__input"
        id={id}
        type="checkbox"
        checked={selected}
        disabled={disabled ?? (count === 0 && !selected)}
        onChange={onClick}
      />
      <span className="fchip__label">{label}</span>
      <span className="fchip__count">{count}</span>
    </label>
  );
};

export default FilterChip;
