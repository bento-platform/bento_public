import { useMemo, useState } from 'react';
import { Checkbox, Divider, Flex, Modal, Space, Spin } from 'antd';

import { useTranslationFn } from '@/hooks';
import { useDiscoveryMatchExportFields } from '@/hooks/useDiscoveryMatchExportFields';
import type { ExportFormat, ResultsDataEntity } from '@/types/entities';

const ExportFieldsModal = ({
  open,
  entity,
  format,
  exporting,
  onCancel,
  onExport,
}: {
  open: boolean;
  entity: ResultsDataEntity;
  format: ExportFormat;
  exporting: boolean;
  onCancel: () => void;
  onExport: (fields: string[] | undefined) => void;
}) => {
  const t = useTranslationFn();
  const { fields, fetching } = useDiscoveryMatchExportFields(entity, open);

  // null = every field selected (the default, and what "select all" resets to).
  const [deselectedKeys, setDeselectedKeys] = useState<Set<string> | null>(null);

  const selectedKeys = useMemo(
    () => new Set((fields ?? []).map((f) => f.key).filter((k) => !deselectedKeys?.has(k))),
    [fields, deselectedKeys]
  );
  const allSelected = deselectedKeys === null || deselectedKeys.size === 0;

  const toggleAll = (checked: boolean) => setDeselectedKeys(checked ? null : new Set(fields?.map((f) => f.key)));

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={`${t('search.export_data')} (${t(`search.${format}`)})`}
      okText={t('search.export')}
      onOk={() => onExport(allSelected ? undefined : [...selectedKeys])}
      okButtonProps={{ disabled: fetching || selectedKeys.size === 0, loading: exporting }}
    >
      {fetching || !fields ? (
        <Spin />
      ) : (
        <>
          <Flex justify="space-between" align="center">
            <Checkbox
              checked={allSelected}
              indeterminate={!allSelected && selectedKeys.size > 0}
              onChange={(e) => toggleAll(e.target.checked)}
            >
              {t('search.select_all_fields')}
            </Checkbox>
            <span className="text-secondary">
              {selectedKeys.size} / {fields.length}
            </span>
          </Flex>
          <Divider className="my-3" />
          <Checkbox.Group
            value={[...selectedKeys]}
            onChange={(checked) =>
              setDeselectedKeys(new Set(fields.map((f) => f.key).filter((k) => !checked.includes(k))))
            }
          >
            <Space direction="vertical">
              {fields.map(({ key, label }) => (
                <Checkbox key={key} value={key}>
                  {label}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </>
      )}
    </Modal>
  );
};

export default ExportFieldsModal;
