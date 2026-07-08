import type { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';
import { SidebarSection } from '@/components/Sidebar/Sidebar';

export type SearchSubFormProps = {
  titleKey: string;
  titleKeyCount?: number;
  icon: ReactNode;
  extra?: ReactNode;
  className?: string;
  style?: CSSProperties;
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
    <SidebarSection
      sectionTitle={
        <span style={{ flex: 1 }}>
          {icon}{' '}
          <span className="should-underline-if-unfocused">
            {t(`search.${titleKey}`, titleKeyCount !== undefined ? { count: titleKeyCount } : {})}
          </span>
        </span>
      }
      extra={extra}
      className={clsx('search-sub-form', className)}
      style={style}
    >
      {children}
    </SidebarSection>
  );
};

export default SearchSubForm;
