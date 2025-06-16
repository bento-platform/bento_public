import type { CSSProperties } from 'react';
import type { CardProps } from 'antd';

export const FORM_ROW_GUTTERS: [number, number] = [16, 16];

export const CARD_BODY_STYLE: CSSProperties = {
  padding: '0 24px 5px 24px',
};

export const CARD_HEAD_STYLE: CSSProperties = {
  border: '0',
};

export const CARD_STYLES: CardProps['styles'] = {
  body: CARD_BODY_STYLE,
  header: CARD_HEAD_STYLE,
};

export const BUTTON_AREA_STYLE: CSSProperties = {
  padding: '16px 0',
};

export const BUTTON_STYLE: CSSProperties = {
  margin: '0 10px 0 0',
};
