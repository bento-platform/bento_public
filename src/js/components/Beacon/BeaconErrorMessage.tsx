import React, { Dispatch, SetStateAction } from 'react';
import { Alert } from 'antd';

const BeaconErrorMessage = ({ message, setErrorAlertClosed }: BeaconErrorMessageProps) => {
  return (
    <div style={{ paddingTop: '16px' }}>
      <Alert type={'error'} message={message} onClose={() => setErrorAlertClosed(true)} closable showIcon />
    </div>
  );
};

export interface BeaconErrorMessageProps {
  message: string;
  setErrorAlertClosed: Dispatch<SetStateAction<boolean>>;
}

export default BeaconErrorMessage;
