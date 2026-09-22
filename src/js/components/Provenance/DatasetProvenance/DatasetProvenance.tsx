import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import {
  AuditOutlined,
  BookOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  NumberOutlined,
  TagOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import type { Dataset } from '@/types/dataset';
import {
  FundingCard,
  LinkTile,
  LicenseTile,
  PersonCard,
  PublicationCard,
  ProvenanceSection,
  htmlSectionId,
} from './bits';
import IdentifiersSectionContent from './IdentifiersSectionContent';
import ProvenanceHeader from './ProvenanceHeader';
import ParticipantCriteriaSectionContent from './ParticipantCriteriaSectionContent';
import SideNav from './SideNav';
import SpatialCoverageSection from './SpatialCoverageSection';
import SummarySectionContent from './SummarySectionContent';
import type { ProvenanceEntry, SectionId } from './types';

const useProvenanceEntries = (dataset: Dataset | null | undefined): ProvenanceEntry[] => {
  const t = useTranslationFn();

  if (!dataset) return [];

  const links = dataset.links ?? [];
  const stakeholders = dataset.stakeholders ?? [];
  const publications = dataset.publications ?? [];
  const fundingSources = Array.isArray(dataset.funding_sources) ? dataset.funding_sources : [];
  const criteria = dataset.participant_criteria ?? [];
  const counts = dataset.counts ?? [];

  const hasLinks = links.length > 0;
  const hasContact = !!dataset.primary_contact;
  const hasStakeholders = stakeholders.length > 0;
  const hasPubs = publications.length > 0;
  const hasFunding = fundingSources.length > 0 || typeof dataset.funding_sources === 'string';
  const hasAccess = !!(dataset.license || dataset.privacy);
  const hasSpatial = !!dataset.spatial_coverage;
  const hasCriteria = criteria.length > 0;
  const hasCounts = counts.length > 0;

  return [
    {
      id: 'summary',
      icon: <UnorderedListOutlined aria-hidden />,
      children: <SummarySectionContent dataset={dataset} />,
    },
    ...(hasLinks
      ? [
          {
            id: 'links' as SectionId,
            icon: <LinkOutlined aria-hidden />,
            count: links.length,
            children: (
              <div className="pm-links-grid">
                {links.map((link) => (
                  <LinkTile key={link.url} link={link} />
                ))}
              </div>
            ),
          },
        ]
      : []),
    ...(hasContact
      ? [
          {
            id: 'primary_contact' as SectionId,
            icon: <UserOutlined aria-hidden />,
            children: (
              <div className="pm-pgrid">
                <PersonCard person={dataset.primary_contact} lead />
              </div>
            ),
          },
        ]
      : []),
    ...(hasStakeholders
      ? [
          {
            id: 'stakeholders' as SectionId,
            icon: <TeamOutlined aria-hidden />,
            count: stakeholders.length,
            children: (
              <div className="pm-pgrid">
                {stakeholders.map((s) => (
                  <PersonCard key={s.name} person={s} />
                ))}
              </div>
            ),
          },
        ]
      : []),
    ...(hasPubs
      ? [
          {
            id: 'publications' as SectionId,
            icon: <BookOutlined aria-hidden />,
            count: publications.length,
            children: (
              <div className="pm-publist">
                {publications.map((pub) => (
                  <PublicationCard key={pub.url} pub={pub} alwaysExpanded={publications.length === 1} />
                ))}
              </div>
            ),
          },
        ]
      : []),
    ...(hasFunding
      ? [
          {
            id: 'funding' as SectionId,
            icon: <DollarOutlined aria-hidden />,
            children:
              typeof dataset.funding_sources === 'string' ? (
                <p>{dataset.funding_sources}</p>
              ) : (
                <div className="pm-fgrid">
                  {fundingSources.map((fs, i) => (
                    // Deliberate strategy - no easily-computable natural key for funding sources
                    // eslint-disable-next-line react-x/no-array-index-key
                    <FundingCard key={i} source={fs} />
                  ))}
                </div>
              ),
          },
        ]
      : []),
    ...(hasAccess
      ? [
          {
            id: 'access' as SectionId,
            icon: <AuditOutlined aria-hidden />,
            children: (
              <div className="pm-meta-grid">
                {dataset.license && (
                  <div className="pm-field">
                    <span className="pm-field-k">{t('provenance.license')}</span>
                    <LicenseTile license={dataset.license} />
                  </div>
                )}
                {dataset.privacy && (
                  <div className="pm-field">
                    <span className="pm-field-k">{t('provenance.privacy')}</span>
                    <span className="pm-field-v">{dataset.privacy}</span>
                  </div>
                )}
              </div>
            ),
          },
        ]
      : []),
    ...(hasSpatial
      ? [
          {
            id: 'spatial' as SectionId,
            icon: <EnvironmentOutlined aria-hidden />,
            children: <SpatialCoverageSection spatialCoverage={dataset.spatial_coverage!} />,
          },
        ]
      : []),
    ...(hasCriteria
      ? [
          {
            id: 'criteria' as SectionId,
            icon: <InfoCircleOutlined aria-hidden />,
            count: criteria.length,
            children: <ParticipantCriteriaSectionContent criteria={criteria} />,
          },
        ]
      : []),
    ...(hasCounts
      ? [
          {
            id: 'counts' as SectionId,
            icon: <NumberOutlined aria-hidden />,
            count: counts.length,
            children: (
              <div className="pm-countgrid">
                {counts.map((c) => (
                  <div key={c.count_entity} className="pm-countcard">
                    <div className="pm-cc-num">{c.value.toLocaleString()}</div>
                    <div className="pm-cc-ent">{c.count_entity}</div>
                    {c.description && <div className="pm-cc-desc">{c.description}</div>}
                  </div>
                ))}
              </div>
            ),
          },
        ]
      : []),
    {
      id: 'identifiers',
      icon: <TagOutlined aria-hidden />,
      children: <IdentifiersSectionContent dataset={dataset} />,
    },
  ];
};

const DatasetProvenance = ({
  dataset,
  hideHeader,
  style,
  mode: modeParam = 'scroll',
}: {
  dataset?: Dataset | null;
  hideHeader?: boolean;
  style?: CSSProperties;
  mode?: 'scroll' | 'page';
}) => {
  const isSmallScreen = useSmallScreen();

  const [collapsed, setCollapsed] = useState<Set<SectionId>>(() => new Set());
  const [activeSection, setActiveSection] = useState<SectionId>('summary');

  const mode = isSmallScreen ? 'scroll' : modeParam;

  if (mode === 'page' && collapsed.size > 0) {
    // No section should be collapsed in page mode
    setCollapsed(new Set());
  }

  // Reset state when dataset changes (React "adjust state during render" pattern, avoids an effect)
  const [lastDatasetId, setLastDatasetId] = useState(dataset?.identifier);
  if (dataset?.identifier !== lastDatasetId) {
    setLastDatasetId(dataset?.identifier);
    setCollapsed(new Set());
    setActiveSection('summary');
  }

  const bodyRef = useRef<HTMLDivElement>(null);
  // Set true on click-to-jump; blocks scrollspy recalculation until a real user scroll gesture.
  const suppressSpyRef = useRef(false);

  // Scrollspy
  useEffect(() => {
    if (!bodyRef.current || mode !== 'scroll') return;
    const body = bodyRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressSpyRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection((entry.target as HTMLElement).dataset.section as SectionId);
          }
        }
      },
      { root: body, rootMargin: '-8% 0px -72% 0px' }
    );
    const secs = body.querySelectorAll<HTMLElement>('.pm-sec[id]');
    secs.forEach((el) => observer.observe(el));

    const clearSuppress = () => {
      suppressSpyRef.current = false;
    };
    body.addEventListener('wheel', clearSuppress, { passive: true });
    body.addEventListener('touchmove', clearSuppress, { passive: true });
    body.addEventListener('keydown', clearSuppress);

    return () => {
      observer.disconnect();
      body.removeEventListener('wheel', clearSuppress);
      body.removeEventListener('touchmove', clearSuppress);
      body.removeEventListener('keydown', clearSuppress);
    };
  }, [mode, dataset?.identifier]);

  const toggleCollapse = useCallback((id: SectionId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const jumpToSection = useCallback(
    (id: SectionId) => {
      const body = bodyRef.current;
      if (!body) return;
      // Explicitly only alter state if the actual mode param is scroll, not if the client has a small screen which has
      // forced a scroll mode.
      if (modeParam === 'scroll') {
        suppressSpyRef.current = true;
        setActiveSection(id);
        setCollapsed((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        const el = body.querySelector<HTMLElement>(`#${htmlSectionId(id)}`);
        if (el) {
          setTimeout(() => {
            body.scrollTo({ top: el.offsetTop - 6, behavior: 'smooth' });
          }, 0);
        }
      } else {
        setActiveSection(id);
      }
    },
    [modeParam]
  );

  const provenanceEntries = useProvenanceEntries(dataset);

  if (!dataset) return null;

  const isCollapsed = (id: SectionId) => collapsed.has(id);

  const renderProvenanceEntry = ({ id, count, children }: ProvenanceEntry) => (
    <ProvenanceSection
      key={id}
      sectionId={id}
      collapsed={isCollapsed(id)}
      onToggle={mode === 'scroll' ? () => toggleCollapse(id) : undefined}
      count={count}
    >
      {children}
    </ProvenanceSection>
  );

  return (
    <div className="prov-container" style={style}>
      {!hideHeader && <ProvenanceHeader dataset={dataset} />}

      <div className="pm-body" ref={bodyRef}>
        <SideNav
          navEntries={provenanceEntries}
          activeSection={activeSection}
          onJump={jumpToSection}
          mode={mode}
          hidden={isSmallScreen}
        />

        <div className="pm-content">
          {mode === 'scroll'
            ? provenanceEntries.map(renderProvenanceEntry)
            : renderProvenanceEntry(provenanceEntries.find((e) => e.id === activeSection)!)}
        </div>
      </div>
    </div>
  );
};

export default DatasetProvenance;
