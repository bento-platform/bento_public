import { Space } from 'antd';
import type { ComponentType, PropsWithChildren } from 'react';
import { memo } from 'react';

export const VerticalSpaceWrapper = memo(function VerticalSpaceWrapper({ children }: PropsWithChildren) {
  return (
    <Space direction="vertical" size={0}>
      {children}
    </Space>
  );
});

interface ConditionalWrapperProps extends PropsWithChildren {
  condition: boolean;
  WrapperClass: ComponentType<PropsWithChildren>;
}

// If condition is true, children are wrapped using provided wrapper function
const ConditionalWrapper = memo(function ConditionalWrapper({
  condition,
  children,
  WrapperClass,
}: ConditionalWrapperProps) {
  if (!condition) {
    return <>{children}</>;
  }

  return <WrapperClass>{children}</WrapperClass>;
});

export default ConditionalWrapper;
