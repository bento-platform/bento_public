import type { DescriptionsProps } from 'antd';
import { useTranslationFn } from '@/hooks';

export const useTranslatedDescriptionItems = (items: DescriptionsProps['items']): DescriptionsProps['items'] => {
  const t = useTranslationFn();

  if (!items) {
    return [];
  }

  return items.map(({ label, children, ..._ }) => ({
    ..._,
    label: typeof label === 'string' ? t(label) : label,
    children: typeof children === 'string' ? t(children) : children,
  }));
};
