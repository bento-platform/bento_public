import { Card, Typography } from 'antd';
import { useTranslationFn } from '@/hooks';
import type { Project } from '@/types/metadata';

const ProjectDescriptionCard = ({ project }: { project: Project }) => {
  const t = useTranslationFn();

  return (
    <Card className="container margin-auto shadow rounded-xl">
      <Typography.Paragraph className="mb-0">{t(project.description)}</Typography.Paragraph>
    </Card>
  );
};

export default ProjectDescriptionCard;
