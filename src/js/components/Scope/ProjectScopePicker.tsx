import { type CSSProperties } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Tabs, Button } from 'antd';

import { useLocation, useNavigate } from 'react-router-dom';
import { useMetadata } from '@/features/metadata/hooks';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';

import DatasetScopePicker from './DatasetScopePicker';

const styles: Record<string, CSSProperties> = {
  tabs: {
    // Cancel out padding from modal on left side for button and item alignment
    marginLeft: -24,
  },
};

const ProjectScopePicker = () => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();

  const location = useLocation();
  const baseURL = '/' + location.pathname.split('/')[1];

  const navigate = useNavigate();

  const { projects, selectedScope } = useMetadata();
  const { scope: scopeObj, fixedProject } = selectedScope;

  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    scopeObj.project ?? projects[0]?.identifier ?? undefined
  );

  const onProjectClear = useCallback(() => navigate(baseURL), [baseURL, navigate]);
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
          tabBarExtraContent={<Button onClick={onProjectClear}>{td('Clear')}</Button>}
          items={tabItems}
          style={styles.tabs}
        />
      )}
    </>
  );
};

export default ProjectScopePicker;
