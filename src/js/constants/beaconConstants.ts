import type { CSSProperties } from 'react';
import { BOX_SHADOW } from '@/constants/overviewConstants';

export const WRAPPER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const FORM_ROW_GUTTERS: [number, number] = [16, 16];

export const CARD_STYLE: CSSProperties = {
  height: '100%',
  ...BOX_SHADOW,
};

export const CARD_BODY_STYLE: CSSProperties = {
  padding: '0 24px 5px 24px',
};

export const CARD_HEAD_STYLE: CSSProperties = {
  border: '0',
};

export const CARD_STYLES = {
  body: CARD_BODY_STYLE,
  header: CARD_HEAD_STYLE,
};

export const BUTTON_AREA_STYLE: CSSProperties = {
  padding: '16px 0',
};

export const BUTTON_STYLE: CSSProperties = {
  margin: '0 10px 0 0',
};
