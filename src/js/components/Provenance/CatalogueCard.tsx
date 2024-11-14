import React from 'react';
import { Card, Descriptions, Flex, Space, Tag, Typography } from 'antd';
import { Project } from '@/components/Provenance/Catalogue';

const MAX_KEYWORDS = 3;

const CatalogueCard = ({ project }: { project: Project }) => {
  const keywords = project.keywords.slice(0, MAX_KEYWORDS);
  const extraKeywordCount = Math.max(project.keywords.length - MAX_KEYWORDS, 0);

  const projectInfo = [
    { key: '1', label: 'location', children: project.location, span: 1.5 },
    { key: '2', label: 'Privacy', children: project.privacy, span: 1.5 },
    { key: '3', label: 'License', children: project.license, span: 1.5 },
    { key: '4', label: 'Updated', children: `${project.lastUpdated}, v${project.version}`, span: 1.5 },
  ];

  return (
    <Card key={project.name}>
      <Flex justify="space-between">
        <div style={{ width: '50%' }}>
          <Space direction="vertical">
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              {project.name}
            </Typography.Title>
            <Typography.Text>{project.description}</Typography.Text>
            <div>
              {keywords.map((kw) => (
                <Tag key={kw} color="blue">
                  {kw}
                </Tag>
              ))}
              {extraKeywordCount !== 0 && <Typography.Text>+{extraKeywordCount} more</Typography.Text>}
              <Descriptions items={projectInfo} />
            </div>
          </Space>
        </div>
        <div style={{ width: '50%' }}>This is the datasets</div>
      </Flex>
    </Card>
  );
};
export default CatalogueCard;
