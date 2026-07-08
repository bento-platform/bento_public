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
      <div className="pm-nav-cap">{t('provenance.on_this_page')}</div>
      {navEntries.map(({ id, icon, count }) => {
        const label = t(`provenance.sections.${id}`);
        return (
          <button
            key={id}
            type="button"
            title={label}
            className={`pm-nav-link${activeSection === id ? ' active' : ''}`}
            onClick={() => onJump(id)}
          >
            {icon}
            <div className="pm-nav-label">{label}</div>
            {count !== undefined && <span className="pm-nav-count">{count}</span>}
          </button>
        );
      })}
    </nav>
  );
};

export default SideNav;
