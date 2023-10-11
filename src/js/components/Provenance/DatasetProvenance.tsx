import React from 'react';
import { Card, Descriptions, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import DistributionsTable from './Tables/DistributionsTable';
import IsAboutTable from './Tables/IsAboutTable';
import AcknowledgesTable from './Tables/AcknowledgesTable';
import SpatialCoverageTable from './Tables/SpatialCoverageTable';
import ExtraPropertiesTable from './Tables/ExtraPropertiesTable';
import PublicationsTable from './Tables/PublicationsTable';
import CreatedByTable from './Tables/CreatedByTable';
import DownloadDats from './DownloadDats';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { ProvenanceStoreDataset } from '@/types/provenance';

const { Item } = Descriptions;
const { Text, Title } = Typography;
const { Meta } = Card;

const DatasetProvenance = ({ metadata, loading }: DatasetProvenanceProps) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      <Card
        title={<Title level={3}>{t(metadata.title)}</Title>}
        extra={[
          <Title key="1" level={4} type="secondary" italic>
            {t(metadata.version)}
          </Title>,
        ]}
        style={{ borderRadius: '11px' }}
        loading={loading}
      >
        {/* --- DESCRIPTION ---*/}
        <Meta description={<Text italic>{t(metadata.description)}</Text>} />

        {/* --- CREATOR, PRIVACY, LICENSES, KEYWORD ---*/}
        {metadata.privacy || metadata.licenses.length || metadata.keywords.length ? (
          <Descriptions style={{ paddingTop: '20px' }}>
            {metadata.privacy && (
              <Item span={12} label={<DescriptionTitle title={td('Privacy')} />}>
                {t(metadata.privacy)}
              </Item>
            )}
            {metadata.licenses.length && (
              <Item span={12} label={<DescriptionTitle title={td('Licenses')} />}>
                {metadata.licenses.map((l, i) => (
                  <Tag key={i} color="cyan">
                    {t(l.name)}
                  </Tag>
                ))}
              </Item>
            )}
            {metadata.keywords.length && (
              <Item span={24} label={<DescriptionTitle title={td('Keywords')} />}>
                {metadata.keywords.map((keyword, i) => (
                  <Tag key={i} color="cyan">
                    {t(keyword.value.toString())}
                  </Tag>
                ))}
              </Item>
            )}
          </Descriptions>
        ) : null}

        {/* TableTitle has translation in it*/}
        {/* --- CREATED BY ---*/}
        {metadata.creators?.length ? (
          <>
            <TableTitleWithTranslation title="Created By" />
            <CreatedByTable creators={metadata.creators} />
          </>
        ) : null}

        {/* --- DISTRIBUTIONS ---*/}
        {metadata.distributions?.length ? (
          <>
            <TableTitleWithTranslation title="Distributions" />
            <DistributionsTable distributions={metadata.distributions} />
          </>
        ) : null}

        {/* --- IS ABOUT ---*/}
        {metadata.isAbout?.length ? (
          <>
            <TableTitleWithTranslation title="Is About" />
            <IsAboutTable isAbout={metadata.isAbout} />
          </>
        ) : null}

        {/* --- PUBLICATIONS ---*/}
        {metadata.primaryPublications?.length ? (
          <>
            <TableTitleWithTranslation title="Primary Publications" />
            <PublicationsTable publications={metadata.primaryPublications} />
          </>
        ) : null}

        {/* --- ACKNOWLEDGES ---*/}
        {metadata.acknowledges?.length ? (
          <>
            <TableTitleWithTranslation title="Acknowledgements" />
            <AcknowledgesTable acknowledges={metadata.acknowledges} />
          </>
        ) : null}

        {/* --- SPATIAL COVERAGE ---*/}
        {metadata.spatialCoverage?.length ? (
          <>
            <TableTitleWithTranslation title="Spatial Coverage" />
            <SpatialCoverageTable spatialCoverage={metadata.spatialCoverage} />
          </>
        ) : null}

        {/* --- EXTRA PROPERTIES ---*/}
        {metadata.extraProperties?.length ? (
          <>
            <TableTitleWithTranslation title="Extra Properties" />
            <ExtraPropertiesTable extraProperties={metadata.extraProperties} />
          </>
        ) : null}

        {/* --- DOWNLOAD DATS --- */}
        <DownloadDats metadata={metadata} />
      </Card>
    </div>
  );
};

export type DatasetProvenanceProps = {
  metadata: ProvenanceStoreDataset;
  loading: boolean;
};

export default DatasetProvenance;

const TableTitleWithTranslation = ({ title }: { title: string }) => {
  const { t } = useTranslation(DEFAULT_TRANSLATION);

  return (
    <Title level={4} style={{ paddingTop: '20px' }}>
      {t(title)}
    </Title>
  );
};

const DescriptionTitle = ({ title }: { title: string }) => <b>{title}</b>;
