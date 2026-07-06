import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

import type { Dataset } from '@/types/dataset';
import { FundingCard, LinkTile, LicenseTile, PersonCard, PublicationCard, SectionHead } from './cards';
import IdentifiersSection from './IdentifiersSection';
import ModalHeader from './ModalHeader';
import ParticipantCriteriaSection from './ParticipantCriteriaSection';
import SideNav from './SideNav';
import SpatialCoverageSection from './SpatialCoverageSection';
import SummarySection from './SummarySection';
import type { NavEntry, SectionId } from './types';

type DatasetProvenanceModalProps = {
  dataset: Dataset | null | undefined;
  open: boolean;
  onCancel: () => void;
};

const DatasetProvenanceModal = ({ dataset, open, onCancel }: DatasetProvenanceModalProps) => {
  const [collapsed, setCollapsed] = useState<Set<SectionId>>(new Set());
  const [activeSection, setActiveSection] = useState<SectionId>('summary');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: '', show: false });

  const bodyRef = useRef<HTMLDivElement>(null);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Reset state when dataset changes
  useEffect(() => {
    setCollapsed(new Set());
    setActiveSection('summary');
  }, [dataset?.identifier]);

  // Scrollspy
  useEffect(() => {
    if (!open || !bodyRef.current) return;
    const body = bodyRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      { root: body, rootMargin: '-8% 0px -72% 0px' },
    );
    const secs = body.querySelectorAll<HTMLElement>('.pm-sec[id]');
    secs.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [open, dataset?.identifier]);

  const toggleCollapse = useCallback((id: SectionId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleCopy = useCallback((value: string, id: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(id);
      setToast({ text: `Copied: ${value}`, show: true });
      setTimeout(() => setCopiedKey(null), 1300);
      setTimeout(() => setToast((p) => ({ ...p, show: false })), 1600);
    });
  }, []);

  const jumpToSection = useCallback((id: SectionId) => {
    const body = bodyRef.current;
    if (!body) return;
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
  }, []);

  if (!open || !dataset) return null;

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

  const navEntries: NavEntry[] = [
    { id: 'summary', label: 'Summary', icon: <UnorderedListOutlined /> },
    ...(hasLinks ? [{ id: 'links' as SectionId, label: 'Links & Resources', icon: <LinkOutlined />, count: links.length }] : []),
    ...(hasContact ? [{ id: 'contact' as SectionId, label: 'Primary Contact', icon: <UserOutlined /> }] : []),
    ...(hasStakeholders ? [{ id: 'stakeholders' as SectionId, label: 'Stakeholders', icon: <TeamOutlined />, count: stakeholders.length }] : []),
    ...(hasPubs ? [{ id: 'publications' as SectionId, label: 'Publications', icon: <BookOutlined />, count: publications.length }] : []),
    ...(hasFunding ? [{ id: 'funding' as SectionId, label: 'Funding', icon: <DollarOutlined /> }] : []),
    ...(hasAccess ? [{ id: 'access' as SectionId, label: 'Access & License', icon: <AuditOutlined /> }] : []),
    ...(hasSpatial ? [{ id: 'spatial' as SectionId, label: 'Spatial Coverage', icon: <EnvironmentOutlined /> }] : []),
    ...(hasCriteria ? [{ id: 'criteria' as SectionId, label: 'Participant Criteria', icon: <InfoCircleOutlined />, count: criteria.length }] : []),
    ...(hasCounts ? [{ id: 'counts' as SectionId, label: 'Counts', icon: <NumberOutlined />, count: counts.length }] : []),
    { id: 'identifiers', label: 'Identifiers', icon: <TagOutlined /> },
  ];

  const isCollapsed = (id: SectionId) => collapsed.has(id);

  const modal = (
    <div className="pm-scrim" onClick={onCancel}>
      <div
        className="pm-modal"
        role="dialog"
        aria-label="Dataset provenance"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          dataset={dataset}
          copiedKey={copiedKey}
          onCopy={handleCopy}
          onClose={onCancel}
        />

        <div className="pm-body" ref={bodyRef}>
          <SideNav navEntries={navEntries} activeSection={activeSection} onJump={jumpToSection} />

          <div className="pm-content">
            <SummarySection
              dataset={dataset}
              collapsed={isCollapsed('summary')}
              onToggle={() => toggleCollapse('summary')}
            />

            {hasLinks && (
              <section id="links" className={`pm-sec${isCollapsed('links') ? ' collapsed' : ''}`}>
                <SectionHead
                  title="Links & Resources"
                  count={links.length}
                  collapsed={isCollapsed('links')}
                  onToggle={() => toggleCollapse('links')}
                />
                <div className="pm-sec-body">
                  <div className="pm-links-grid">
                    {links.map((link, i) => <LinkTile key={i} link={link} />)}
                  </div>
                </div>
              </section>
            )}

            {hasContact && (
              <section id="contact" className={`pm-sec${isCollapsed('contact') ? ' collapsed' : ''}`}>
                <SectionHead
                  title="Primary Contact"
                  collapsed={isCollapsed('contact')}
                  onToggle={() => toggleCollapse('contact')}
                />
                <div className="pm-sec-body">
                  <div className="pm-pgrid">
                    <PersonCard
                      person={dataset.primary_contact}
                      idx={0}
                      lead
                      copiedKey={copiedKey}
                      onCopy={handleCopy}
                    />
                  </div>
                </div>
              </section>
            )}

            {hasStakeholders && (
              <section id="stakeholders" className={`pm-sec${isCollapsed('stakeholders') ? ' collapsed' : ''}`}>
                <SectionHead
                  title="Stakeholders"
                  count={stakeholders.length}
                  collapsed={isCollapsed('stakeholders')}
                  onToggle={() => toggleCollapse('stakeholders')}
                />
                <div className="pm-sec-body">
                  <div className="pm-pgrid">
                    {stakeholders.map((s, i) => (
                      <PersonCard key={i} person={s} idx={i + 1} copiedKey={copiedKey} onCopy={handleCopy} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {hasPubs && (
              <section id="publications" className={`pm-sec${isCollapsed('publications') ? ' collapsed' : ''}`}>
                <SectionHead
                  title="Publications"
                  count={publications.length}
                  collapsed={isCollapsed('publications')}
                  onToggle={() => toggleCollapse('publications')}
                />
                <div className="pm-sec-body">
                  <div className="pm-publist">
                    {publications.map((pub, i) => (
                      <PublicationCard key={i} pub={pub} idx={i} copiedKey={copiedKey} onCopy={handleCopy} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {hasFunding && (
              <section id="funding" className={`pm-sec${isCollapsed('funding') ? ' collapsed' : ''}`}>
                <SectionHead
                  title="Funding"
                  collapsed={isCollapsed('funding')}
                  onToggle={() => toggleCollapse('funding')}
                />
                <div className="pm-sec-body">
                  {typeof dataset.funding_sources === 'string' ? (
                    <p>{dataset.funding_sources}</p>
                  ) : (
                    <div className="pm-fgrid">
                      {fundingSources.map((fs, i) => <FundingCard key={i} source={fs} idx={i} />)}
                    </div>
                  )}
                </div>
              </section>
            )}

            {hasAccess && (
              <section id="access" className={`pm-sec${isCollapsed('access') ? ' collapsed' : ''}`}>
                <SectionHead
                  title="Access & License"
                  collapsed={isCollapsed('access')}
                  onToggle={() => toggleCollapse('access')}
                />
                <div className="pm-sec-body">
                  <div className="pm-meta-grid">
                    {dataset.license && (
                      <div className="pm-field">
                        <span className="pm-field-k">License</span>
                        <LicenseTile license={dataset.license} />
                      </div>
                    )}
                    {dataset.privacy && (
                      <div className="pm-field">
                        <span className="pm-field-k">Privacy</span>
                        <span className="pm-field-v">{dataset.privacy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {hasSpatial && (
              <SpatialCoverageSection
                spatialCoverage={dataset.spatial_coverage!}
                collapsed={isCollapsed('spatial')}
                onToggle={() => toggleCollapse('spatial')}
              />
            )}

            {hasCriteria && (
              <ParticipantCriteriaSection
                criteria={criteria}
                collapsed={isCollapsed('criteria')}
                onToggle={() => toggleCollapse('criteria')}
              />
            )}

            {hasCounts && (
              <section id="counts" className={`pm-sec${isCollapsed('counts') ? ' collapsed' : ''}`}>
                <SectionHead
                  title="Counts"
                  count={counts.length}
                  collapsed={isCollapsed('counts')}
                  onToggle={() => toggleCollapse('counts')}
                />
                <div className="pm-sec-body">
                  <div className="pm-countgrid">
                    {counts.map((c, i) => (
                      <div key={i} className="pm-countcard">
                        <div className="pm-cc-num">{c.value.toLocaleString()}</div>
                        <div className="pm-cc-ent">{c.count_entity}</div>
                        {c.description && <div className="pm-cc-desc">{c.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <IdentifiersSection
              dataset={dataset}
              collapsed={isCollapsed('identifiers')}
              onToggle={() => toggleCollapse('identifiers')}
            />
          </div>
        </div>

        <div className={`pm-toast${toast.show ? ' show' : ''}`}>
          <CheckOutlined style={{ color: '#73D13D' }} />
          {toast.text}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default DatasetProvenanceModal;
