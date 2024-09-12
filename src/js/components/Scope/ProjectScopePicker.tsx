import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import { useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Link, useLocation } from 'react-router-dom';
import { DatasetScopePicker } from './DatasetScopePicker';

const ProjectScopePicker = () => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();

  const location = useLocation();
  const baseURL = '/' + location.pathname.split('/')[1];

  const { projects, selectedScope } = useAppSelector((state) => state.metadata);
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    selectedScope.project ?? projects[0]?.identifier ?? undefined
  );
  const isSingleProject = projects.length === 1;

  return (
    <>
      {isSingleProject ? (
        <DatasetScopePicker parentProject={projects[0]} isSingleProject={isSingleProject} />
      ) : (
        // Project tabs if multiple projects
        <Tabs
          tabPosition="left"
          activeKey={selectedProject}
          onChange={(key) => setSelectedProject(key)}
          tabBarExtraContent={
            <Link to={baseURL}>
              <Button>{td('Clear')}</Button>
            </Link>
          }
          items={projects.map((p) => {
            return {
              key: p.identifier,
              label: t(p.title),
              children: <DatasetScopePicker parentProject={p} isSingleProject={isSingleProject} />,
            };
          })}
        />
      )}
    </>
  );
};

export default ProjectScopePicker;
