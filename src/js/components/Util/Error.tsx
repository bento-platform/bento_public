import { Alert, type AlertProps } from 'antd';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';

export type ErrorProps = { message: string } & Omit<AlertProps, 'type' | 'showIcon' | 'title'>;

const Error = ({ message, className, ...props }: ErrorProps) => {
  const t = useTranslationFn();
  return (
    <Alert
      className={clsx('container rounded-xl mx-auto shadow', className)}
      type="error"
      showIcon={true}
      title={t(`errors.${message}`)}
      {...props}
    />
  );
};

export default Error;
