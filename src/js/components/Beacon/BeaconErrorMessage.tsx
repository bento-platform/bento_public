import React, { Dispatch, SetStateAction } from 'react';
import { Alert } from 'antd';

const BeaconErrorMessage = ({ message, setErrorAlertClosed }: BeaconErrorMessageProps) => {
  return <Alert type={'error'} message={message} closable onClose={() => setErrorAlertClosed(true)} />;
};

export interface BeaconErrorMessageProps {
  message: string;
  setErrorAlertClosed: Dispatch<SetStateAction<boolean>>;
}

export default BeaconErrorMessage;
