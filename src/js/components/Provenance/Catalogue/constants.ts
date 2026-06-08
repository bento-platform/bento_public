// Primary brand colour (PCGL dark blue)
export const COLOR_PRIMARY = 'var(--cat-primary)';
export const COLOR_PRIMARY_BG = 'var(--cat-primary-bg)';

// Status badge styles (card pill)
export const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Ongoing: { color: 'var(--cat-status-ongoing-color)', bg: 'var(--cat-status-ongoing-bg)', border: 'var(--cat-status-ongoing-border)' },
  Completed: { color: COLOR_PRIMARY, bg: COLOR_PRIMARY_BG, border: 'var(--cat-status-completed-border)' },
  Unassigned: { color: 'var(--cat-text-muted)', bg: 'var(--cat-surface-subtle)', border: 'var(--cat-border-base)' },
};

// Status chart colours (insights donut) — kept as hex: used as SVG stroke attributes
export const STATUS_CHART_COLORS: Record<string, string> = {
  Ongoing: '#52C41A',
  Completed: '#1677FF',
  Unassigned: '#8C8C8C',
};

// Chart defaults
export const COLOR_CHART_FALLBACK = '#8C8C8C'; // SVG stroke — cannot use CSS var
export const COLOR_BAR_DEFAULT = 'var(--antd-blue-5)';
export const COLOR_DONUT_TRACK = '#EEE'; // SVG stroke — cannot use CSS var

// Neutral text
export const COLOR_TEXT_SECONDARY = 'var(--cat-text-secondary)';
export const COLOR_TEXT_MUTED = 'var(--cat-text-muted)';

// Borders and surfaces
export const COLOR_WHITE = '#fff';
export const COLOR_BORDER = 'var(--cat-border)';
export const COLOR_BORDER_HOVER = 'var(--cat-border-hover)';
export const COLOR_BORDER_BASE = 'var(--cat-border-base)';
export const COLOR_SURFACE_SUBTLE = 'var(--cat-surface-subtle)';

// Card shadows
export const SHADOW_CARD = 'var(--cat-shadow-card)';
export const SHADOW_CARD_HOVER = 'var(--cat-shadow-card-hover)';

// Insights panel
export const COLOR_INSIGHTS_BG = 'var(--cat-insights-bg)';
export const COLOR_INSIGHTS_BORDER = 'var(--cat-insights-border)';

// Facet chip
export const COLOR_CHIP_COUNT_SELECTED = 'var(--cat-chip-count-selected)';

// PCGL banner overlay
export const BANNER_GRADIENT = 'var(--cat-banner-gradient)';
export const COLOR_BANNER_EYEBROW = 'var(--cat-banner-eyebrow)';
export const COLOR_BANNER_TITLE = COLOR_WHITE;
export const COLOR_BANNER_SUBTITLE = 'var(--cat-banner-subtitle)';
