import React from 'react';

interface WrapperProps extends React.PropsWithChildren {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactElement;
}

// If condition is true, children are wrapped using provided wrapper function
const ConditionalWrapper = ({ condition, wrapper, children }: WrapperProps) => {
  return condition ? wrapper(children) : <>{children}</>;
};

export default ConditionalWrapper;
