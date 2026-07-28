import { Skeleton } from 'antd';
import { useAboutContent } from '@/features/content/hooks';
import { RequestStatus } from '@/types/requests';

const AboutContent = () => {
  const [aboutContent, aboutStatus] = useAboutContent();

  return aboutStatus === RequestStatus.Idle || aboutStatus === RequestStatus.Pending ? (
    <Skeleton title={false} paragraph={{ rows: 2 }} />
  ) : (
    <div className="about-content" dangerouslySetInnerHTML={{ __html: aboutContent }} />
  );
};

export default AboutContent;
