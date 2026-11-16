import type { MouseEventHandler } from 'react';

const ClickablePill = ({ pillColor, label, onClick }: ProgramPillProps) => (
  <div className="mt-2 self-start max-w-full">
    <button type="button" className="clickable-pill" title={label} onClick={onClick}>
      <span className="clickable-pill__dot" style={{ background: pillColor }} />
      <span className="clickable-pill__label">{label}</span>
    </button>
  </div>
);

export interface ProgramPillProps {
  pillColor: string;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default ClickablePill;
