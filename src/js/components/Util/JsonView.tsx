import ReactJson from 'react18-json-view';
import type { Collapsed } from 'react18-json-view/dist/types';
import type { JSONType } from '@/types/json';

// Styles for this component are set in the Bento Public styles.css right now

type JsonViewProps = {
  src: JSONType | JSONType[] | Record<string, JSONType>;
  collapsed?: Collapsed;
  collapseObjectsAfterLength?: number;
};

const JsonView = ({ src, collapsed, collapseObjectsAfterLength }: JsonViewProps) => (
  <ReactJson
    src={src}
    enableClipboard={false}
    collapsed={collapsed ?? 1}
    collapseObjectsAfterLength={collapseObjectsAfterLength}
  />
);

export default JsonView;
