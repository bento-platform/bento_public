import { Space, Typography } from 'antd';
import { useTranslationFn } from '@/hooks';
import { range } from '@/utils/arrays';

const { Text } = Typography;

import { ToolTipText } from './ToolTipText';

// complexity of instructions suggests the form isn't intuitive enough
const HELP_LINES = 4;

const VariantsInstructions = () => {
  const t = useTranslationFn();
  return (
    <Space orientation="vertical" style={{ minWidth: '510px' }}>
      <Text strong style={{ display: 'block', color: 'white', marginTop: '10px', fontSize: 20 }}>
        {t('beacon.variants_help_title')}
      </Text>
      {range(HELP_LINES).map((x) => (
        <ToolTipText key={x}>{t(`beacon.variants_help_${x + 1}`, { joinArrays: ' ' })}</ToolTipText>
      ))}
    </Space>
  );
};

export default VariantsInstructions;
