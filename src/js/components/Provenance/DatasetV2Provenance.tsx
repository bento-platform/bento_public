import { Card, Descriptions, Flex, Tag, Typography } from 'antd';

import BaseProvenanceTable from './Tables/BaseProvenanceTable';
import { useTranslationFn } from '@/hooks';
import type {
  Count,
  DatasetV2,
  FundingSource,
  Link,
  OntologyClass,
  ParticipantCriteria,
  Person,
  PersonOrOrganization,
  Publication,
} from '@/types/datasetV2';

const { Item } = Descriptions;
const { Paragraph, Text, Title } = Typography;

// ---- Helpers ----

const keywordLabel = (k: string | OntologyClass): string => (typeof k === 'string' ? k : k.label);

const SectionTitle = ({ title }: { title: string }) => {
  const t = useTranslationFn();
  return (
    <Title level={4} style={{ paddingTop: '20px' }}>
      {t(title)}
    </Title>
  );
};

const DescLabel = ({ title }: { title: string }) => <b>{title}</b>;

// ---- Long description ----

const LongDescriptionBlock = ({ content, content_type }: DatasetV2['long_description'] & object) => {
  if (content_type === 'text/html') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <Paragraph>{content}</Paragraph>;
};

// ---- PersonOrOrganization display ----

const personName = (p: PersonOrOrganization): string => p.name;

const StakeholdersTable = ({ stakeholders }: { stakeholders: PersonOrOrganization[] }) => {
  const t = useTranslationFn();
  return (
    <BaseProvenanceTable
      dataSource={stakeholders}
      rowKey="name"
      columns={[
        {
          title: t('Name'),
          key: 'name',
          render: (_, row) => (
            <>
              {personName(row)}
              {row.type === 'person' && (row as Person).orcid && (
                <Text type="secondary" style={{ marginLeft: 8, fontSize: '0.85em' }}>
                  ORCID: {(row as Person).orcid}
                </Text>
              )}
            </>
          ),
        },
        {
          title: t('Type'),
          key: 'type',
          render: (_, row) => t(row.type === 'person' ? 'Person' : 'Organization'),
        },
        {
          title: t('Roles'),
          key: 'roles',
          render: (_, row) =>
            row.roles.map((r, i) => (
              <Tag key={i} color="cyan">
                {t(r)}
              </Tag>
            )),
        },
      ]}
    />
  );
};

// ---- Publications ----

const PublicationsTableV2 = ({ publications }: { publications: Publication[] }) => {
  const t = useTranslationFn();
  return (
    <BaseProvenanceTable
      dataSource={publications}
      rowKey="title"
      columns={[
        {
          title: t('Title'),
          key: 'title',
          render: (_, pub) => (
            <a href={pub.url} target="_blank" rel="noreferrer">
              {pub.title}
            </a>
          ),
        },
        {
          title: t('Type'),
          dataIndex: 'publication_type',
          key: 'publication_type',
          render: (pt) => t(typeof pt === 'string' ? pt : pt.other),
        },
        {
          title: t('DOI'),
          dataIndex: 'doi',
          key: 'doi',
          render: (doi) =>
            doi ? (
              <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer">
                {doi}
              </a>
            ) : null,
        },
        {
          title: t('Date'),
          dataIndex: 'publication_date',
          key: 'publication_date',
        },
        {
          title: t('Authors'),
          key: 'authors',
          render: (_, pub) => pub.authors?.map(personName).join(', ') ?? null,
        },
      ]}
    />
  );
};

// ---- Funding sources ----

const FundingTable = ({ funding }: { funding: (FundingSource | Link)[] }) => {
  const t = useTranslationFn();
  return (
    <BaseProvenanceTable
      dataSource={funding}
      rowKey={(row, i) => i ?? 0}
      columns={[
        {
          title: t('Funder / Link'),
          key: 'funder',
          render: (_, row) => {
            if ('url' in row && 'label' in row) {
              // Link
              return (
                <a href={(row as Link).url} target="_blank" rel="noreferrer">
                  {(row as Link).label}
                </a>
              );
            }
            const fs = row as FundingSource;
            if (!fs.funder) return null;
            return typeof fs.funder === 'string' ? fs.funder : personName(fs.funder);
          },
        },
        {
          title: t('Grant Numbers'),
          key: 'grant_numbers',
          render: (_, row) => {
            if ('grant_numbers' in row) {
              return (row as FundingSource).grant_numbers?.join(', ') ?? null;
            }
            return null;
          },
        },
      ]}
    />
  );
};

// ---- Participant criteria ----

const CriteriaTable = ({ criteria }: { criteria: ParticipantCriteria[] }) => {
  const t = useTranslationFn();
  return (
    <BaseProvenanceTable
      dataSource={criteria}
      rowKey="description"
      columns={[
        {
          title: t('Type'),
          dataIndex: 'type',
          key: 'type',
          width: 120,
          render: (type) => t(type),
        },
        {
          title: t('Description'),
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: t('Link'),
          dataIndex: 'link',
          key: 'link',
          render: (link) =>
            link ? (
              <a href={link} target="_blank" rel="noreferrer">
                {link}
              </a>
            ) : null,
        },
      ]}
    />
  );
};

// ---- Descriptive counts ----

const CountsTable = ({ counts }: { counts: Count[] }) => {
  const t = useTranslationFn();
  return (
    <BaseProvenanceTable
      dataSource={counts}
      rowKey="count_entity"
      columns={[
        { title: t('Entity'), dataIndex: 'count_entity', key: 'count_entity' },
        { title: t('Value'), dataIndex: 'value', key: 'value' },
        { title: t('Description'), dataIndex: 'description', key: 'description' },
      ]}
    />
  );
};

// ---- Extra properties ----

const ExtraPropertiesTableV2 = ({ extra }: { extra: DatasetV2['extra_properties'] }) => {
  const t = useTranslationFn();
  if (!extra) return null;
  const rows = Object.entries(extra).map(([k, v]) => ({ key: k, value: String(v ?? '') }));
  return (
    <BaseProvenanceTable
      dataSource={rows}
      rowKey="key"
      columns={[
        { title: t('Key'), dataIndex: 'key', key: 'key' },
        { title: t('Value'), dataIndex: 'value', key: 'value' },
      ]}
    />
  );
};

// ---- Main content ----

export const DatasetV2ProvenanceContent = ({ dataset }: { dataset: DatasetV2 }) => {
  const t = useTranslationFn();

  const keywords = dataset.keywords ?? [];
  const taxa = dataset.taxa ?? [];
  const stakeholders = dataset.stakeholders ?? [];
  const publications = dataset.publications ?? [];
  const fundingSources = Array.isArray(dataset.funding_sources) ? dataset.funding_sources : [];
  const criteria = dataset.participant_criteria ?? [];
  const counts = dataset.counts ?? [];
  const links = dataset.links ?? [];

  return (
    <>
      {/* Description */}
      {dataset.long_description ? (
        <LongDescriptionBlock {...dataset.long_description} />
      ) : (
        <Text italic>{t(dataset.description)}</Text>
      )}

      {/* Quick-facts descriptions block */}
      {(dataset.privacy ||
        dataset.license ||
        dataset.version ||
        dataset.study_status ||
        dataset.study_context ||
        keywords.length > 0 ||
        taxa.length > 0) && (
        <Descriptions style={{ paddingTop: '20px' }}>
          {dataset.privacy && (
            <Item span={12} label={<DescLabel title={t('Privacy')} />}>
              {t(dataset.privacy)}
            </Item>
          )}
          {dataset.version && (
            <Item span={12} label={<DescLabel title={t('Version')} />}>
              {dataset.version}
            </Item>
          )}
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
          {dataset.study_status && (
            <Item span={12} label={<DescLabel title={t('Study Status')} />}>
              {t(dataset.study_status)}
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
          {taxa.length > 0 && (
            <Item span={24} label={<DescLabel title={t('Taxa')} />}>
              {taxa.map((k, i) => (
                <Tag key={i} color="geekblue">
                  {t(keywordLabel(k))}
                </Tag>
              ))}
            </Item>
          )}
          {keywords.length > 0 && (
            <Item span={24} label={<DescLabel title={t('Keywords')} />}>
              {keywords.map((k, i) => (
                <Tag key={i} color="cyan">
                  {t(keywordLabel(k))}
                </Tag>
              ))}
            </Item>
          )}
        </Descriptions>
      )}

      {/* Release / modified dates */}
      {(dataset.release_date || dataset.last_modified) && (
        <Descriptions style={{ paddingTop: '8px' }}>
          {dataset.release_date && (
            <Item span={12} label={<DescLabel title={t('Release Date')} />}>
              {dataset.release_date}
            </Item>
          )}
          {dataset.last_modified && (
            <Item span={12} label={<DescLabel title={t('Last Modified')} />}>
              {dataset.last_modified}
            </Item>
          )}
        </Descriptions>
      )}

      {/* Spatial coverage */}
      {dataset.spatial_coverage && (
        <Descriptions style={{ paddingTop: '8px' }}>
          <Item span={24} label={<DescLabel title={t('Spatial Coverage')} />}>
            {typeof dataset.spatial_coverage === 'string'
              ? dataset.spatial_coverage
              : dataset.spatial_coverage.properties.name}
          </Item>
        </Descriptions>
      )}

      {/* Primary contact */}
      {dataset.primary_contact && (
        <>
          <SectionTitle title="Primary Contact" />
          <StakeholdersTable stakeholders={[dataset.primary_contact]} />
        </>
      )}

      {/* Stakeholders */}
      {stakeholders.length > 0 && (
        <>
          <SectionTitle title="Stakeholders" />
          <StakeholdersTable stakeholders={stakeholders} />
        </>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <>
          <SectionTitle title="Publications" />
          <PublicationsTableV2 publications={publications} />
        </>
      )}

      {/* Funding */}
      {fundingSources.length > 0 && (
        <>
          <SectionTitle title="Funding" />
          <FundingTable funding={fundingSources} />
        </>
      )}

      {typeof dataset.funding_sources === 'string' && dataset.funding_sources && (
        <>
          <SectionTitle title="Funding" />
          <Paragraph>{dataset.funding_sources}</Paragraph>
        </>
      )}

      {/* Participant criteria */}
      {criteria.length > 0 && (
        <>
          <SectionTitle title="Participant Criteria" />
          <CriteriaTable criteria={criteria} />
        </>
      )}

      {/* Counts */}
      {counts.length > 0 && (
        <>
          <SectionTitle title="Counts" />
          <CountsTable counts={counts} />
        </>
      )}

      {/* Links */}
      {links.length > 0 && (
        <>
          <SectionTitle title="Links" />
          <Flex wrap gap={8} style={{ paddingTop: 8 }}>
            {links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </Flex>
        </>
      )}

      {/* Extra properties */}
      {dataset.extra_properties && Object.keys(dataset.extra_properties).length > 0 && (
        <>
          <SectionTitle title="Extra Properties" />
          <ExtraPropertiesTableV2 extra={dataset.extra_properties} />
        </>
      )}
    </>
  );
};

// ---- Card wrapper (used on dedicated provenance page) ----

export type DatasetV2ProvenanceProps = {
  dataset: DatasetV2;
  loading?: boolean;
  showTitle?: boolean;
};

const DatasetV2Provenance = ({ dataset, loading, showTitle = true }: DatasetV2ProvenanceProps) => {
  const t = useTranslationFn();

  const version = dataset.version ? (
    <Title key="version" level={4} type="secondary" italic>
      {dataset.version}
    </Title>
  ) : null;

  return (
    <div className="container margin-auto">
      <Card
        title={showTitle ? <Title level={3}>{t(dataset.title)}</Title> : undefined}
        extra={showTitle && version ? [version] : undefined}
        className="shadow rounded-xl"
        loading={loading}
      >
        {!showTitle && version ? version : null}
        <DatasetV2ProvenanceContent dataset={dataset} />
      </Card>
    </div>
  );
};

export default DatasetV2Provenance;
