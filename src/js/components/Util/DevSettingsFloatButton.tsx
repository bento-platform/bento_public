import { FloatButton } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { CONFIGURED_PCGL_MODE, DEV_SETTINGS, type DevSettings, PCGL_MODE } from '@/config';
import { LOCALSTORAGE_DEV_SETTINGS_KEY } from '@/constants/ui';
import { saveValue } from '@/utils/localStorage';

// Config values are read once at module load (i18n namespaces, facet registry, etc.), so any change requires a reload.
const updateDevSettings = (update: DevSettings) => {
  saveValue(LOCALSTORAGE_DEV_SETTINGS_KEY, { ...DEV_SETTINGS, ...update });
  window.location.reload();
};

/** Floating settings menu for dev/staging testing; only rendered when BENTO_PUBLIC_SHOW_DEV_SETTINGS is true. */
const DevSettingsFloatButton = () => (
  <FloatButton.Group
    className="dev-settings-float-btn"
    shape="square"
    trigger="click"
    icon={<SettingOutlined />}
    tooltip={{ title: 'Dev settings', placement: 'right' }}
  >
    <FloatButton
      content="PCGL"
      type={PCGL_MODE ? 'primary' : 'default'}
      tooltip={{
        title: `PCGL mode: ${PCGL_MODE ? 'on' : 'off'} (configured: ${CONFIGURED_PCGL_MODE ? 'on' : 'off'})`,
        placement: 'right',
      }}
      onClick={() => updateDevSettings({ PCGL_MODE: !PCGL_MODE })}
    />
  </FloatButton.Group>
);

export default DevSettingsFloatButton;
