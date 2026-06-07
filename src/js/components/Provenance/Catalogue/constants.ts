// Primary brand colour (PCGL dark blue)
export const COLOR_PRIMARY = '#054A74';
export const COLOR_PRIMARY_BG = 'rgba(5,74,116,0.10)';

// Status badge styles (card pill)
export const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Ongoing: { color: '#389E0D', bg: '#F6FFED', border: '#B7EB8F' },
  Completed: { color: COLOR_PRIMARY, bg: COLOR_PRIMARY_BG, border: '#91CAFF' },
  Unassigned: { color: 'rgba(0,0,0,0.45)', bg: '#F5F5F5', border: '#D9D9D9' },
};

// Status chart colours (insights donut)
export const STATUS_CHART_COLORS: Record<string, string> = {
  Ongoing: '#52C41A',
  Completed: '#1677FF',
  Unassigned: '#8C8C8C',
};

// Chart defaults
export const COLOR_CHART_FALLBACK = '#8C8C8C';
export const COLOR_BAR_DEFAULT = '#1677FF';
export const COLOR_DONUT_TRACK = '#EEE';

// Neutral text
export const COLOR_TEXT_SECONDARY = 'rgba(0,0,0,0.65)';
export const COLOR_TEXT_MUTED = 'rgba(0,0,0,0.45)';

// Borders and surfaces
export const COLOR_WHITE = '#fff';
export const COLOR_BORDER = '#F0F0F0';
export const COLOR_BORDER_HOVER = '#E2E8EE';
export const COLOR_BORDER_BASE = '#D9D9D9';
export const COLOR_SURFACE_SUBTLE = '#F5F5F5';

// Card shadows (embed colour values)
export const SHADOW_CARD = '0 2px 10px rgba(0,0,0,0.05)';
export const SHADOW_CARD_HOVER = '0 4px 14px rgba(5,74,116,0.10)';

// Insights panel
export const COLOR_INSIGHTS_BG = '#EEF3F7';
export const COLOR_INSIGHTS_BORDER = '#E0E9F0';

// PCGL banner overlay
export const BANNER_GRADIENT = 'linear-gradient(90deg, rgba(4,30,48,0.80), rgba(4,30,48,0.34))';
export const COLOR_BANNER_EYEBROW = 'rgba(255,255,255,0.65)';
export const COLOR_BANNER_TITLE = COLOR_WHITE;
export const COLOR_BANNER_SUBTITLE = 'rgba(255,255,255,0.78)';
