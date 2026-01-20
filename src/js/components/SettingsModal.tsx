import { type ReactNode } from 'react';

import { Card, Flex, Form, Modal, type ModalProps, Radio } from 'antd';

import { useAppDispatch, useLanguage, useTranslationFn } from '@/hooks';
import { useChangeLanguage } from '@/hooks/navigation';
import { useUiUserSettings } from '@/features/ui/hooks';
import { setDashboardChartMode } from '@/features/ui/ui.store';
import { LNGS_FULL_NAMES } from '@/constants/configConstants';

const SettingsSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card className="settings__section" size="small" title={title}>
    <div className="settings__section__content">{children}</div>
  </Card>
);

const SettingsModal = ({ open, ...props }: Omit<ModalProps, 'width' | 'footer'>) => {
  const t = useTranslationFn();
  const lang = useLanguage();
  const changeLanguage = useChangeLanguage();
  const dispatch = useAppDispatch();

  const settings = useUiUserSettings();

  return (
    <Modal open={open} title={t('settings.settings')} width="min(90vw, 960px)" footer={null} {...props}>
      <Flex vertical={true} gap={12}>
        <SettingsSection title={t('settings.language')}>
          <Form>
            <Form.Item label={t('settings.language')} style={{ marginBottom: 0 }}>
              <Radio.Group
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
                options={Object.entries(LNGS_FULL_NAMES).map(([value, label]) => ({ label, value }))}
              />
            </Form.Item>
          </Form>
        </SettingsSection>
        <SettingsSection title={t('settings.dashboard')}>
          <Form>
            <Form.Item label={t('settings.chart_display_mode')} style={{ marginBottom: 0 }}>
              <Radio.Group
                value={settings.dashboardChartMode}
                onChange={(e) => dispatch(setDashboardChartMode(e.target.value))}
                options={[
                  { value: 'normal', label: t('settings.normal') },
                  { value: 'compact', label: t('settings.compact') },
                  { value: 'ultraCompact', label: t('settings.ultra_compact') },
                ]}
              />
            </Form.Item>
          </Form>
        </SettingsSection>
      </Flex>
    </Modal>
  );
};

export default SettingsModal;
