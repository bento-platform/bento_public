import { DownOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import remarkGfm from 'remark-gfm';

import { useTranslationFn } from '@/hooks';
import type { TextContentType } from '@/types/dataset';

const REMARK_PLUGINS = [remarkGfm];
const MINIMUM_CHARS_FOR_EXPANDABLE = 400;

const MarkdownRenderer = ({ content }: { content: string }) => (
  <div>
    <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>{content}</ReactMarkdown>
  </div>
);

export type LongDescriptionProps = {
  content: string;
  contentType: TextContentType;
};

const LongDescription = ({ content, contentType }: LongDescriptionProps) => {
  const t = useTranslationFn();
  const [expanded, setExpanded] = useState(false);

  const textContentLength = useMemo(() => {
    if (contentType === 'text/html') {
      const tmp = document.createElement('div');
      tmp.innerHTML = content;
      return tmp.innerText.length;
    } else {
      return content.length;
    }
  }, [content, contentType]);

  const isExpandable = textContentLength >= MINIMUM_CHARS_FOR_EXPANDABLE;

  return (
    <div className={clsx('long-desc', { expanded: expanded || !isExpandable })}>
      <div className="long-desc__content">
        {contentType === 'text/html' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : contentType === 'text/markdown' ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p>{content}</p>
        )}
      </div>
      {isExpandable && (
        <button
          type="button"
          className={`long-desc__expand-btn${expanded ? ' open' : ''}`}
          onClick={() => setExpanded((v) => !v)}
        >
          {t(`general.${expanded ? 'show_less' : 'show_more'}`)}
          <DownOutlined />
        </button>
      )}
    </div>
  );
};

export default LongDescription;
