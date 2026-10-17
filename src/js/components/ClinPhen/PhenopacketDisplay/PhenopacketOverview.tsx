import { useCallback, useImperativeHandle, useEffect, useMemo, useRef, type ForwardedRef } from 'react';
import { Collapse } from 'antd';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { SectionKey, SectionSpec } from './phenopacketOverview.registry';
import { SECTION_SPECS } from './phenopacketOverview.registry';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslationFn } from '@/hooks';
import { BREAD_CRUMB_HEIGHT } from '@/constants/common';
import { buildQueryParamsUrl } from '@/utils/queryParams';

export const PHENOPACKET_EXPANDED_URL_QUERY_KEY = 'expanded';

/** Query param naming the section/row to scroll to and highlight on arrival: `<sectionKey>` or `<sectionKey>:<rowId>`. */
export const PHENOPACKET_HIGHLIGHT_URL_QUERY_KEY = 'highlight';

export const highlightValue = (sectionKey: SectionKey, rowId?: string): string =>
  rowId ? `${sectionKey}:${rowId}` : sectionKey;

const parseHighlight = (value: string | null): { sectionKey: SectionKey; rowId?: string } | null => {
  if (!value) return null;
  const i = value.indexOf(':');
  const sectionKey = i === -1 ? value : value.slice(0, i);
  if (!(sectionKey in SECTION_SPECS)) return null;
  return { sectionKey: sectionKey as SectionKey, rowId: i === -1 ? undefined : value.slice(i + 1) };
};

export type CollapseHandle = {
  expandAll: () => void;
  collapseAll: () => void;
};

function scrollToWithOffset(el: HTMLElement, offsetPx: number) {
  requestAnimationFrame(() => {
    const scrollParent = getScrollParent(el);
    const rect = el.getBoundingClientRect();
    const parentRect = scrollParent.getBoundingClientRect();
    const top = scrollParent.scrollTop + rect.top - parentRect.top - offsetPx;
    scrollParent.scrollTo({ top, behavior: 'smooth' });
  });
}

function getScrollParent(el: HTMLElement): HTMLElement {
  let node = el.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return document.documentElement;
}

interface PhenopacketOverviewProps {
  phenopacket: Phenopacket;
  ref: ForwardedRef<CollapseHandle>;
}

const PhenopacketOverview = ({ phenopacket, ref }: PhenopacketOverviewProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslationFn();

  const expandedParam = searchParams.get(PHENOPACKET_EXPANDED_URL_QUERY_KEY);
  const openKeys = (
    expandedParam === null ? [phenopacket.subject ? 'subject' : 'biosamples'] : expandedParam.split(',')
  ) as SectionKey[];
  const highlightParam = searchParams.get(PHENOPACKET_HIGHLIGHT_URL_QUERY_KEY);
  const phenopacketRef = useRef(phenopacket);
  useEffect(() => {
    phenopacketRef.current = phenopacket;
  });
  const cleanupRef = useRef<null | (() => void)>(null);
  const pendingHighlightRef = useRef(false);

  const sections = useMemo(
    () =>
      Object.entries(SECTION_SPECS).sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)) as [
        SectionKey,
        SectionSpec,
      ][],
    []
  );

  const items = useMemo(
    () =>
      sections
        .map(([key, spec]) => {
          const enabled = typeof spec.enabled === 'function' ? spec.enabled(phenopacket) : spec.enabled;
          if (!enabled) return null;
          const itemCount = spec.itemCount?.(phenopacket);
          const titleTranslationOptions =
            spec.renderSingleItemDetail && itemCount !== undefined ? { count: itemCount } : undefined;
          const showItemCount = itemCount !== undefined && !(spec.renderSingleItemDetail && itemCount === 1);
          return {
            key,
            label: (
              <strong style={{ fontSize: '16px', borderTop: '10px' }}>
                {t(spec.titleTranslationKey, titleTranslationOptions)}
                {showItemCount ? ` (${itemCount})` : null}
              </strong>
            ),
            children: (
              <div id={`phenopacket-${key}`} data-pp-section={key}>
                {spec.render(phenopacket)}
              </div>
            ),
            // forceRender makes accessing elements for highlighting before the section is opened possible
            forceRender: true,
          };
        })
        .filter((block) => !!block),
    [sections, phenopacket, t]
  );

  const setOpenKeys = useCallback(
    (keys: string[]) => {
      const params = new URLSearchParams(searchParams);
      params.set(PHENOPACKET_EXPANDED_URL_QUERY_KEY, keys.join(','));
      router.replace(buildQueryParamsUrl(pathname, [...params]));
    },
    [searchParams, router, pathname]
  );

  const expandAll = useCallback(() => setOpenKeys(items.map((i) => i.key)), [items, setOpenKeys]);
  const collapseAll = useCallback(() => setOpenKeys([]), [setOpenKeys]);

  useImperativeHandle(ref, () => ({ expandAll, collapseAll }), [expandAll, collapseAll]);

  // Separate ref to track if highlight is active
  const highlightElRef = useRef<HTMLElement | null>(null);

  // Click listener — clears highlight only if no new highlight is incoming
  useEffect(() => {
    const handleClick = () => {
      // If a new highlight is being set up, let the effect handle cleanup instead
      if (pendingHighlightRef.current) return;

      if (highlightElRef.current) {
        highlightElRef.current.classList.remove('highlight-animation', 'highlight-boundary');
        highlightElRef.current = null;
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const highlight = parseHighlight(highlightParam);
    if (!highlight) return;
    const { sectionKey, rowId } = highlight;
    const phenopacket = phenopacketRef.current;

    const { renderSingleItemDetail, itemCount } = SECTION_SPECS[sectionKey as SectionKey];
    const sectionCount = itemCount?.(phenopacket);

    const divId = rowId && !(renderSingleItemDetail && sectionCount === 1) ? rowId : `phenopacket-${sectionKey}`;
    const el = document.getElementById(divId);

    // Signal to the click handler that a highlight transition is in flight
    pendingHighlightRef.current = true;

    const animationRun = () => {
      // Clear the pending flag — click handler may now clean up freely
      pendingHighlightRef.current = false;

      if (!el) return;

      // Clean up previous highlight (same element or different)
      if (highlightElRef.current) {
        highlightElRef.current.classList.remove('highlight-animation');
        if (highlightElRef.current !== el) {
          highlightElRef.current.classList.remove('highlight-boundary');
        }
      }

      scrollToWithOffset(el, BREAD_CRUMB_HEIGHT + 15); // 15 -> Extra padding from top

      el.setAttribute('tabindex', '-1');
      try {
        (el as HTMLElement).focus({ preventScroll: true });
      } catch {
        (el as HTMLElement).focus();
      }

      el.classList.add('highlight-animation');
      highlightElRef.current = el;
    };

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(animationRun);
      cleanupRef.current = () => cancelAnimationFrame(raf2);
    });

    el?.classList.add('highlight-boundary');

    return () => {
      cancelAnimationFrame(raf1);
      cleanupRef.current?.();
      cleanupRef.current = null;
      // Only reset pending flag if it's still ours (effect didn't reach animationRun yet)
      pendingHighlightRef.current = false;
      el?.classList.remove('highlight-boundary');
      el?.blur();
    };
    // Runs on mount and whenever the highlight param changes, not on every re-render - sections are force-rendered, so
    // the target element exists before it is opened.
  }, [highlightParam]);

  return <Collapse className="compact" items={items} activeKey={openKeys} onChange={setOpenKeys} ghost />;
};

export default PhenopacketOverview;
