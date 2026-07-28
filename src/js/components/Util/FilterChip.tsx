import clsx from 'clsx';

interface FilterChipProps {
  label: string;
  count: number;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const FilterChip = ({ label, count, selected, disabled, onClick }: FilterChipProps) => (
  <button
    type="button"
    aria-pressed={selected}
    disabled={disabled ?? (count === 0 && !selected)}
    onClick={onClick}
    className={clsx('fchip', selected && 'fchip--on')}
  >
    <span className="fchip__label">{label}</span>
    <span className="fchip__count">{count}</span>
  </button>
);

export default FilterChip;
