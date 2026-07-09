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
  /** Omit to render no header at all, e.g. when the caller's own content already has a title. */
  title?: ReactNode;
  /** Shown in the header in place of the close button when not in overlay mode, e.g. a result count. */
  countLabel?: ReactNode;
  /** Required when `overlay` is true (labels the close button); unused otherwise. */
  closeLabel?: string;
  /** Below some breakpoint, the sider renders as a fixed slide-over drawer instead of an inline column. */
  overlay: boolean;
  /** Ignored when `overlay` is false (the sider is always visible inline). */
  open: boolean;
  onClose?: () => void;
  /** Renders as collapsible facet sections. Omit and use `children` for a non-sectioned body (e.g. a form). */
  sections?: FacetSiderSection[];
  children?: ReactNode;
  /** BEM-style class prefix, e.g. "catalogue-rail" — drives `{prefix}`, `{prefix}-backdrop`,
   *  `{prefix}--overlay`, `{prefix}--open`, and `{prefix}__*` header classes. */
  classPrefix: string;
  /** Applied to the outer wrapper div, for callers with existing id-keyed CSS. */
  id?: string;
}

/**
 * Generic facet-sidebar shell: an optional header (title + count-or-close) plus a body, with an
 * optional overlay/slide-over presentation for narrow viewports. The body is either a list of
 * collapsible facet sections (`sections`) or arbitrary content (`children`), so the same shell
 * works for the catalogue's chip facets and the Search feature's sidebar (SearchForm), even
 * though the two don't share a URL-sync or filter-state model.
 */
const FacetSider = ({
  title,
  countLabel,
  closeLabel,
  overlay,
  open,
  onClose,
  sections,
  children,
  classPrefix,
  id,
}: FacetSiderProps) => (
  <>
    {overlay && open && <div className={`${classPrefix}-backdrop`} onClick={onClose} aria-hidden />}
    <div id={id} className={clsx(classPrefix, overlay && `${classPrefix}--overlay`, open && `${classPrefix}--open`)}>
      {title !== undefined && (
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
      )}
      {sections ? (
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
      ) : (
        children
      )}
    </div>
  </>
);

export default FacetSider;
