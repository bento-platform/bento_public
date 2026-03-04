import { useCallback, useImperativeHandle, forwardRef, useEffect, useMemo, useRef } from 'react';
import { Collapse } from 'antd';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { SectionKey, SectionSpec } from './phenopacketOverview.registry';
import { SECTION_SPECS } from './phenopacketOverview.registry';
import { useSearchParams } from 'react-router-dom';
import { useTranslationFn } from '@/hooks';
import { useLocationState } from '@/hooks/useLocationState';
import { NAVBAR_HEIGHT } from '@/constants/common';

export const PHENOPACKET_EXPANDED_URL_QUERY_KEY = 'expanded';

const serializeKeys = (keys: SectionKey[], prev: URLSearchParams | null = null): URLSearchParams => {
  const keyString = keys.join(',');
  const previous = prev ? prev.toString() : '';
  const returnVal = new URLSearchParams(previous);
  returnVal.set(PHENOPACKET_EXPANDED_URL_QUERY_KEY, keyString);
  return returnVal;
};

const deserializeKeys = (params: URLSearchParams): SectionKey[] => {
  const queryVals = params.get(PHENOPACKET_EXPANDED_URL_QUERY_KEY);
  return (queryVals?.split(',') as SectionKey[]) ?? [];
};

export type CollapseHandle = {
  expandAll: () => void;
  collapseAll: () => void;
};

interface PhenopacketOverviewProps {
  phenopacket: Phenopacket;
}

function scrollToWithOffset(el: HTMLElement, offsetPx: number) {
  const rect = el.getBoundingClientRect();
  const top = window.scrollY + rect.top - offsetPx;
  window.scrollTo({ top, behavior: 'smooth' });
}

function addTemporaryHighlight(el: HTMLElement, ms = 2500) {
  el.classList.add('highlight-animation');
  const timeout = window.setTimeout(() => el.classList.remove('highlight-animation'), ms);
  return () => window.clearTimeout(timeout);
}

const PhenopacketOverview = forwardRef<CollapseHandle, PhenopacketOverviewProps>(({ phenopacket }, ref) => {
  const [open, setOpen] = useSearchParams(serializeKeys(['subject']));
  const t = useTranslationFn();
  const routerState = useLocationState();
  const cleanupRef = useRef<null | (() => void)>(null);

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
          return {
            key,
            label: (
              <strong style={{ fontSize: '16px', borderTop: '10px' }}>
                {t(spec.titleTranslationKey)}
                {itemCount ? ` (${itemCount})` : null}
              </strong>
            ),
            children: (
              <div id={`phenopacket-${key}`} data-pp-section={key}>
                {spec.render(phenopacket)}
              </div>
            ),
          };
        })
        .filter((block) => !!block),
    [sections, phenopacket, t]
  );

  const handleCollapseChange = useCallback(
    (e: string[]) => {
      setOpen(serializeKeys(e as SectionKey[], open), { replace: true });
    },
    [open, setOpen]
  );

  const expandAll = useCallback(() => {
    setOpen(
      serializeKeys(
        items.map((i) => i.key),
        open
      ),
      { replace: true }
    );
  }, [items, open, setOpen]);

  const collapseAll = useCallback(() => {
    setOpen(serializeKeys([], open), { replace: true });
  }, [open, setOpen]);

  useImperativeHandle(ref, () => ({ expandAll, collapseAll }), [expandAll, collapseAll]);

  useEffect(() => {
    const { sectionKey, rowId } =
      (routerState as { highlight?: { sectionKey?: string; rowId?: string } })?.highlight ?? {};

    const divId = rowId ?? `phenopacket-${sectionKey}`;


    const animationRun = () => {
      const el = document.getElementById(divId);
      if (!el) return;

      // clean up previous highlight
      cleanupRef.current?.();
      cleanupRef.current = null;

      // After panel opens, scroll + highlight
      scrollToWithOffset(el, NAVBAR_HEIGHT);

      // focus for accessibility without re-scrolling
      el.setAttribute('tabindex', '-1');
      try {
        (el as HTMLElement).focus({ preventScroll: true });
      } catch {
        (el as HTMLElement).focus();
      }

      cleanupRef.current = addTemporaryHighlight(el, 2600);
    };

    // wait for collapse animation/dom expansion
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(animationRun);
      // cleanup rAF 2 if effect re-runs quickly
      cleanupRef.current = () => cancelAnimationFrame(raf2);
    });

    return () => cancelAnimationFrame(raf1);
  }, [routerState, items, open, setOpen]);

  return (
    <Collapse
      className="compact"
      items={items}
      activeKey={deserializeKeys(open)}
      onChange={handleCollapseChange}
      ghost
    />
  );
});

PhenopacketOverview.displayName = 'PhenopacketOverview';
export default PhenopacketOverview;
