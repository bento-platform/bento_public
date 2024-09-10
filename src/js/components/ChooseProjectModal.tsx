import React, { useState } from 'react';
import { Tabs, List, Avatar, Modal, Button, Space, Typography } from 'antd';
import { useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Link, useLocation } from 'react-router-dom';
import { FaDatabase } from 'react-icons/fa';
import { getCurrentPage } from '@/utils/router';

const ChooseProjectModal = ({ isModalOpen, setIsModalOpen }: ChooseProjectModalProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();
  const location = useLocation();
  const { projects, selectedScope } = useAppSelector((state) => state.metadata);
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    selectedScope.project ?? projects[0]?.identifier ?? undefined
  );

  const baseURL = '/' + location.pathname.split('/')[1];
  const page = getCurrentPage();

  const closeModal = () => setIsModalOpen(false);

  return (
    <Modal title={td('Select Scope')} open={isModalOpen} onCancel={closeModal} footer={null} width={800}>
      <Tabs
        tabPosition="left"
        activeKey={selectedProject}
        onChange={(key) => setSelectedProject(key)}
        tabBarExtraContent={
          <Link to={baseURL}>
            <Button>{td('Clear')}</Button>
          </Link>
        }
        items={projects.map(({ identifier, title, datasets, description }) => {
          return {
            key: identifier,
            label: t(title),
            children: (
              <Space direction="vertical">
                <Space align="baseline" size="large">
                  <Typography.Title level={4} className="no-margin-top">
                    {td('About')} {t(title)}
                  </Typography.Title>
                  <Link to={`${baseURL}/p/${selectedProject}/${page}`} key="3">
                    <Typography.Link>{td('Select')}</Typography.Link>
                  </Link>
                </Space>
                <Typography.Text>{t(description)}</Typography.Text>
                <Typography.Title level={5} className="no-margin-top">
                  {td('Datasets')}
                </Typography.Title>
                <List
                  dataSource={datasets}
                  bordered
                  renderItem={(item) => (
                    <Link to={`${baseURL}/p/${identifier}/d/${item.identifier}/${page}`}>
                      <List.Item className="select-dataset-hover" key={item.identifier}>
                        <List.Item.Meta
                          avatar={<Avatar style={{ backgroundColor: '#33ccff' }} icon={<FaDatabase />} />}
                          title={
                            <Link to={`${baseURL}/p/${identifier}/d/${item.identifier}/${page}`}>{t(item.title)}</Link>
                          }
                          description={t(item.description)}
                        />
                      </List.Item>
                    </Link>
                  )}
                />
              </Space>
            ),
          };
        })}
      />
    </Modal>
  );
};

interface ChooseProjectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default ChooseProjectModal;
