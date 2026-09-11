declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.svg?react' {
  import type React from 'react';
  const Component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Component;
}
