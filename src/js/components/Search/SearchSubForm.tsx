import type { CSSProperties, ReactNode } from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';

export type SearchSubFormProps = {
  titleKey: string;
  titleKeyCount?: number;
  icon: ReactNode;
  extra?: ReactNode;
  className?: string;
  style?: CSSProperties;
  vertical?: boolean;
};

// Version of SearchSubFormProps type for specific search sub-forms, which define their own title/icon.
export type DefinedSearchSubFormProps = Omit<SearchSubFormProps, 'titleKey' | 'icon' | 'extra'>;

const SearchSubForm = ({
  titleKey,
  titleKeyCount,
  icon,
  extra,
  className,
  style,
  children,
}: SearchSubFormProps & { children?: ReactNode }) => {
  const t = useTranslationFn();

  return (
    <div className={clsx('search-sub-form', className)} style={style}>
      <Typography.Title level={3} className="search-sub-form-title">
        <span style={{ flex: 1 }}>
          {icon}{' '}
          <span className="should-underline-if-unfocused">
            {t(`search.${titleKey}`, titleKeyCount !== undefined ? { count: titleKeyCount } : {})}
          </span>
        </span>
        {extra}
      </Typography.Title>
      {children}
    </div>
  );
};

export default SearchSubForm;
