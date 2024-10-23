import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, Space, Typography } from 'antd';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import type { Project } from '@/types/metadata';
import { getCurrentPage, scopeToUrl } from '@/utils/router';
import Dataset from '@/components/Provenance/Dataset';
import { useSelectedScope } from '@/features/metadata/hooks';

type DatasetScopePickerProps = {
  parentProject: Project;
};

const DatasetScopePicker = ({ parentProject }: DatasetScopePickerProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();
  const location = useLocation();
  const baseURL = '/' + location.pathname.split('/')[1];
  const page = getCurrentPage();

  const selectedScope = useSelectedScope();
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
        renderItem={(d) => <Dataset parentProjectID={parentProject.identifier} dataset={d} format="list-item" />}
      />
    </Space>
  );
};

export default DatasetScopePicker;
