import type { ThemeConfig, ThemeTokens } from '../types/editor.types'

export function resolveTheme(global: ThemeConfig['global'], ...overrides: Array<ThemeTokens | undefined>) {
  const merged = overrides.reduce<ThemeTokens>((acc, item) => ({ ...acc, ...(item ?? {}) }), {})
  return {
    background: merged.background ?? global.background,
    color: merged.textColor ?? global.textColor,
    borderRadius: merged.borderRadius ?? global.borderRadius,
    padding: merged.padding,
    fontFamily: global.fontFamily
  }
}
