import { type CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Divider, Skeleton } from 'antd';

import { useAppSelector } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { RequestStatus } from '@/types/requests';

const ABOUT_CARD_STYLE: CSSProperties = { borderRadius: '11px' };

const AboutBox = ({ style, bottomDivider }: { style?: CSSProperties; bottomDivider?: boolean }) => {
  const { i18n } = useTranslation();

  const isSmallScreen = useSmallScreen();

  const { status: aboutStatus, about } = useAppSelector((state) => state.content);
  const aboutContent = useMemo(() => about[i18n.language].trim(), [about, i18n.language]);

  // If about is blank after loading, we don't have anything - so don't render the box.
  return aboutStatus === RequestStatus.Fulfilled && !aboutContent ? null : (
    <>
      <Card className="container shadow" style={{ ...ABOUT_CARD_STYLE, ...(style ?? {}) }}>
        {aboutStatus === RequestStatus.Idle || aboutStatus === RequestStatus.Pending ? (
          <Skeleton title={false} paragraph={{ rows: 2 }} />
        ) : (
          <div className="about-content" dangerouslySetInnerHTML={{ __html: aboutContent }} />
        )}
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
