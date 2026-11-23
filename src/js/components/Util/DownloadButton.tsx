import { type MouseEventHandler, useCallback } from 'react';

import { Button, type ButtonProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import { useDrsHttpsAccessOrPassThrough } from '@/features/drs/hooks';

import { BROWSER_RENDERED_EXTENSIONS } from 'bento-file-display/dist/constants';
import { PUBLIC_URL } from '@/config';

interface DownloadButtonProps extends ButtonProps {
  url: string;
  fileName?: string;
}

// Ported from Bento Web with some modifications (removal of a WES special case, addition of i18n)
// Rendered as a plain link: the browser sends the session cookie to the same-origin proxy, which adds the token, and
// streams the file straight to disk.
const DownloadButton = ({
  url,
  fileName,
  children,
  onClick: propsOnClick,
  loading,
  disabled,
  ...props
}: DownloadButtonProps) => {
  const t = useTranslationFn();

  const finalUrl = useDrsHttpsAccessOrPassThrough(url);
  disabled = disabled || finalUrl === null;
  loading = loading || finalUrl === null;

  // In Firefox, if we open, e.g., a PDF; it'll open in the PDF viewer instead of downloading.
  // Here, we force it to open in a new tab if it's render-able by the browser (although Chrome will actually
  // download the PDF file, so it'll flash a new tab - this is a compromise solution for viewable file types.)
  const openInNewTab = !!fileName && BROWSER_RENDERED_EXTENSIONS.some((ext) => fileName.toLowerCase().endsWith(ext));

  const onClick = useCallback<MouseEventHandler<HTMLElement>>(
    (e) => {
      // SECURITY: URLs within this Bento Public instance go through the same-origin proxy, which authenticates them
      //   with the session cookie. Any other URL is treated as a normal URL, with no authentication.
      if (finalUrl && !finalUrl.startsWith(PUBLIC_URL)) {
        alert(t('file.download_alert'));
      }

      if (propsOnClick) propsOnClick(e);
    },
    [finalUrl, propsOnClick, t]
  );

  return (
    <Button
      key="download"
      icon={<DownloadOutlined aria-hidden />}
      href={finalUrl ?? undefined}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener' : undefined}
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
