import { Alert } from 'antd';

const BeaconErrorMessage = ({ message, onClose }: BeaconErrorMessageProps) => {
  return (
    <div style={{ paddingTop: '16px' }}>
      <Alert type={'error'} message={message} onClose={onClose} closable showIcon />
    </div>
  );
};

export interface BeaconErrorMessageProps {
  message: string;
  onClose: () => void;
}

export default BeaconErrorMessage;
