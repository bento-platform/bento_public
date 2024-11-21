import React from 'react';
import { Card, Carousel, Descriptions, Flex, Space, Tag, Typography } from 'antd';
import CatalogueCarouselDataset from '@/components/Provenance/CatalogueCarouselDataset';
import type { Project } from '@/types/metadata';
import { ISODateToString } from '@/utils/strings';

const { Paragraph } = Typography;

const MAX_CHARACTERS = 50;

const CatalogueCard = ({ project }: { project: Project }) => {
  const keywords = project.datasets
    .map((d) => d.dats_file.keywords ?? [])
    .flat()
    .map((k) => k.value as string);

  let totalCharacters = 0;
  const selectedKeywords = [];

  for (const keyword of keywords) {
    if (totalCharacters + keyword.length > MAX_CHARACTERS) {
      break;
    }
    selectedKeywords.push(keyword);
    totalCharacters += keyword.length;
  }

  const extraKeywordCount = Math.max(keywords.length - selectedKeywords.length, 0);

  const projectInfo = [
    {
      key: '1',
      label: 'Created',
      children: (
        <Paragraph
          ellipsis={{
            rows: 1,
            tooltip: { title: ISODateToString(project.created) },
          }}
        >
          {ISODateToString(project.created)}
        </Paragraph>
      ),
      span: 1.5,
    },
    {
      key: '2',
      label: 'Updated',
      children: (
        <Paragraph ellipsis={{ rows: 1, tooltip: { title: ISODateToString(project.updated) } }}>
          {ISODateToString(project.updated)}
        </Paragraph>
      ),
      span: 1.5,
    },
  ];

  return (
    <Card key={project.title} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: '260px' }}>
      <Flex justify="space-between">
        <div style={{ width: '50%', paddingRight: '10px' }}>
          <Space direction="vertical">
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              {project.title}
            </Typography.Title>
            <Typography.Paragraph ellipsis={{ rows: 3 }}>{project.description}</Typography.Paragraph>
            <div>
              {selectedKeywords.map((kw) => (
                <Tag key={kw} color="blue">
                  {kw}
                </Tag>
              ))}
              {extraKeywordCount !== 0 && <Typography.Text>+{extraKeywordCount} more</Typography.Text>}
            </div>
            <Descriptions items={projectInfo} />
          </Space>
        </div>
        <div style={{ width: '50%', maxWidth: '600px' }}>
          <Typography.Title level={4} style={{ marginTop: 0 }}>
            Datasets
          </Typography.Title>
          <Carousel arrows autoplay style={{ border: '1px solid lightgray', borderRadius: '7px' }}>
            {project.datasets.map((d) => (
              <CatalogueCarouselDataset key={d.title} dataset={d} />
            ))}
          </Carousel>
        </div>
      </Flex>
    </Card>
  );
};
export default CatalogueCard;
