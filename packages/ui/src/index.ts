export const UI_PACKAGE = '@keryx/ui'

export const THEMES = ['light', 'dark', 'sepia'] as const
export type ThemeName = (typeof THEMES)[number]
