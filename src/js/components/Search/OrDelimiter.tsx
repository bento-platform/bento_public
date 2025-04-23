import { type CSSProperties, memo } from 'react';
import { Flex } from 'antd';
import { useTranslationFn } from '@/hooks';

const lineStyle: CSSProperties = { width: 1, flex: 1, backgroundColor: '#f0f0f0' };

const OrDelimiter = memo(() => {
  const t = useTranslationFn();
  return (
    <Flex vertical={true} gap={8} align="center">
      <div style={lineStyle} />
      <div style={{ fontWeight: 'bold', color: '#595959' }}>{t('OR')}</div>
      <div style={lineStyle} />
    </Flex>
  );
});
OrDelimiter.displayName = 'OrDelimiter';

export default OrDelimiter;
