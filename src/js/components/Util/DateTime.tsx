import { EM_DASH } from '@/constants/common';

const DateTime = ({ isoString }: { isoString?: string }) =>
  isoString ? <span title="isoString">{new Date(Date.parse(isoString)).toLocaleString()}</span> : EM_DASH;

export default DateTime;
