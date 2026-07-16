import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import {
  AuditOutlined,
  BookOutlined,
  CheckOutlined,
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

import type { Dataset } from '@/types/dataset';
import { FundingCard, LinkTile, LicenseTile, PersonCard, PublicationCard, ProvenanceSection } from './cards';
import IdentifiersSectionContent from './IdentifiersSectionContent';
import ProvenanceHeader from './ProvenanceHeader';
import ParticipantCriteriaSectionContent from './ParticipantCriteriaSectionContent';
import SideNav from './SideNav';
import SpatialCoverageSection from './SpatialCoverageSection';
import SummarySectionContent from './SummarySectionContent';
import type { ProvenanceEntry, SectionId } from './types';

const useProvenanceEntries = (
  dataset: Dataset | null | undefined,
  copiedKey: string | null,
  handleCopy: (value: string, id: string) => void
): ProvenanceEntry[] => {
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
      icon: <UnorderedListOutlined />,
      children: <SummarySectionContent dataset={dataset} />,
    },
    ...(hasLinks
      ? [
          {
            id: 'links' as SectionId,
            icon: <LinkOutlined />,
            count: links.length,
            children: (
              <div className="pm-links-grid">
                {links.map((link, i) => (
                  <LinkTile key={i} link={link} />
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
            icon: <UserOutlined />,
            children: (
              <div className="pm-pgrid">
                <PersonCard person={dataset.primary_contact} idx={0} lead copiedKey={copiedKey} onCopy={handleCopy} />
              </div>
            ),
          },
        ]
      : []),
    ...(hasStakeholders
      ? [
          {
            id: 'stakeholders' as SectionId,
            icon: <TeamOutlined />,
            count: stakeholders.length,
            children: (
              <div className="pm-pgrid">
                {stakeholders.map((s, i) => (
                  <PersonCard key={i} person={s} idx={i + 1} copiedKey={copiedKey} onCopy={handleCopy} />
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
            icon: <BookOutlined />,
            count: publications.length,
            children: (
              <div className="pm-publist">
                {publications.map((pub, i) => (
                  <PublicationCard
                    key={i}
                    pub={pub}
                    idx={i}
                    copiedKey={copiedKey}
                    onCopy={handleCopy}
                    alwaysExpanded={publications.length === 1}
                  />
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
            icon: <DollarOutlined />,
            children:
              typeof dataset.funding_sources === 'string' ? (
                <p>{dataset.funding_sources}</p>
              ) : (
                <div className="pm-fgrid">
                  {fundingSources.map((fs, i) => (
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
            icon: <AuditOutlined />,
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
            icon: <EnvironmentOutlined />,
            children: <SpatialCoverageSection spatialCoverage={dataset.spatial_coverage!} />,
          },
        ]
      : []),
    ...(hasCriteria
      ? [
          {
            id: 'criteria' as SectionId,
            icon: <InfoCircleOutlined />,
            count: criteria.length,
            children: <ParticipantCriteriaSectionContent criteria={criteria} />,
          },
        ]
      : []),
    ...(hasCounts
      ? [
          {
            id: 'counts' as SectionId,
            icon: <NumberOutlined />,
            count: counts.length,
            children: (
              <div className="pm-countgrid">
                {counts.map((c, i) => (
                  <div key={i} className="pm-countcard">
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
      icon: <TagOutlined />,
      children: <IdentifiersSectionContent dataset={dataset} copiedKey={copiedKey} onCopy={handleCopy} />,
    },
  ];
};

const DatasetProvenance = ({
  dataset,
  hideHeader,
  style,
  mode = 'scroll',
}: {
  dataset?: Dataset | null;
  hideHeader?: boolean;
  style?: CSSProperties;
  mode?: 'scroll' | 'page';
}) => {
  const t = useTranslationFn();

  const [collapsed, setCollapsed] = useState<Set<SectionId>>(new Set());
  const [activeSection, setActiveSection] = useState<SectionId>('summary');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: '', show: false });

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
            setActiveSection(entry.target.id as SectionId);
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

  const handleCopy = useCallback(
    (value: string, id: string) => {
      navigator.clipboard.writeText(value).then(() => {
        setCopiedKey(id);
        setToast({ text: `${t('general.copied')}: ${value}`, show: true });
        setTimeout(() => setCopiedKey(null), 1300);
        setTimeout(() => setToast((p) => ({ ...p, show: false })), 1600);
      });
    },
    [t]
  );

  const jumpToSection = useCallback(
    (id: SectionId) => {
      const body = bodyRef.current;
      if (!body) return;
      if (mode === 'scroll') {
        suppressSpyRef.current = true;
        setActiveSection(id);
        setCollapsed((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        const el = body.querySelector<HTMLElement>(`#${id}`);
        if (el) {
          setTimeout(() => {
            body.scrollTo({ top: el.offsetTop - 6, behavior: 'smooth' });
          }, 0);
        }
      } else {
        setActiveSection(id);
      }
    },
    [mode]
  );

  const provenanceEntries = useProvenanceEntries(dataset, copiedKey, handleCopy);

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
      {!hideHeader && <ProvenanceHeader dataset={dataset} copiedKey={copiedKey} onCopy={handleCopy} />}

      <div className="pm-body" ref={bodyRef}>
        <SideNav navEntries={provenanceEntries} activeSection={activeSection} onJump={jumpToSection} mode={mode} />

        <div className="pm-content">
          {mode === 'scroll'
            ? provenanceEntries.map(renderProvenanceEntry)
            : renderProvenanceEntry(provenanceEntries.find((e) => e.id === activeSection)!)}
        </div>
      </div>

      <div className={`pm-toast${toast.show ? ' show' : ''}`}>
        <CheckOutlined style={{ color: '#73D13D' }} />
        {toast.text}
      </div>
    </div>
  );
};

export default DatasetProvenance;
