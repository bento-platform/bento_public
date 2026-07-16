import { DownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import remarkGfm from 'remark-gfm';

import { useTranslationFn } from '@/hooks';
import type { TextContentType } from '@/types/dataset';

const REMARK_PLUGINS = [remarkGfm];

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

  return (
    <div className={clsx('long-desc', { expanded })}>
      <div className="long-desc__content">
        {contentType === 'text/html' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : contentType === 'text/markdown' ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p>{content}</p>
        )}
      </div>
      <button
        type="button"
        className={`long-desc__expand-btn${expanded ? ' open' : ''}`}
        onClick={() => setExpanded((v) => !v)}
      >
        {t(`general.${expanded ? 'show_less' : 'show_more'}`)}
        <DownOutlined />
      </button>
    </div>
  );
};

export default LongDescription;
