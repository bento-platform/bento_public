import { Form, Input } from 'antd';
import { useTranslationFn } from '@/hooks';
import type { FormField } from '@/types/beacon';

const VariantInput = ({ field, disabled }: VariantInputProps) => {
  const t = useTranslationFn();
  return (
    <>
      <Form.Item name={field.name} label={t(field.name)} rules={field.rules}>
        <Input placeholder={field.placeholder} disabled={disabled} />
      </Form.Item>
    </>
  );
};

export interface VariantInputProps {
  field: FormField;
  disabled: boolean;
}

export default VariantInput;
