import React from 'react';
import { Card, Flex, Space, Tag, Typography } from 'antd';
import { Project } from '@/components/Provenance/Catalogue';

const CatalogueCard = ({ project }: { project: Project }) => {
  return (
    <Card key={project.name}>
      <Flex justify="space-between">
        <div style={{ width: '50%' }}>
          <Space direction="vertical">
            <Typography.Title level={4}>{project.name}</Typography.Title>
            <Typography.Text>{project.description}</Typography.Text>
            <div>
              {project.keywords.map((kw) => (
                <Tag key={kw} color="blue">
                  {kw}
                </Tag>
              ))}
            </div>
          </Space>
        </div>
        <div style={{ width: '50%' }}>This is the datasets</div>
      </Flex>
    </Card>
  );
};
export default CatalogueCard;
