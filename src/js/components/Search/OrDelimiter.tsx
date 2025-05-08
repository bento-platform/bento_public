import { type CSSProperties, memo } from 'react';
import { Flex } from 'antd';
import { useTranslationFn } from '@/hooks';

const lineStyle: CSSProperties = { flex: 1, backgroundColor: '#f0f0f0' };

// Use a custom divider since the Ant divider comes with too many styles we have to immediately override.
const OrDivider = memo(({ vertical }: { vertical: boolean }) => {
  const lineStyleComputed = { ...lineStyle, ...(vertical ? { width: 1 } : { height: 1 }) };
  return <div style={lineStyleComputed} aria-hidden={true} />;
});
OrDivider.displayName = 'OrDivider';

const OrDelimiter = memo(({ vertical }: { vertical: boolean }) => {
  const t = useTranslationFn();
  return (
    <Flex vertical={vertical} gap={8} align="center">
      <OrDivider vertical={vertical} />
      <div style={{ fontWeight: 'bold', color: '#595959' }}>{t('OR')}</div>
      <OrDivider vertical={vertical} />
    </Flex>
  );
});
OrDelimiter.displayName = 'OrDelimiter';

export default OrDelimiter;
