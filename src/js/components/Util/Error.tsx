import { Alert, type AlertProps } from 'antd';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';

export type ErrorProps = { message: string } & Omit<AlertProps, 'type' | 'showIcon' | 'message'>;

const Error = ({ message, className, ...props }: ErrorProps) => {
  const t = useTranslationFn();
  return (
    <Alert
      className={clsx('container rounded-xl mx-auto shadow', className)}
      type="error"
      showIcon={true}
      message={t(`errors.${message}`)}
      {...props}
    />
  );
};

export default Error;
