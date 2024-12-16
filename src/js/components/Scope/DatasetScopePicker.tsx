import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, Space, Typography } from 'antd';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useTranslationFn } from '@/hooks';
import type { Project } from '@/types/metadata';
import { getCurrentPage, scopeToUrl } from '@/utils/router';
import Dataset from '@/components/Provenance/Catalogue/Dataset';
import { useSelectedScope } from '@/features/metadata/hooks';

type DatasetScopePickerProps = {
  parentProject: Project;
};

const DatasetScopePicker = ({ parentProject }: DatasetScopePickerProps) => {
  const t = useTranslationFn();
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
  const projectURL = scopeToUrl(parentProjectScope, baseURL, page);

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Space align="baseline" size="large">
        <Typography.Title level={4} className="no-margin-top">
          {t('Project')}: {t(parentProject.title)}
        </Typography.Title>
        {showSelectProject && <Link to={projectURL}>{t('Select')}</Link>}
      </Space>
      <Typography.Text>{t(parentProject.description)}</Typography.Text>
      <Space align="baseline" size="large">
        <Typography.Title level={5} className="no-margin-top">
          {t('Datasets')}
        </Typography.Title>
        {showClearDataset && <Link to={projectURL}>{t('Clear dataset selection')}</Link>}
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
