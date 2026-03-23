import { Alert, type AlertProps } from 'antd';
import { useTranslationFn } from '@/hooks';

export type ErrorProps = { message: string } & Omit<AlertProps, 'className' | 'type' | 'showIcon' | 'message'>;

const Error = ({ message, ...props }: ErrorProps) => {
  const t = useTranslationFn();
  return (
    <Alert
      className="container rounded-xl margin-auto shadow"
      type="error"
      showIcon={true}
      message={t(`errors.${message}`)}
      {...props}
    />
  );
};

export default Error;
