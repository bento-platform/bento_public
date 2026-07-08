import { useTranslationFn } from '@/hooks';
import type { ProvenanceEntry, SectionId } from './types';

type SideNavProps = {
  navEntries: ProvenanceEntry[];
  activeSection: SectionId;
  onJump: (id: SectionId) => void;
};

const SideNav = ({ navEntries, activeSection, onJump }: SideNavProps) => {
  const t = useTranslationFn();
  return (
    <nav className="pm-nav">
      <div className="pm-nav-cap">On this page</div>
      {navEntries.map(({ id, icon, count }) => (
        <button
          key={id}
          type="button"
          className={`pm-nav-link${activeSection === id ? ' active' : ''}`}
          onClick={() => onJump(id)}
        >
          {icon}
          {t(`provenance.sections.${id}`)}
          {count !== undefined && <span className="pm-nav-count">{count}</span>}
        </button>
      ))}
    </nav>
  );
}

export default SideNav;
