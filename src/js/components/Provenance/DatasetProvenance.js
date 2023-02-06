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
import { ANY_TRANSLATION } from '../../constants/configConstants';

const { Item } = Descriptions;
const { Text, Title } = Typography;
const { Meta } = Card;

const DatasetProvenance = ({ metadata, loading }) => {
  const { t } = useTranslation(ANY_TRANSLATION);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Card
        title={<Title level={3}>{t(metadata.title)}</Title>}
        extra={[
          <Title key="1" level={4} type="secondary" italic>
            {t(metadata.version)}
          </Title>,
        ]}
        style={{ borderRadius: '11px', maxWidth: '1400px' }}
        Loading={loading}
      >
        {/* --- DESCRIPTION ---*/}
        <Meta description={<Text italic>{t(metadata.description)}</Text>} />

        {/* --- CREATOR, PRIVACY, LICENSES, KEYWORD ---*/}
        <Descriptions style={{ paddingTop: '20px' }}>
          {metadata.privacy && (
            <Item span={12} label={<DescriptionTitle title={t('Privacy')} />}>
              {t(metadata.privacy)}
            </Item>
          )}
          {metadata.licenses.length && (
            <Item span={12} label={<DescriptionTitle title={t('Licenses')} />}>
              {metadata.licenses.map((l, i) => (
                <Tag key={i} color="cyan">
                  {t(l.name)}
                </Tag>
              ))}
            </Item>
          )}
          {metadata.keywords.length && (
            <Item span={24} label={<DescriptionTitle title={t('Keywords')} />}>
              {metadata.keywords.map((keyword, i) => (
                <Tag key={i} color="cyan">
                  {t(keyword.value)}
                </Tag>
              ))}
            </Item>
          )}
        </Descriptions>

        {/* TableTitle has translation in it*/}
        {/* --- CREATED BY ---*/}
        <TableTitleWitTranslation title="Created By" />
        <CreatedByTable creators={metadata.creators} />

        {/* --- DISTRIBUTIONS ---*/}
        <TableTitleWitTranslation title="Distributions" />
        <DistributionsTable distributions={metadata.distributions} />

        {/* --- IS ABOUT ---*/}
        <TableTitleWitTranslation title="Is About" />
        <IsAboutTable isAbout={metadata.isAbout} />

        {/* --- PUBLICATIONS ---*/}
        <TableTitleWitTranslation title="Primary Publications" />
        <PublicationsTable publications={metadata.primaryPublications} />

        {/* --- ACKNOWLEDGES ---*/}
        <TableTitleWitTranslation title="Acknowledges" />
        <AcknowledgesTable acknowledges={metadata.acknowledges} />

        {/* --- SPATIAL COVERAGE ---*/}
        <TableTitleWitTranslation title="Spatial Coverage" />
        <SpatialCoverageTable spatialCoverage={metadata.spatialCoverage} />

        {/* --- EXTRA PROPERTIES ---*/}
        <TableTitleWitTranslation title="Extra Properties" />
        <ExtraPropertiesTable extraProperties={metadata.extraProperties} />
      </Card>
    </div>
  );
};

export default DatasetProvenance;

const TableTitleWitTranslation = ({ title }) => {
  const { t } = useTranslation();

  return (
    <Title level={4} style={{ paddingTop: '20px' }}>
      {t(title)}
    </Title>
  );
};

const DescriptionTitle = ({ title }) => <b>{title}</b>;
