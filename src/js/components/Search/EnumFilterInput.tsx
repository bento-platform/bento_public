import { Checkbox, Select } from 'antd';
import { T_PLURAL_COUNT, T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';

type Option = { label: string; value: string };

const EnumFilterInput = ({
  disabled,
  isMultiple,
  options,
  value,
  onChange,
}: {
  disabled?: boolean;
  isMultiple?: boolean;
  options?: Option[];
  value?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
}) => {
  const t = useTranslationFn();

  if (isMultiple && options && options.length <= 10) {
    return (
      <Checkbox.Group<string>
        className="w-full"
        disabled={disabled}
        options={options}
        onChange={(values) => onChange?.(values.length === 0 ? null : values)}
        value={Array.isArray(value) ? value : value === null || value === undefined ? ([] as string[]) : [value]}
        style={{ display: 'flex', flexDirection: 'column' }}
      />
    );
  }

  return (
    <Select
      mode={isMultiple ? 'multiple' : undefined}
      className="w-full"
      disabled={disabled}
      options={options}
      onChange={onChange}
      value={value}
      placeholder={
        !disabled ? t('search.filter_value_placeholder', isMultiple ? T_PLURAL_COUNT : T_SINGULAR_COUNT) : ''
      }
    />
  );
};

export default EnumFilterInput;
