import { useCallback, useMemo } from 'react';
import { Flex, List, Space, Typography } from 'antd';

import { T_SINGULAR_COUNT } from '@/constants/i18n';
import Dataset from '@/components/Provenance/Dataset';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import type { Project } from '@/types/metadata';
import { getCurrentPage } from '@/utils/router';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';

type DatasetScopePickerProps = {
  parentProject: Project;
};

const DatasetScopePicker = ({ parentProject }: DatasetScopePickerProps) => {
  const t = useTranslationFn();
  const page = getCurrentPage();
  const navigateToScope = useNavigateToScope();

  const selectedScope = useSelectedScope();
  const scopeObj = selectedScope.scope;

  const showClearDataset = useMemo(
    () =>
      // only show the clear dataset option if the selected dataset belongs to the parentProject
      scopeObj.dataset && parentProject.datasets.some((d) => d.identifier == scopeObj.dataset),
    [scopeObj, parentProject]
  );
  const showSelectProject = !selectedScope.fixedProject && parentProject.identifier != scopeObj.project;

  const navigateToParentProject = useCallback(() => {
    navigateToScope({ project: parentProject.identifier }, page);
  }, [navigateToScope, parentProject.identifier, page]);

  return (
    <Flex vertical={true} gap={8}>
      <Space align="baseline" size="large">
        <Typography.Title level={4} className="no-margin-top">
          {t('entities.project', T_SINGULAR_COUNT)}: {t(parentProject.title)}
        </Typography.Title>
        {showSelectProject && <a onClick={navigateToParentProject}>{t('Select')}</a>}
      </Space>
      <TruncatedParagraph>{t(parentProject.description)}</TruncatedParagraph>
      <Space align="baseline" size="large">
        <Typography.Title level={5} className="no-margin-top">
          {t('entities.dataset', T_SINGULAR_COUNT)}
        </Typography.Title>
        {showClearDataset && <a onClick={navigateToParentProject}>{t('Clear dataset selection')}</a>}
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
