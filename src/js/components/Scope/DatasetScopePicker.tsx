import React from 'react';
import { List, Avatar, Space, Typography } from 'antd';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Link, useLocation } from 'react-router-dom';
import { FaDatabase } from 'react-icons/fa';
import { getCurrentPage } from '@/utils/router';
import type { Project } from '@/types/metadata';

type DatasetScopePickerProps = {
  parentProject: Project;
  isSingleProject?: boolean;
};
export const DatasetScopePicker = ({ parentProject, isSingleProject }: DatasetScopePickerProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();
  const location = useLocation();
  const baseURL = '/' + location.pathname.split('/')[1];
  const page = getCurrentPage();
  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Space align="baseline" size="large">
        <Typography.Title level={4} className="no-margin-top">
          {td('Project')}: {t(parentProject.title)}
        </Typography.Title>
        {isSingleProject ? (
          // give clear scope option in single project mode
          <Link to={baseURL}>
            <Typography.Link>{td('Clear')}</Typography.Link>
          </Link>
        ) : (
          <Link to={`${baseURL}/p/${parentProject.identifier}/${page}`} key="3">
            <Typography.Link>{td('Select')}</Typography.Link>
          </Link>
        )}
      </Space>
      <Typography.Text>{t(parentProject.description)}</Typography.Text>
      <Typography.Title level={5} className="no-margin-top">
        {td('Datasets')}
      </Typography.Title>
      <List
        dataSource={parentProject.datasets}
        bordered
        renderItem={(item) => (
          <Link to={`${baseURL}/p/${parentProject.identifier}/d/${item.identifier}/${page}`}>
            <List.Item className="select-dataset-hover" key={item.identifier}>
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#33ccff' }} icon={<FaDatabase />} />}
                title={
                  <Link to={`${baseURL}/p/${parentProject.identifier}/d/${item.identifier}/${page}`}>
                    {t(item.title)}
                  </Link>
                }
                description={t(item.description)}
              />
            </List.Item>
          </Link>
        )}
      />
    </Space>
  );
};
