import { Typography } from 'antd';

const DEFAULT_MAX_ROWS = 3;

const TruncatedParagraph = ({ maxRows, children }: TruncatedParagraphProps) => {
  return (
    <Typography.Paragraph
      ellipsis={{
        rows: maxRows ?? DEFAULT_MAX_ROWS,
        tooltip: {
          title: children,
          color: 'white',
          styles: { root: { maxWidth: 560 }, body: { color: 'rgba(0, 0, 0, 0.88)' } },
        },
      }}
      style={{ marginBottom: 0 }}
    >
      {children}
    </Typography.Paragraph>
  );
};

type TruncatedParagraphProps = {
  maxRows?: number;
  children: string;
};

export default TruncatedParagraph;
