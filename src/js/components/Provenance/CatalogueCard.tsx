import React from 'react';
import { Card, Flex, Space, Tag, Typography } from 'antd';
import { Project } from '@/components/Provenance/Catalogue';

const MAX_KEYWORDS = 3;

const CatalogueCard = ({ project }: { project: Project }) => {
  const keywords = project.keywords.slice(0, MAX_KEYWORDS);
  const extraKeywordCount = Math.max(project.keywords.length - MAX_KEYWORDS, 0);

  return (
    <Card key={project.name}>
      <Flex justify="space-between">
        <div style={{ width: '50%' }}>
          <Space direction="vertical">
            <Typography.Title level={4}>{project.name}</Typography.Title>
            <Typography.Text>{project.description}</Typography.Text>
            <div>
              {keywords.map((kw) => (
                <Tag key={kw} color="blue">
                  {kw}
                </Tag>
              ))}
              {extraKeywordCount !== 0 && <Typography.Text>+{extraKeywordCount} more</Typography.Text>}
            </div>
          </Space>
        </div>
        <div style={{ width: '50%' }}>This is the datasets</div>
      </Flex>
    </Card>
  );
};
export default CatalogueCard;
