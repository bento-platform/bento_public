import { Card, Descriptions, Tag, Typography } from 'antd';

import DistributionsTable from './Tables/DistributionsTable';
import IsAboutTable from './Tables/IsAboutTable';
import AcknowledgesTable from './Tables/AcknowledgesTable';
import SpatialCoverageTable from './Tables/SpatialCoverageTable';
import ExtraPropertiesTable from './Tables/ExtraPropertiesTable';
import PublicationsTable from './Tables/PublicationsTable';
import CreatedByTable from './Tables/CreatedByTable';
import DownloadDats from './DownloadDats';

import { BOX_SHADOW } from '@/constants/overviewConstants';
import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/metadata';

const { Item } = Descriptions;
const { Text, Title } = Typography;
const { Meta } = Card;

const DatasetProvenance = ({ dataset, loading }: DatasetProvenanceProps) => {
  const t = useTranslationFn();

  const metadata = dataset.dats_file;

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      <Card
        title={<Title level={3}>{t(metadata.title ?? dataset.title)}</Title>}
        extra={
          metadata.version
            ? [
                <Title key="1" level={4} type="secondary" italic>
                  {t(metadata.version)}
                </Title>,
              ]
            : []
        }
        style={{ borderRadius: '11px', ...BOX_SHADOW }}
        loading={loading}
      >
        {/* --- DESCRIPTION ---*/}
        <Meta description={<Text italic>{t(metadata.description ?? dataset.description)}</Text>} />

        {/* --- CREATOR, PRIVACY, LICENSES, KEYWORD ---*/}
        {metadata.privacy || metadata.licenses?.length || metadata.keywords?.length ? (
          <Descriptions style={{ paddingTop: '20px' }}>
            {metadata.privacy && (
              <Item span={12} label={<DescriptionTitle title={t('Privacy')} />}>
                {t(metadata.privacy)}
              </Item>
            )}
            {!!metadata.licenses?.length && (
              <Item span={12} label={<DescriptionTitle title={t('Licenses')} />}>
                {metadata.licenses.map((l, i) => (
                  <Tag key={i} color="cyan">
                    {t(l.name)}
                  </Tag>
                ))}
              </Item>
            )}
            {!!metadata.keywords?.length && (
              <Item span={24} label={<DescriptionTitle title={t('Keywords')} />}>
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
        {!!metadata.creators?.length && (
          <>
            <TableTitleWithTranslation title="Created By" />
            <CreatedByTable creators={metadata.creators} />
          </>
        )}

        {/* --- DISTRIBUTIONS ---*/}
        {!!metadata.distributions?.length && (
          <>
            <TableTitleWithTranslation title="Distributions" />
            <DistributionsTable distributions={metadata.distributions} />
          </>
        )}

        {/* --- IS ABOUT ---*/}
        {!!metadata.isAbout?.length && (
          <>
            <TableTitleWithTranslation title="Is About" />
            <IsAboutTable isAbout={metadata.isAbout} />
          </>
        )}

        {/* --- PUBLICATIONS ---*/}
        {!!metadata.primaryPublications?.length && (
          <>
            <TableTitleWithTranslation title="Primary Publications" />
            <PublicationsTable publications={metadata.primaryPublications} />
          </>
        )}

        {/* --- ACKNOWLEDGES ---*/}
        {!!metadata.acknowledges?.length && (
          <>
            <TableTitleWithTranslation title="Acknowledgements" />
            <AcknowledgesTable acknowledges={metadata.acknowledges} />
          </>
        )}

        {/* --- SPATIAL COVERAGE ---*/}
        {!!metadata.spatialCoverage?.length && (
          <>
            <TableTitleWithTranslation title="Spatial Coverage" />
            <SpatialCoverageTable spatialCoverage={metadata.spatialCoverage} />
          </>
        )}

        {/* --- EXTRA PROPERTIES ---*/}
        {!!metadata.extraProperties?.length && (
          <>
            <TableTitleWithTranslation title="Extra Properties" />
            <ExtraPropertiesTable extraProperties={metadata.extraProperties} />
          </>
        )}

        {/* --- DOWNLOAD DATS --- */}
        <DownloadDats dataset={dataset} />
      </Card>
    </div>
  );
};

export type DatasetProvenanceProps = {
  dataset: Dataset;
  loading: boolean;
};

export default DatasetProvenance;

const TableTitleWithTranslation = ({ title }: { title: string }) => {
  const t = useTranslationFn();

  return (
    <Title level={4} style={{ paddingTop: '20px' }}>
      {t(title)}
    </Title>
  );
};

const DescriptionTitle = ({ title }: { title: string }) => <b>{title}</b>;
