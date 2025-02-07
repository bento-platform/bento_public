import { type CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Divider, Skeleton } from 'antd';

import { BOX_SHADOW } from '@/constants/overviewConstants';
import { useAppSelector } from '@/hooks';
import { RequestStatus } from '@/types/requests';

const ABOUT_CARD_STYLE: CSSProperties = { width: '100%', maxWidth: 1320, borderRadius: '11px', ...BOX_SHADOW };

const AboutBox = ({ style, bottomDivider }: { style?: CSSProperties; bottomDivider?: boolean }) => {
  const { i18n } = useTranslation();

  const { status: aboutStatus, about } = useAppSelector((state) => state.content);
  const aboutContent = useMemo(() => about[i18n.language].trim(), [about, i18n.language]);

  // If about is blank after loading, we don't have anything - so don't render the box.
  return aboutStatus === RequestStatus.Fulfilled && !aboutContent ? null : (
    <>
      <Card style={{ ...ABOUT_CARD_STYLE, ...(style ?? {}) }}>
        {aboutStatus === RequestStatus.Idle || aboutStatus === RequestStatus.Pending ? (
          <Skeleton title={false} paragraph={{ rows: 2 }} />
        ) : (
          <div className="about-content" dangerouslySetInnerHTML={{ __html: aboutContent }} />
        )}
      </Card>
      {bottomDivider && <Divider style={{ maxWidth: 1280, minWidth: 'auto', margin: '32px auto' }} />}
    </>
  );
};

export default AboutBox;
