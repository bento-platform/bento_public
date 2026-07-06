import type { NavEntry, SectionId } from './types';

type SideNavProps = {
  navEntries: NavEntry[];
  activeSection: SectionId;
  onJump: (id: SectionId) => void;
};

const SideNav = ({ navEntries, activeSection, onJump }: SideNavProps) => (
  <nav className="pm-nav">
    <div className="pm-nav-cap">On this page</div>
    {navEntries.map(({ id, label, icon, count }) => (
      <button
        key={id}
        type="button"
        className={`pm-nav-link${activeSection === id ? ' active' : ''}`}
        onClick={() => onJump(id)}
      >
        {icon}
        {label}
        {count !== undefined && <span className="pm-nav-count">{count}</span>}
      </button>
    ))}
  </nav>
);

export default SideNav;
