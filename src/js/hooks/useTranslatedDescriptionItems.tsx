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
    // the default namespace separator interferes with real values we use; disable namespacing since we don't use it
    // here yet anyway.
    children: typeof children === 'string' ? t(children, { nsSeparator: false }) : children,
  }));
};
