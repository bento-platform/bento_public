import React from 'react';
import { Card, Descriptions, Tag, Typography } from 'antd';
import DistributionsTable from './Tables/DistributionsTable';
import IsAboutTable from './Tables/IsAboutTable';
import AcknowledgesTable from './Tables/AcknowledgesTable';
import SpatialCoverageTable from './Tables/SpatialCoverageTable';
import ExtraPropertiesTable from './Tables/ExtraPropertiesTable';

const { Item } = Descriptions;
const { Text, Title } = Typography;
const { Meta } = Card;

const DatasetProvenance = ({ metadata }) => {
  return (
    <div style={{ paddingBottom: '40px' }}>
      <Card
        title={<Title level={3}>{metadata.title}</Title>}
        extra={[
          <Title key="1" level={4} type="secondary" italic>
            v{metadata.version}
          </Title>,
        ]}
      >
        {/* --- DESCRIPTION ---*/}
        <Meta description={<Text italic>{metadata.description}</Text>} />

        {/* --- CREATOR, PRIVACY, LICENSES, KEYWORD ---*/}
        <Descriptions style={{ paddingTop: '20px' }}>
          <Item label={<DescriptionTitle title="Created By" />}>
            {metadata.creators.map((creator) => (
              <Text key={creator}>
                {creator.name} ({creator.abbreviation})
              </Text>
            ))}
          </Item>
          <Item label={<DescriptionTitle title="Privacy" />}>{metadata.privacy}</Item>
          <Item label={<DescriptionTitle title="Licenses" />}>
            {metadata.licenses.map((l, i) => (
              <Tag key={i} color="cyan">
                {l.name}
              </Tag>
            ))}
          </Item>
          <Item label={<DescriptionTitle title="Keywords" />}>
            {metadata.keywords.map((keyword, i) => (
              <Tag key={i} color="cyan">
                {keyword.value}
              </Tag>
            ))}
          </Item>
        </Descriptions>

        {/* --- DISTRIBUTIONS ---*/}
        <TableTitle title="Distributions" />
        <DistributionsTable distributions={metadata.distributions} />

        {/* --- IS ABOUT ---*/}
        <TableTitle title="Is About" />
        <IsAboutTable isAbout={metadata.isAbout} />

        {/* --- ACKNOWLEDGES ---*/}
        <TableTitle title="Acknowledges" />
        <AcknowledgesTable acknowledges={metadata.acknowledges} />

        {/* --- SPATIAL COVERAGE ---*/}
        <TableTitle title="Spatial Coverage" />
        <SpatialCoverageTable spatialCoverage={metadata.spatialCoverage} />

        {/* --- EXTRA PROPERTIES ---*/}
        <TableTitle title="Extra Properties" />
        <ExtraPropertiesTable extraProperties={metadata.extraProperties} />
      </Card>
    </div>
  );
};

export default DatasetProvenance;

const TableTitle = ({ title }) => {
  return (
    <Title level={4} style={{ paddingTop: '20px' }}>
      {title}
    </Title>
  );
};

const DescriptionTitle = ({ title }) => <b>{title}</b>;
