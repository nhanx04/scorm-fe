import type { CSSProperties } from 'react'
import type { LayoutMeta, LayoutMode, ThemeOverride, ThemeTokens } from '../types/course'

const shadowMap: Record<NonNullable<ThemeTokens['shadow']>, string> = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.08)',
  md: '0 6px 16px rgba(0,0,0,0.12)',
  lg: '0 12px 28px rgba(0,0,0,0.16)'
}

export function spacingToCss(value?: ThemeTokens['padding']): string | undefined {
  if (!value) return undefined
  return `${value.top}px ${value.right}px ${value.bottom}px ${value.left}px`
}

export function getThemeTokens(themeOverride?: ThemeOverride): ThemeTokens {
  return themeOverride?.tokens ?? {}
}

export function buildThemeStyle(themeOverride?: ThemeOverride): CSSProperties {
  const tokens = getThemeTokens(themeOverride)
  const style: CSSProperties = {}

  if (tokens.gradient?.from && tokens.gradient?.to) {
    style.backgroundImage = `linear-gradient(${tokens.gradient.direction || 'to right'}, ${tokens.gradient.from}, ${tokens.gradient.to})`
  } else if (tokens.background) {
    style.background = tokens.background
  }

  if (tokens.textColor) style.color = tokens.textColor
  if (tokens.fontFamily) style.fontFamily = tokens.fontFamily
  if (typeof tokens.fontSize === 'number') style.fontSize = `${tokens.fontSize}px`
  if (typeof tokens.fontWeight === 'number') style.fontWeight = tokens.fontWeight
  if (typeof tokens.lineHeight === 'number') style.lineHeight = String(tokens.lineHeight)
  if (typeof tokens.letterSpacing === 'number') style.letterSpacing = `${tokens.letterSpacing}px`

  const padding = spacingToCss(tokens.padding)
  if (padding) style.padding = padding

  const margin = spacingToCss(tokens.margin)
  if (margin) style.margin = margin

  if (typeof tokens.borderRadius === 'number') style.borderRadius = `${tokens.borderRadius}px`
  if (typeof tokens.borderWidth === 'number') style.borderWidth = `${tokens.borderWidth}px`
  if (tokens.borderColor) style.borderColor = tokens.borderColor
  if (tokens.shadow) style.boxShadow = shadowMap[tokens.shadow]
  if (typeof tokens.opacity === 'number') style.opacity = tokens.opacity

  return style
}

export function buildLayoutStyle(layoutMode?: LayoutMode, layoutMeta?: LayoutMeta): CSSProperties {
  if (layoutMode !== 'absolute') return {}
  const style: CSSProperties = { position: 'absolute' }
  if (typeof layoutMeta?.x === 'number') style.left = `${layoutMeta.x}px`
  if (typeof layoutMeta?.y === 'number') style.top = `${layoutMeta.y}px`
  if (typeof layoutMeta?.width === 'number') style.width = `${layoutMeta.width}px`
  if (typeof layoutMeta?.height === 'number') style.height = `${layoutMeta.height}px`
  if (typeof layoutMeta?.zIndex === 'number') style.zIndex = layoutMeta.zIndex
  if (typeof layoutMeta?.rotation === 'number') style.transform = `rotate(${layoutMeta.rotation}deg)`
  if (layoutMeta?.textAlign) style.textAlign = layoutMeta.textAlign
  return style
}
