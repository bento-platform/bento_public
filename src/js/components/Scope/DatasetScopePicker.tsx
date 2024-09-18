import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { List, Avatar, Space, Typography } from 'antd';
import { FaDatabase } from 'react-icons/fa';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';
import type { Project } from '@/types/metadata';
import { getCurrentPage, scopeEqual, scopeToUrl } from '@/utils/router';

type DatasetScopePickerProps = {
  parentProject: Project;
};

const DatasetScopePicker = ({ parentProject }: DatasetScopePickerProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();
  const location = useLocation();
  const baseURL = '/' + location.pathname.split('/')[1];
  const navigate = useNavigate();
  const page = getCurrentPage();

  const { selectedScope } = useAppSelector((state) => state.metadata);
  const scopeObj = selectedScope.scope;

  const showClearDataset = useMemo(
    () =>
      // only show the clear dataset option if the selected dataset belongs to the parentProject
      scopeObj.dataset && parentProject.datasets.some((d) => d.identifier == scopeObj.dataset),
    [scopeObj, parentProject]
  );
  const showSelectProject = !selectedScope.fixedProject && parentProject.identifier != scopeObj.project;

  const parentProjectScope: DiscoveryScope = { project: parentProject.identifier };
  const projectURL = scopeToUrl(parentProjectScope, baseURL, `/${page}`);

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Space align="baseline" size="large">
        <Typography.Title level={4} className="no-margin-top">
          {td('Project')}: {t(parentProject.title)}
        </Typography.Title>
        {showSelectProject && <Link to={projectURL}>{td('Select')}</Link>}
      </Space>
      <Typography.Text>{t(parentProject.description)}</Typography.Text>
      <Space align="baseline" size="large">
        <Typography.Title level={5} className="no-margin-top">
          {td('Datasets')}
        </Typography.Title>
        {showClearDataset && <Link to={projectURL}>{td('Clear dataset selection')}</Link>}
      </Space>
      <List
        dataSource={parentProject.datasets}
        bordered
        renderItem={({ identifier, title, description }) => {
          const itemScope = { ...parentProjectScope, dataset: identifier };
          const selected = scopeEqual(itemScope, scopeObj); // item scope === dataset scope
          const datasetURL = scopeToUrl(itemScope, baseURL, `/${page}`);
          return (
            <List.Item
              className={`select-dataset-item${selected ? ' selected' : ''}`}
              key={identifier}
              onClick={() => navigate(datasetURL)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta avatar={<Avatar icon={<FaDatabase />} />} title={t(title)} description={t(description)} />
            </List.Item>
          );
        }}
      />
    </Space>
  );
};

export default DatasetScopePicker;
