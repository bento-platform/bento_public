import type { CSSProperties } from 'react';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { RequestStatus } from '@/types/requests';

const BASE_STYLE: CSSProperties = { fontSize: '1.1rem' };
const STATUS_ICONS = {
  [RequestStatus.Idle]: <div />,
  [RequestStatus.Pending]: <LoadingOutlined style={{ ...BASE_STYLE, color: '#bfbfbf' }} />,
  [RequestStatus.Fulfilled]: <CheckCircleFilled style={{ ...BASE_STYLE, color: '#52c41a' }} />,
  [RequestStatus.Rejected]: <CloseCircleFilled style={{ ...BASE_STYLE, color: '#f5222d' }} />,
};

const RequestStatusIcon = ({ status }: { status: RequestStatus }) => STATUS_ICONS[status];

export default RequestStatusIcon;
