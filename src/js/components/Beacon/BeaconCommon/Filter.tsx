import { useEffect, useState } from 'react';
import { useTranslationFn } from '@/hooks';
import { Button, Form, Select, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import FilterLabel from './FilterLabel';
import type { FormInstance } from 'antd/es/form';
import type {
  FormFilter,
  FilterOption,
  FilterPullDownKey,
  FilterPullDownValue,
  GenericOptionType,
  BeaconFilterSection,
  BeaconFilterUiOptions,
} from '@/types/beacon';

const FILTER_FORM_ITEM_STYLE = { flex: 1, marginInlineEnd: -1 };

const Filter = ({
  filter,
  form,
  beaconFiltersBySection,
  removeFilter,
  setFilterSearchFieldId,
  searchFieldInUse,
  isRequired,
}: FilterProps) => {
  const t = useTranslationFn();

  const [valueOptions, setValueOptions] = useState([{ label: '', value: '' }]);

  const handleSelectKey = (searchFieldId: string, option: GenericOptionType) => {
    // update which search field this filter is using ("sex", "age", etc)
    setFilterSearchFieldId(filter, searchFieldId);

    // narrow type of option
    // ant design has conflicting type inference when options are nested in more than one layer
    const currentOption = option as FilterPullDownKey;

    // set dropdown options for a particular key
    // ie for key "sex", set options to "MALE", "FEMALE", etc
    setValueOptions(currentOption.optionsThisKey);
  };

  // rerender default option when key changes
  useEffect(() => {
    form.setFieldsValue({
      [`filterValue${filter.index}`]: valueOptions[0].value,
    });
  }, [filter.index, form, valueOptions]);

  const searchKeyOptions = (arr: BeaconFilterSection[]): FilterOption[] => {
    return arr.map((qs) => ({
      label: t(qs.section_title),
      options: qs.fields.map((field) => ({
        disabled: searchFieldInUse(field.id),
        label: <FilterLabel filter={field} />,
        value: field.id,
        optionsThisKey: searchValueOptions(field.values),
      })),
    }));
  };

  const searchValueOptions = (arr: BeaconFilterUiOptions['values']): FilterPullDownValue[] =>
    arr.map((v) => ({ label: v, value: v }));

  return (
    <Space.Compact>
      <Form.Item
        name={`filterIndex${filter.index}`}
        rules={[{ required: isRequired, message: t('search field required') }]}
        style={FILTER_FORM_ITEM_STYLE}
      >
        <Select
          placeholder={t('select a search field')}
          className="w-full"
          onSelect={handleSelectKey}
          options={searchKeyOptions(beaconFiltersBySection)}
        />
      </Form.Item>
      <Form.Item
        name={`filterValue${filter.index}`}
        rules={[{ required: isRequired, message: t('value required') }]}
        style={FILTER_FORM_ITEM_STYLE}
      >
        <Select className="w-full" options={valueOptions.map(({ label, value }) => ({ label: t(label), value }))} />
      </Form.Item>
      <Button onClick={() => removeFilter(filter)}>
        <CloseOutlined />
      </Button>
    </Space.Compact>
  );
};

export interface FilterProps {
  filter: FormFilter;
  form: FormInstance;
  beaconFiltersBySection: BeaconFilterSection[];
  removeFilter: (filter: FormFilter) => void;
  setFilterSearchFieldId: (filter: FormFilter, searchFieldId: string) => void;
  searchFieldInUse: (searchFieldId: string) => boolean;
  isRequired: boolean;
}

export default Filter;
