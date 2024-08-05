import React, { useRef, useState } from 'react';
import { useBeaconWithAuthIfAllowed, useTranslationDefault } from '@/hooks';
import {
  checkIsInAuthPopup,
  nop,
  useHandleCallback,
  useOpenSignInWindowCallback,
  usePopupOpenerAuthCallback,
  useSessionWorkerTokenRefresh,
  useSignInPopupTokenHandoff,
} from 'bento-auth-js';
import { PUBLIC_URL_NO_TRAILING_SLASH } from '@/config';
import { Button, message, Modal } from 'antd';
import { Outlet } from 'react-router-dom';

const SIGN_IN_WINDOW_FEATURES = 'scrollbars=no, toolbar=no, menubar=no, width=800, height=600';
const CALLBACK_PATH = '/callback';

const createSessionWorker = () => new Worker(new URL('../../workers/tokenRefresh.ts', import.meta.url));

const AuthOutlet = () => {
  const t = useTranslationDefault();

  // AUTHENTICATION
  const [signedOutModal, setSignedOutModal] = useState(false);

  const sessionWorker = useRef(null);
  const signInWindow = useRef<Window | null>(null);
  const windowMessageHandler = useRef<((event: MessageEvent) => void) | null>(null);

  const openSignInWindow = useOpenSignInWindowCallback(signInWindow, SIGN_IN_WINDOW_FEATURES);

  const popupOpenerAuthCallback = usePopupOpenerAuthCallback();
  const isInAuthPopup = checkIsInAuthPopup(PUBLIC_URL_NO_TRAILING_SLASH);

  useHandleCallback(
    CALLBACK_PATH,
    () => {
      console.debug('authenticated');
    },
    isInAuthPopup ? popupOpenerAuthCallback : undefined,
    (msg) => message.error(msg)
  );

  // Set up message handling from sign-in popup
  useSignInPopupTokenHandoff(windowMessageHandler);

  useSessionWorkerTokenRefresh(sessionWorker, createSessionWorker, nop);

  useBeaconWithAuthIfAllowed();

  return (
    <>
      <Modal
        title={t('You have been signed out')}
        onCancel={() => {
          setSignedOutModal(false);
        }}
        open={signedOutModal}
        footer={[
          <Button key="signin" shape="round" type="primary" onClick={openSignInWindow}>
            {t('Sign In')}
          </Button>,
        ]}
      >
        {t('Please sign in to the research portal.')}
        <br />
      </Modal>
      <Outlet />
    </>
  );
};

export default AuthOutlet;
