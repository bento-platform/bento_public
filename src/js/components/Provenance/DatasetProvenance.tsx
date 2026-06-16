import { type ReactNode, useMemo } from 'react';
import type { DescriptionsItemType } from 'antd/es/descriptions';
import { Button, Card, Descriptions, Flex, Tag, Typography } from 'antd';
import { CalendarOutlined, DownOutlined, FileProtectOutlined, TagOutlined, UpOutlined } from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';

import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
import CountsDisplay from './CountsDisplay';
import FundingDisplay from './FundingDisplay';
import LinksDisplay from './LinksDisplay';
import ParticipantCriteriaDisplay from './ParticipantCriteriaDisplay';
import PersonOrOrganizationDisplay from './PersonOrOrganizationDisplay';
import PublicationsDisplay from './PublicationsDisplay';
import SpatialCoverageDisplay from './SpatialCoverageDisplay';
import TagDisplay from './TagDisplay';

const { Item } = Descriptions;
const { Paragraph, Title } = Typography;

type Section = { title: string; children: ReactNode };

// ---- Helpers ----

const SectionTitle = ({ title }: { title: string }) => {
  const t = useTranslationFn();
  return <Title level={4}>{t(title)}</Title>;
};

const DescLabel = ({ title }: { title: string }) => <strong>{title}</strong>;

// ---- Long description ----

const LongDescriptionBlock = ({ content, content_type }: Dataset['long_description'] & object) => {
  if (content_type === 'text/html') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <Paragraph>{content}</Paragraph>;
};

// ---- Main content ----

export const DatasetProvenanceContent = ({
  dataset,
  collapsed,
  onToggleCollapsed,
}: {
  dataset: Dataset;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) => {
  const t = useTranslationFn();

  const domains = dataset.domain ?? [];
  const keywords = dataset.keywords ?? [];
  const taxa = dataset.taxa ?? [];
  const links = dataset.links ?? [];
  const studyStatus = dataset.study_status?.toLocaleUpperCase();

  const subtitleItems: { icon: ReactNode; key: keyof Dataset }[] = [
    { icon: <TagOutlined />, key: 'version' },
    { icon: <CalendarOutlined />, key: 'release_date' },
    { icon: <CalendarOutlined />, key: 'last_modified' },
    { icon: <FileProtectOutlined />, key: 'privacy' },
  ];

  const keywordLikeItems: DescriptionsItemType[] = [];

  if (domains.length > 0) {
    keywordLikeItems.push({
      span: 'filled',
      label: <DescLabel title={t('dataset.domain', { count: domains.length })} />,
      children: <TagDisplay tags={domains} color="purple" />,
    } as DescriptionsItemType);
  }

  if (keywords.length > 0) {
    keywordLikeItems.push({
      span: 'filled',
      label: <DescLabel title={t('dataset.keywords')} />,
      children: <TagDisplay tags={keywords} color="cyan" />,
    } as DescriptionsItemType);
  }

  if (taxa.length > 0) {
    keywordLikeItems.push({
      span: 'filled',
      label: <DescLabel title={t('dataset.taxon', { count: taxa.length })} />,
      children: (
        <TagDisplay
          tags={taxa}
          color="blue"
          tagClass={(k) => {
            const label = typeof k === 'string' ? k : k.label;
            // Make taxon label italic only if it looks like a species/species+subspecies name (X y or X y z)
            return label.split(' ').length >= 2 ? 'italic' : '';
          }}
        />
      ),
    } as DescriptionsItemType);
  }

  // Assemble sections that are only shown in a fully-expanded provenance view:

  const fullViewSections: Section[] = useMemo(() => {
    const stakeholders = dataset.stakeholders ?? [];
    const publications = dataset.publications ?? [];
    const funding = dataset.funding_sources;
    const criteria = dataset.participant_criteria ?? [];
    const counts = dataset.counts ?? [];

    const res: Section[] = [];

    //  - Primary contact
    if (dataset.primary_contact) {
      res.push({
        title: 'Primary Contact',
        children: <PersonOrOrganizationDisplay entity={dataset.primary_contact} />,
      });
    }

    //  - Stakeholders
    if (stakeholders.length > 0) {
      res.push({
        title: 'Stakeholders',
        children: (
          <Flex gap={16} wrap>
            {stakeholders.map((s) => (
              <PersonOrOrganizationDisplay key={s.name} entity={s} />
            ))}
          </Flex>
        ),
      });
    }

    //  - Publications
    if (publications.length > 0) {
      res.push({
        title: 'Publications',
        children: <PublicationsDisplay publications={publications} />,
      });
    }

    //  - Funding
    if (funding) {
      res.push({
        title: 'Funding',
        children: <FundingDisplay funding={funding} />,
      });
    }

    //  - Spatial coverage
    if (dataset.spatial_coverage) {
      res.push({
        title: 'Spatial Coverage',
        children: <SpatialCoverageDisplay spatialCoverage={dataset.spatial_coverage} />,
      });
    }

    //  - Participant criteria
    if (dataset.participant_criteria) {
      res.push({
        title: 'Participant Criteria',
        children: <ParticipantCriteriaDisplay criteria={criteria} />,
      });
    }

    //  - Counts
    if (counts.length > 0) {
      res.push({
        title: 'Counts',
        children: <CountsDisplay counts={counts} />,
      });
    }

    //  - Extra properties
    if (dataset.extra_properties && Object.keys(dataset.extra_properties).length > 0) {
      res.push({
        title: 'Extra Properties',
        children: <ExtraPropertiesDisplay extraProperties={dataset.extra_properties} />,
      });
    }

    return res;
  }, [dataset]);

  return (
    <div className="dataset-provenance">
      <Flex gap="middle" style={{ marginBottom: 8 }}>
        <Title level={2} className="mb-0" style={{ fontWeight: 500, fontSize: '1.5rem' }}>
          {dataset.title}
        </Title>
        {!!dataset.study_status && (
          <Tag
            color="orange"
            style={{ alignSelf: 'center' }}
            title={`${t('dataset.study_status')}: ${t('dataset.' + studyStatus)}`}
          >
            {dataset.study_status}
          </Tag>
        )}
      </Flex>
      <ul className="attributes">
        {subtitleItems
          .filter(({ key }) => !!dataset[key])
          .map(({ icon, key }) => (
            <li key={key}>
              <strong>
                {icon} {t(`dataset.${key}`)}:
              </strong>{' '}
              {t(dataset[key] as unknown as string, { nsSeparator: false })}
            </li>
          ))}
      </ul>

      {/* Domains/keywords/taxa ('keyword-like' concepts) descriptions block */}
      {!!keywordLikeItems.length && <Descriptions items={keywordLikeItems} size="small" />}

      {/* Description - impose a maximum width to keep it readable (without very long lines) */}
      <div style={{ maxWidth: 1100, marginTop: keywords.length || taxa.length ? 16 : 0 }}>
        {dataset.long_description ? (
          <LongDescriptionBlock {...dataset.long_description} />
        ) : (
          <Paragraph>{t(dataset.description)}</Paragraph>
        )}
      </div>

      {!!links.length && (
        <Descriptions
          items={[{ label: <DescLabel title={t('dataset.links')} />, children: <LinksDisplay links={links} /> }]}
        />
      )}

      {/* Quick-facts descriptions block */}
      {(dataset.license || dataset.study_context) && (
        <Descriptions>
          {dataset.license && (
            <Item span={12} label={<DescLabel title={t('License')} />}>
              {dataset.license.url ? (
                <a href={dataset.license.url} target="_blank" rel="noreferrer">
                  {dataset.license.label}
                </a>
              ) : (
                dataset.license.label
              )}
            </Item>
          )}
          {dataset.study_context && (
            <Item span={12} label={<DescLabel title={t('Study Context')} />}>
              {t(dataset.study_context)}
            </Item>
          )}
          {dataset.program_name && (
            <Item span={12} label={<DescLabel title={t('Program')} />}>
              {dataset.program_name}
            </Item>
          )}
          {dataset.domain?.length ? (
            <Item span={24} label={<DescLabel title={t('Domain')} />}>
              {dataset.domain.join(', ')}
            </Item>
          ) : null}
        </Descriptions>
      )}

      {!!links.length && (
        <div style={{ marginTop: 20 }}>
          <SectionTitle title="Links" />
          <LinksDisplay links={links} />
        </div>
      )}

      {fullViewSections.length > 0 &&
        (!collapsed ? (
          <Flex vertical gap={20} style={{ marginTop: 20 }}>
            {fullViewSections.map(({ title, children }) => (
              <div key={title}>
                <SectionTitle title={title} />
                {children}
              </div>
            ))}

            {onToggleCollapsed ? (
              <Flex style={{ marginTop: 16 }}>
                <Button onClick={onToggleCollapsed} icon={<UpOutlined />}>
                  Collapse
                </Button>
              </Flex>
            ) : null}
          </Flex>
        ) : onToggleCollapsed ? (
          <Flex style={{ marginTop: 16 }}>
            <Button onClick={onToggleCollapsed} icon={<DownOutlined />}>
              Expand
            </Button>
          </Flex>
        ) : null)}
    </div>
  );
};

// ---- Card wrapper (used on dedicated provenance page) ----

export type DatasetProvenanceProps = {
  dataset: Dataset;
  loading?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

const DatasetProvenance = ({ dataset, loading, collapsed, onToggleCollapse }: DatasetProvenanceProps) => {
  return (
    <Card className="shadow rounded-xl dataset-provenance-card" loading={loading}>
      <DatasetProvenanceContent dataset={dataset} collapsed={collapsed} onToggleCollapsed={onToggleCollapse} />
    </Card>
  );
};

export default DatasetProvenance;
