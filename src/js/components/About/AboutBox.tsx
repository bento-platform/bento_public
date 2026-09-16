import type { CSSProperties } from 'react';

import { useAboutContent } from '@/features/content/hooks';

import { Card } from 'antd';
import AboutContent from '@/components/AboutContent';

import { RequestStatus } from '@/types/requests';

const AboutBox = ({ style }: { style?: CSSProperties }) => {
  const [aboutContent, aboutStatus] = useAboutContent();

  // If about is blank after loading, we don't have anything - so don't render the box.
  return aboutStatus === RequestStatus.Fulfilled && !aboutContent ? null : (
    <Card className="container margin-auto shadow rounded-xl" style={style}>
      <AboutContent />
    </Card>
  );
};

export default AboutBox;
