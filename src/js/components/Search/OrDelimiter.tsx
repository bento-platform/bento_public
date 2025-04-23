import { type CSSProperties, memo } from 'react';
import { Flex } from 'antd';
import { useTranslationFn } from '@/hooks';

const lineStyle: CSSProperties = { flex: 1, backgroundColor: '#f0f0f0' };

const OrDelimiter = memo(({ vertical }: { vertical: boolean }) => {
  const t = useTranslationFn();
  const lineStyleComputed = { ...lineStyle, ...(vertical ? { width: 1 } : { height: 1 }) };
  return (
    <Flex vertical={vertical} gap={8} align="center">
      <div style={lineStyleComputed} />
      <div style={{ fontWeight: 'bold', color: '#595959' }}>{t('OR')}</div>
      <div style={lineStyleComputed} />
    </Flex>
  );
});
OrDelimiter.displayName = 'OrDelimiter';

export default OrDelimiter;
