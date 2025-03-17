import ReactJson from 'react18-json-view';
import type { Collapsed } from 'react18-json-view/dist/types';
import type { JSONType } from '@/types/json';

/*
 * This component is more-or-less a duplicate of the one found in Bento Web. As we move data exploration code to
 * Bento Public, the code in Bento Web will eventually be removed.
 */

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
