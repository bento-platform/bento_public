import { type MouseEventHandler, useCallback } from 'react';

import { Button, type ButtonProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { useAccessToken } from 'bento-auth-js';
import { useTranslationFn } from '@/hooks';
import { useDrsHttpsAccessOrPassThrough } from '@/features/drs/hooks';

import { BROWSER_RENDERED_EXTENSIONS } from 'bento-file-display';
import { PORTAL_URL, PUBLIC_URL } from '@/config';

interface DownloadButtonProps extends ButtonProps {
  url: string;
  fileName?: string;
}

// Ported from Bento Web with some modifications (removal of a WES special case, addition of i18n)
const DownloadButton = ({
  url,
  fileName,
  children,
  onClick: propsOnClick,
  loading,
  disabled,
  ...props
}: DownloadButtonProps) => {
  const accessToken = useAccessToken();
  const t = useTranslationFn();

  const finalUrl = useDrsHttpsAccessOrPassThrough(url);
  disabled = disabled || finalUrl === null;
  loading = loading || finalUrl === null;

  const onClick = useCallback<MouseEventHandler<HTMLElement>>(
    (e) => {
      if (!finalUrl) return;

      const form = document.createElement('form');
      if (fileName && BROWSER_RENDERED_EXTENSIONS.find((ext) => fileName.toLowerCase().endsWith(ext))) {
        // In Firefox, if we open, e.g., a PDF; it'll open in the PDF viewer instead of downloading.
        // Here, we force it to open in a new tab if it's render-able by the browser (although Chrome will actually
        // download the PDF file, so it'll flash a new tab - this is a compromise solution for viewable file types.)
        form.target = '_blank';
      }
      form.method = 'post';
      form.action = finalUrl;

      // SECURITY: If the URL is within the Bento instance, we can submit a form to include a token for authentication.
      //   Otherwise, we cannot do this and need to just treat the URL as a normal URL.
      if (finalUrl.startsWith(PORTAL_URL) || finalUrl.startsWith(PUBLIC_URL)) {
        const tokenInput = document.createElement('input');
        tokenInput.setAttribute('type', 'hidden');
        tokenInput.setAttribute('name', 'token');
        if (accessToken) tokenInput.setAttribute('value', accessToken);
        form.appendChild(tokenInput);
      } else {
        alert(t('file.download_alert'));
      }

      document.body.appendChild(form);

      try {
        form.submit();
      } finally {
        // Even if submit raises for some reason, we still need to clean this up; it has a token in it!
        document.body.removeChild(form);
      }

      // Call the props-passed onClick event handler after hijacking the event and doing our own thing
      if (propsOnClick) propsOnClick(e);
    },
    [fileName, finalUrl, accessToken, propsOnClick, t]
  );

  return (
    <Button
      key="download"
      icon={<DownloadOutlined />}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      {...props}
    >
      {children === undefined ? t('file.download') : children}
    </Button>
  );
};

export default DownloadButton;
