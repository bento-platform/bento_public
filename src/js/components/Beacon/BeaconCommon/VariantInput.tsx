import { Form, Input, Select } from 'antd';
import type { DefaultOptionType } from 'antd/es/select/index';
import { useTranslationFn } from '@/hooks';
import type { FormField } from '@/types/beacon';

type InputMode = { type: 'input' } | { type: 'select'; options?: DefaultOptionType[] };

const VariantInput = ({ field, disabled, mode }: VariantInputProps) => {
  const t = useTranslationFn();
  return (
    <>
      <Form.Item name={field.name} label={t(field.name)} rules={field.rules}>
        {!mode || mode.type === 'input' ? (
          <Input placeholder={field.placeholder} disabled={disabled} />
        ) : (
          <Select
            placeholder={field.placeholder}
            disabled={disabled}
            options={mode.options}
            showSearch={true}
            optionFilterProp="value"
          />
        )}
      </Form.Item>
    </>
  );
};

export interface VariantInputProps {
  field: FormField;
  disabled: boolean;
  mode?: InputMode;
}

export default VariantInput;
