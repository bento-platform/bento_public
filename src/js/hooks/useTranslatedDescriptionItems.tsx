import type { DescriptionsProps } from 'antd';
import type { DescriptionsItemType } from 'antd/es/descriptions';
import { useTranslationFn } from '@/hooks';

export const useTranslatedDescriptionItems = (
  items: DescriptionsProps['items'],
  defaultI18nPrefix: string | undefined = undefined
): DescriptionsItemType[] => {
  const t = useTranslationFn();

  if (!items) {
    return [];
  }

  return items.map(({ key, label, children, ..._ }) => ({
    ..._,
    label:
      key !== undefined && label === undefined
        ? t(`${defaultI18nPrefix}${key}`)
        : typeof label === 'string'
          ? t(label)
          : label,
    children: typeof children === 'string' ? t(children) : children,
  }));
};
