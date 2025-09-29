import type { CSSProperties } from 'react';
import { Empty } from 'antd';
import { useTranslationFn } from '@/hooks';

const CustomEmpty = ({ text, simple, style }: { text: string; simple?: boolean; style?: CSSProperties }) => {
  const t = useTranslationFn();

  return (
    <Empty
      image={simple ? Empty.PRESENTED_IMAGE_SIMPLE : Empty.PRESENTED_IMAGE_DEFAULT}
      description={t(text)}
      style={style}
    />
  );
};

export default CustomEmpty;
