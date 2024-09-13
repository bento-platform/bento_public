import React, { useMemo } from 'react';
import { List, Avatar, Space, Typography } from 'antd';
import { useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Link, useLocation } from 'react-router-dom';
import { FaDatabase } from 'react-icons/fa';
import { getCurrentPage } from '@/utils/router';
import type { Dataset, Project } from '@/types/metadata';

const datasetIconColor = (dataset: Dataset, selectedID: string | undefined) => {
  // light green when selected, otherwise grey
  return selectedID && dataset.identifier === selectedID ? '#33ffaa' : 'grey';
};

type DatasetScopePickerProps = {
  parentProject: Project;
};
const DatasetScopePicker = ({ parentProject }: DatasetScopePickerProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();
  const location = useLocation();
  const baseURL = '/' + location.pathname.split('/')[1];
  const page = getCurrentPage();

  const selectedScope = useAppSelector((state) => state.metadata.selectedScope);
  const showClearDataset = useMemo(() => {
    // only show the clear dataset option if the selected dataset belongs to the parentProject
    return selectedScope.dataset && parentProject.datasets.some((d) => d.identifier == selectedScope.dataset);
  }, [selectedScope, parentProject]);
  const showSelectProject = !selectedScope.fixedProject && parentProject.identifier != selectedScope?.project;

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Space align="baseline" size="large">
        <Typography.Title level={4} className="no-margin-top">
          {td('Project')}: {t(parentProject.title)}
        </Typography.Title>
        {showSelectProject && (
          <Link to={`${baseURL}/p/${parentProject.identifier}/${page}`} key="2">
            <Typography.Link>{td('Select')}</Typography.Link>
          </Link>
        )}
      </Space>
      <Typography.Text>{t(parentProject.description)}</Typography.Text>
      <Space align="baseline" size="large">
        <Typography.Title level={5} className="no-margin-top">
          {td('Datasets')}
        </Typography.Title>
        {showClearDataset && (
          <Link to={`${baseURL}/p/${parentProject.identifier}/${page}`}>
            <Typography.Link>{td('Clear dataset selection')}</Typography.Link>
          </Link>
        )}
      </Space>
      <List
        dataSource={parentProject.datasets}
        bordered
        renderItem={(item) => (
          <Link to={`${baseURL}/p/${parentProject.identifier}/d/${item.identifier}/${page}`}>
            <List.Item className="select-dataset-hover" key={item.identifier}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: datasetIconColor(item, selectedScope.dataset) }}
                    icon={<FaDatabase />}
                  />
                }
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

export default DatasetScopePicker;
