import { Typography } from 'antd';

const DEFAULT_MAX_ROWS = 3;

const TruncatedParagraph = ({ maxRows, children }: TruncatedParagraphProps) => {
  return (
    <Typography.Paragraph ellipsis={{ rows: maxRows ?? DEFAULT_MAX_ROWS, tooltip: { title: children } }}>
      {children}
    </Typography.Paragraph>
  );
};

type TruncatedParagraphProps = {
  maxRows?: number;
  children: string;
};

export default TruncatedParagraph;
