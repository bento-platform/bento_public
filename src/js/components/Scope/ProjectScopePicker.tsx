import { type CSSProperties } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Tabs, Button } from 'antd';

import { useMetadata } from '@/features/metadata/hooks';
import { useTranslationFn } from '@/hooks';
import { useNavigateToRoot } from '@/hooks/navigation';

import DatasetScopePicker from './DatasetScopePicker';

const styles: Record<string, CSSProperties> = {
  tabs: {
    // Cancel out padding from modal on left side for button and item alignment
    marginLeft: -24,
  },
};

const ProjectScopePicker = () => {
  const t = useTranslationFn();

  const { projects, selectedScope } = useMetadata();
  const { scope: scopeObj, fixedProject } = selectedScope;

  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    scopeObj.project ?? projects[0]?.identifier ?? undefined
  );

  const onProjectClear = useNavigateToRoot();
  const onTabChange = useCallback((key: string) => setSelectedProject(key), []);
  const tabItems = useMemo(
    () =>
      projects.map((p) => ({
        key: p.identifier,
        label: t(p.title),
        children: <DatasetScopePicker parentProject={p} />,
      })),
    [projects, t]
  );

  return (
    <>
      {fixedProject ? (
        <DatasetScopePicker parentProject={projects[0]} />
      ) : (
        // Project tabs if multiple projects
        <Tabs
          tabPosition="left"
          activeKey={selectedProject}
          onChange={onTabChange}
          tabBarExtraContent={<Button onClick={onProjectClear}>{t('Clear')}</Button>}
          items={tabItems}
          style={styles.tabs}
        />
      )}
    </>
  );
};

export default ProjectScopePicker;
