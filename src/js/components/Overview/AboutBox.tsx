import type { CSSProperties } from 'react';

import { useAboutContent } from '@/features/content/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import { Card, Divider } from 'antd';
import AboutContent from '@/components/AboutContent';

import { RequestStatus } from '@/types/requests';

const AboutBox = ({ style, bottomDivider }: { style?: CSSProperties; bottomDivider?: boolean }) => {
  const isSmallScreen = useSmallScreen();

  const [aboutContent, aboutStatus] = useAboutContent();

  // If about is blank after loading, we don't have anything - so don't render the box.
  return aboutStatus === RequestStatus.Fulfilled && !aboutContent ? null : (
    <>
      <Card className="container shadow rounded-xl" style={style}>
        <AboutContent />
      </Card>
      {bottomDivider && (
        <Divider
          style={{
            // Divider looks a bit nicer when it's always a little narrower than the about box / data catalogue:
            maxWidth: 'min(var(--content-max-width) - 32px, 100% - 32px)',
            minWidth: 'auto',
            margin: `${isSmallScreen ? 16 : 32}px auto`,
          }}
        />
      )}
    </>
  );
};

export default AboutBox;
