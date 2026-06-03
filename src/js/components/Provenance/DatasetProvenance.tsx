import type { ReactNode } from 'react';
import { Button, Card, Descriptions, Flex, Tag, Typography } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PointMap } from 'bento-charts/dist/maps';

import BaseProvenanceTable from './Tables/BaseProvenanceTable';
import { useTranslationFn } from '@/hooks';
import type {
  Count,
  Dataset,
  FundingSource,
  Link,
  ParticipantCriteria,
  Person,
  PersonOrOrganization,
  Publication,
} from '@/types/dataset';

import type { OntologyTerm } from '@/types/ontology';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
import LinksDisplay from './LinksDisplay';
import PublicationsDisplay from './PublicationsDisplay';
import PersonOrOrganizationDisplay, { PersonOrOrganizationName } from './PersonOrOrganizationDisplay';

const { Item } = Descriptions;
const { Paragraph, Text, Title } = Typography;

// ---- Helpers ----

const keywordLabel = (k: string | OntologyTerm): string => (typeof k === 'string' ? k : k.label);

const SectionTitle = ({ title }: { title: string }) => {
  const t = useTranslationFn();
  return (
    <Title level={4} style={{ marginTop: '20px' }}>
      {t(title)}
    </Title>
  );
};

const DescLabel = ({ title }: { title: string }) => <strong>{title}</strong>;

// ---- Long description ----

const LongDescriptionBlock = ({ content, content_type }: Dataset['long_description'] & object) => {
  if (content_type === 'text/html') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <Paragraph>{content}</Paragraph>;
};

// ---- PersonOrOrganization display ----

const personName = (p: PersonOrOrganization): ReactNode =>
  p.contact?.website ? <a href={p.contact?.website}>{p.name}</a> : p.name;

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
              <PersonOrOrganizationName entity={row} />
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

const PublicationsTable = ({ publications }: { publications: Publication[] }) => {
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
  return JSON.stringify(funding);
  return (
    <BaseProvenanceTable
      dataSource={funding}
      rowKey={(_, i) => (i ?? 0).toString()}
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
          isEmpty: (_, row) => (row && 'grant_numbers' in row ? !!row.grant_numbers?.length : true),
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

// ---- Spatial coverage ----

const SpatialCoverageSection = ({ spatialCoverage }: { spatialCoverage: NonNullable<Dataset['spatial_coverage']> }) => {
  const t = useTranslationFn();

  if (typeof spatialCoverage === 'string') {
    return (
      <Descriptions style={{ paddingTop: '8px' }}>
        <Item span={24} label={<DescLabel title={t('Spatial Coverage')} />}>
          {spatialCoverage}
        </Item>
      </Descriptions>
    );
  }

  const name = spatialCoverage.properties.name;
  const geometry = spatialCoverage.geometry;
  const isPoint = geometry?.type === 'Point';

  return (
    <>
      <Descriptions style={{ paddingTop: '8px' }}>
        <Item span={24} label={<DescLabel title={t('Spatial Coverage')} />}>
          {name}
        </Item>
      </Descriptions>
      {isPoint && (
        <div style={{ position: 'relative', zIndex: 0 }}>
          <PointMap
            data={[{ coordinates: geometry.coordinates as [number, number], title: name }]}
            center={[geometry.coordinates[1], geometry.coordinates[0]]}
            zoom={5}
            height={300}
          />
        </div>
      )}
    </>
  );
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

  const keywords = dataset.keywords ?? [];
  const taxa = dataset.taxa ?? [];
  const stakeholders = dataset.stakeholders ?? [];
  const publications = dataset.publications ?? [];
  const fundingSources = Array.isArray(dataset.funding_sources) ? dataset.funding_sources : [];
  const criteria = dataset.participant_criteria ?? [];
  const counts = dataset.counts ?? [];
  const links = dataset.links ?? [];
  const studyStatus = dataset.study_status?.toLocaleUpperCase();

  const subtitleItems: { key: keyof Dataset }[] = [
    { key: 'release_date' },
    { key: 'last_modified' },
    { key: 'version' },
    { key: 'privacy' },
  ];

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
          .map(({ key }) => (
            <li key={key}>
              <strong>{t(`dataset.${key}`)}:</strong> {t(dataset[key] as unknown as string, { nsSeparator: false })}
            </li>
          ))}
      </ul>

      {keywords.length > 0 && (
        <Flex gap="middle" style={{ marginTop: 8 }}>
          <strong>{t('dataset.keywords')}:</strong>
          <Flex wrap>
            {keywords.map((k, i) => (
              <Tag key={i} color="cyan" style={{ marginBottom: 2 }}>
                {t(keywordLabel(k))}
              </Tag>
            ))}
          </Flex>
        </Flex>
      )}

      {taxa.length > 0 && (
        <Flex gap="middle" style={{ marginTop: 8 }}>
          <strong>{t('dataset.taxon', { count: taxa.length })}:</strong>
          <Flex wrap>
            {taxa.map((k, i) => {
              const taxonLabel = t(keywordLabel(k));
              // Make taxon label italic only if it looks like a species/species+subspecies name (X y or X y z)
              return (
                <Tag key={i} color="blue" className={taxonLabel.split(' ').length >= 2 ? 'italic' : ''}>
                  {taxonLabel}
                </Tag>
              );
            })}
          </Flex>
        </Flex>
      )}

      {/* Description */}
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

      {!collapsed ? (
        <>
          {/* Spatial coverage */}
          {dataset.spatial_coverage && <SpatialCoverageSection spatialCoverage={dataset.spatial_coverage} />}

          {/* Primary contact */}
          {dataset.primary_contact && (
            <>
              <SectionTitle title="Primary Contact" />
              <PersonOrOrganizationDisplay entity={dataset.primary_contact} />
            </>
          )}

          {/* Stakeholders */}
          {stakeholders.length > 0 && (
            <>
              <SectionTitle title="Stakeholders" />
              <Flex gap={16} wrap>
                {stakeholders.map((s) => (
                  <PersonOrOrganizationDisplay key={s.name} entity={s} />
                ))}
              </Flex>
              {/*<StakeholdersTable stakeholders={stakeholders} />*/}
            </>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <>
              <SectionTitle title={publications.length === 1 ? 'Publication' : 'Publications'} />
              <PublicationsDisplay publications={publications} />
              {/*<PublicationsTable publications={publications} />*/}
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

          {/* Extra properties */}
          {dataset.extra_properties && Object.keys(dataset.extra_properties).length > 0 && (
            <>
              <SectionTitle title="Extra Properties" />
              <ExtraPropertiesDisplay extraProperties={dataset.extra_properties} />
            </>
          )}
          {onToggleCollapsed ? (
            <Flex style={{ marginTop: 16 }}>
              <Button onClick={onToggleCollapsed} icon={<UpOutlined />}>
                Collapse
              </Button>
            </Flex>
          ) : null}
        </>
      ) : onToggleCollapsed ? (
        <Flex style={{ marginTop: 16 }}>
          <Button onClick={onToggleCollapsed} icon={<DownOutlined />}>
            Expand
          </Button>
        </Flex>
      ) : null}
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
