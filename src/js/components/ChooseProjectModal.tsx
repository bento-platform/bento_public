import React, { useState } from 'react';
import { Tabs, List, Avatar, Modal, Button, Space, Typography } from 'antd';
import { useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Link, useLocation } from 'react-router-dom';
import { FaDatabase } from 'react-icons/fa';
import { getCurrentPage } from '@/utils/router';
import type { Project } from '@/types/metadata';

type ChooseDatasetProps = {
  parentProject: Project;
  baseURL: string;
  isSingleProject?: boolean;
};
const ChooseDataset = ({ parentProject, baseURL, isSingleProject }: ChooseDatasetProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();
  const page = getCurrentPage();
  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Space align="baseline" size="large">
        <Typography.Title level={4} className="no-margin-top">
          {td('Project')}: {t(parentProject.title)}
        </Typography.Title>
        {!isSingleProject && (
          <Link to={`${baseURL}/p/${parentProject.identifier}/${page}`} key="3">
            <Typography.Link>{td('Select')}</Typography.Link>
          </Link>
        )}
      </Space>
      <Typography.Text>{t(parentProject.description)}</Typography.Text>
      <Typography.Title level={5} className="no-margin-top">
        {td('Datasets')}
      </Typography.Title>
      <List
        dataSource={parentProject.datasets}
        bordered
        renderItem={(item) => (
          <Link to={`${baseURL}/p/${parentProject.identifier}/d/${item.identifier}/${page}`}>
            <List.Item className="select-dataset-hover" key={item.identifier}>
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#33ccff' }} icon={<FaDatabase />} />}
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

const ChooseProjectModal = ({ isModalOpen, setIsModalOpen }: ChooseProjectModalProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();

  const location = useLocation();
  const baseURL = '/' + location.pathname.split('/')[1];

  const { projects, selectedScope } = useAppSelector((state) => state.metadata);
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    selectedScope.project ?? projects[0]?.identifier ?? undefined
  );
  const isSingleProject = projects.length === 1;

  const closeModal = () => setIsModalOpen(false);

  return (
    <Modal title={td('Select Scope')} open={isModalOpen} onCancel={closeModal} footer={null} width={600}>
      {/* Project tabs if multiple projects */}
      {!isSingleProject && (
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
              children: <ChooseDataset parentProject={p} baseURL={baseURL} isSingleProject={isSingleProject} />,
            };
          })}
        />
      )}
      {/* Datasets only if single project */}
      {isSingleProject && (
        <ChooseDataset parentProject={projects[0]} baseURL={baseURL} isSingleProject={isSingleProject} />
      )}
    </Modal>
  );
};

interface ChooseProjectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default ChooseProjectModal;
