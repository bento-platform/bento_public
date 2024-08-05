import React, { useState } from 'react';
import { Tabs, List, Avatar, Modal, Button, Space, Typography } from 'antd';
import { useAppSelector } from '@/hooks';
import { Link, useLocation } from 'react-router-dom';

const ChooseProjectModal = ({ isModalOpen, setIsModalOpen }: ChooseProjectModalProps) => {
  const location = useLocation();
  const { projects, selectedScope } = useAppSelector((state) => state.metadata);
  const [selectedProject, setSelectedProject] = useState(selectedScope.project ?? projects[0].identifier);

  const baseURL = '/' + location.pathname.split('/')[1];

  const closeModal = () => setIsModalOpen(false);

  return (
    <Modal
      title="Choose View"
      open={isModalOpen}
      onCancel={closeModal}
      width={800}
      footer={
        <Space>
          <Button key="1" onClick={closeModal}>
            Cancel
          </Button>
          <Link to={baseURL} key="2">
            <Button>Select Default View</Button>
          </Link>
        </Space>
      }
    >
      <Tabs
        tabPosition="left"
        activeKey={selectedProject}
        onChange={(key) => setSelectedProject(key)}
        items={projects.map(({ identifier, title, datasets, description }) => {
          return {
            key: identifier,
            label: title,
            children: (
              <Space direction="vertical">
                <Space align="baseline" size="large">
                  <Typography.Title level={5}>About {title}</Typography.Title>
                  <Link to={`${baseURL}/p/${selectedProject}`} key="3">
                    <Typography.Link>Select Project</Typography.Link>
                  </Link>
                </Space>
                <Typography.Text>{description}</Typography.Text>
                <Typography.Title level={5}>Datasets</Typography.Title>
                <List
                  dataSource={datasets}
                  bordered
                  renderItem={(item) => (
                    <Link to={`${baseURL}/p/${identifier}/d/${item.identifier}`}>
                      <List.Item className="select-dataset-hover" key={item.identifier}>
                        <List.Item.Meta
                          avatar={<Avatar src="/public/assets/database.png" />}
                          title={<Link to={`${baseURL}/p/${identifier}/d/${item.identifier}`}>{item.title}</Link>}
                          description={item.description}
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
