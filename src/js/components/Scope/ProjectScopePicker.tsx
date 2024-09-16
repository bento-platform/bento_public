import React, { type CSSProperties, useCallback, useMemo, useState } from 'react';
import { Tabs, Button } from 'antd';
import { useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Link, useLocation } from 'react-router-dom';
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

  const { projects, selectedScope } = useAppSelector((state) => state.metadata);
  const { scope: scopeObj, fixedProject } = selectedScope;

  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    scopeObj.project ?? projects[0]?.identifier ?? undefined
  );

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
          tabBarExtraContent={
            <Link to={baseURL}>
              <Button>{td('Clear')}</Button>
            </Link>
          }
          items={tabItems}
          style={styles.tabs}
        />
      )}
    </>
  );
};

export default ProjectScopePicker;
