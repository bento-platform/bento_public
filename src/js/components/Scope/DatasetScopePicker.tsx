import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flex, List, Space, Typography } from 'antd';

import { T_SINGULAR_COUNT } from '@/constants/i18n';
import Dataset from '@/components/Provenance/Dataset';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { Project } from '@/types/metadata';
import { getCurrentPage, scopeToUrl } from '@/utils/router';
import { useSelectedScope } from '@/features/metadata/hooks';

type DatasetScopePickerProps = {
  parentProject: Project;
};

const DatasetScopePicker = ({ parentProject }: DatasetScopePickerProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
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
  const projectURL = scopeToUrl(parentProjectScope, language, page);

  return (
    <Flex vertical={true} gap={8}>
      <Space align="baseline" size="large">
        <Typography.Title level={4} className="no-margin-top">
          {t('entities.project', T_SINGULAR_COUNT)}: {t(parentProject.title)}
        </Typography.Title>
        {showSelectProject && <Link to={projectURL}>{t('Select')}</Link>}
      </Space>
      <TruncatedParagraph>{t(parentProject.description)}</TruncatedParagraph>
      <Space align="baseline" size="large">
        <Typography.Title level={5} className="no-margin-top">
          {t('entities.dataset', T_SINGULAR_COUNT)}
        </Typography.Title>
        {showClearDataset && <Link to={projectURL}>{t('Clear dataset selection')}</Link>}
      </Space>
      <List
        dataSource={parentProject.datasets}
        bordered
        renderItem={(d) => (
          <Dataset
            parentProjectID={parentProject.identifier}
            dataset={d}
            format="list-item"
            selected={scopeObj.dataset === d.identifier}
          />
        )}
      />
    </Flex>
  );
};

export default DatasetScopePicker;
