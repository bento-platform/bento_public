import type { CSSProperties, ReactNode } from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';

export type SearchSubFormProps = {
  titleKey: string;
  icon: ReactNode;
  className?: string;
  style?: CSSProperties;
};

// Version of SearchSubFormProps type for specific search sub-forms, which define their own title/icon.
export type DefinedSearchSubFormProps = Omit<SearchSubFormProps, 'titleKey' | 'icon'>;

const SearchSubForm = ({
  titleKey,
  icon,
  className,
  style,
  children,
}: SearchSubFormProps & { children?: ReactNode }) => {
  const t = useTranslationFn();

  return (
    <div className={clsx('search-sub-form', className)} style={style}>
      <Typography.Title level={3} className="search-sub-form-title">
        {icon} <span className="should-underline-if-unfocused">{t(`search.${titleKey}`)}</span>
      </Typography.Title>
      {children}
    </div>
  );
};

export default SearchSubForm;
