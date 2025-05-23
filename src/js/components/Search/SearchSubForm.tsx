import type { CSSProperties, ReactNode } from 'react';
import { Typography } from 'antd';
import RequestStatusIcon from '@/components/Search/RequestStatusIcon';
import { useTranslationFn } from '@/hooks';
import type { RequestStatus } from '@/types/requests';

export type SearchSubFormProps = {
  title: string;
  icon: ReactNode;
  requestStatus?: RequestStatus;
  focused: boolean;
  onFocus: () => void;
  className?: string;
  style?: CSSProperties;
};

// Version of SearchSubFormProps type for specific search sub-forms, which define their own title/icon.
export type DefinedSearchSubFormProps = Omit<SearchSubFormProps, 'title' | 'icon'>;

const SearchSubForm = ({
  title,
  icon,
  requestStatus,
  focused,
  onFocus,
  className,
  style,
  children,
}: SearchSubFormProps & {
  children?: ReactNode;
}) => {
  const t = useTranslationFn();

  const focusedClass = focused === undefined ? '' : focused ? 'focused' : 'not-focused';
  let classes = 'search-sub-form';
  if (focusedClass) classes += ` ${focusedClass}`;
  if (className) classes += ` ${className}`;
  return (
    <div className={classes} style={style}>
      <Typography.Title level={3} className={'search-sub-form-title' + (focused ? ' focused' : '')}>
        <span className="search-sub-form-title__inner" onClick={onFocus}>
          {icon} <span className="should-underline-if-unfocused">{t(title)}</span>
        </span>
        {requestStatus !== undefined ? <RequestStatusIcon status={requestStatus} /> : null}
      </Typography.Title>
      {children}
    </div>
  );
};

export default SearchSubForm;
