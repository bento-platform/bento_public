import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CaretDownOutlined, CaretRightOutlined, CloseOutlined } from '@ant-design/icons';

export interface FacetSiderSection {
  id: string;
  label: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Body content for the section, e.g. chips, a range input, a date picker — the shell doesn't care. */
  render: () => ReactNode;
}

export interface FacetSiderProps {
  title: string;
  /** Shown in the header in place of the close button when not in overlay mode, e.g. a result count. */
  countLabel?: ReactNode;
  closeLabel: string;
  /** Below some breakpoint, the sider renders as a fixed slide-over drawer instead of an inline column. */
  overlay: boolean;
  /** Ignored when `overlay` is false (the sider is always visible inline). */
  open: boolean;
  onClose: () => void;
  sections: FacetSiderSection[];
  /** BEM-style class prefix, e.g. "catalogue-rail" — drives `{prefix}`, `{prefix}-backdrop`,
   *  `{prefix}--overlay`, `{prefix}--open`, and `{prefix}__*` header classes. */
  classPrefix: string;
}

/**
 * Generic facet-sidebar shell: header (title + count-or-close) plus a list of collapsible
 * sections, with an optional overlay/slide-over presentation for narrow viewports. Each section
 * owns its own collapse state and renders its own body, so the same shell works for the
 * catalogue's chip facets and (eventually) the Search feature's enum/range/date filters.
 */
const FacetSider = ({
  title,
  countLabel,
  closeLabel,
  overlay,
  open,
  onClose,
  sections,
  classPrefix,
}: FacetSiderProps) => (
  <>
    {overlay && open && <div className={`${classPrefix}-backdrop`} onClick={onClose} aria-hidden />}
    <div className={clsx(classPrefix, overlay && `${classPrefix}--overlay`, open && `${classPrefix}--open`)}>
      <div className={`${classPrefix}__header`}>
        <span className={`${classPrefix}__title`}>{title}</span>
        {overlay ? (
          <button className={`${classPrefix}__close`} onClick={onClose} aria-label={closeLabel}>
            <CloseOutlined />
          </button>
        ) : (
          countLabel !== undefined && <span className={`${classPrefix}__count`}>{countLabel}</span>
        )}
      </div>
      <div>
        {sections.map((section) => (
          <div key={section.id} className={clsx('facet-section', !section.collapsed && 'facet-section--expanded')}>
            <button className="facet-head" onClick={section.onToggleCollapse}>
              <span className="facet-head__label">{section.label}</span>
              {section.collapsed ? (
                <CaretRightOutlined className="facet-head__icon" />
              ) : (
                <CaretDownOutlined className="facet-head__icon" />
              )}
            </button>
            {!section.collapsed && section.render()}
          </div>
        ))}
      </div>
    </div>
  </>
);

export default FacetSider;
