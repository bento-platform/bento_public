import { Button } from 'antd';

import { EM_DASH } from '@/constants/common';
import ErrorText from './ErrorText';

import { useMetadata } from '@/features/metadata/hooks';

export type ProjectTitleProps = {
  projectID: string;
  onClick?: () => void;
};

const ProjectTitle = ({ projectID, onClick }: ProjectTitleProps) => {
  const { projectsByID } = useMetadata();

  if (!projectID) return EM_DASH;

  const title = projectsByID[projectID]?.title;

  if (!title)
    return (
      <span aria-errormessage="project not available" aria-invalid="true">
        <span className="font-mono">{projectID}</span> <ErrorText>(NOT AVAILABLE)</ErrorText>
      </span>
    );

  if (!onClick) return title;
  return (
    <Button type="link" style={{ height: 'auto', padding: 0 }} onClick={onClick}>
      {title}
    </Button>
  );
};

export default ProjectTitle;
