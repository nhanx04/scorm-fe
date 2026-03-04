import React from 'react'
import { HexColorPicker } from 'react-colorful'
import { useCourseStore } from '../store/useCourseStore'
import type { ThemeTokens } from '../types/course'

function NumberField({
  label,
  min,
  max,
  step = 1,
  value,
  onChange
}: {
  label: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className='space-y-1'>
      <span className='text-xs text-gray-600'>{label}</span>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className='w-full'
      />
      <input
        type='number'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className='w-full rounded border px-2 py-1 text-xs'
      />
    </label>
  )
}

export function DesignTab() {
  const selectedElement = useCourseStore((s) => s.selectedElement)
  const course = useCourseStore((s) => s.course)
  const updateElementThemeTokens = useCourseStore((s) => s.updateElementThemeTokens)

  const tokens = React.useMemo<ThemeTokens>(() => {
    if (!selectedElement) return {}

    if (selectedElement.kind === 'section') {
      return course.sections.find((s) => s.id === selectedElement.id)?.themeOverride?.tokens ?? {}
    }

    if (selectedElement.kind === 'page') {
      for (const section of course.sections) {
        const page = section.pages.find((p) => p.id === selectedElement.id)
        if (page) return page.themeOverride?.tokens ?? {}
      }
    }

    if (selectedElement.kind === 'block') {
      for (const section of course.sections) {
        for (const page of section.pages) {
          const block = page.contentPage?.blocks.find((b) => b.id === selectedElement.id)
          if (block) return block.themeOverride?.tokens ?? {}
        }
      }
    }

    if (selectedElement.kind === 'question') {
      for (const section of course.sections) {
        for (const page of section.pages) {
          const question = page.quizPage?.questions.find((q) => q.id === selectedElement.id)
          if (question) return question.themeOverride?.tokens ?? {}
        }
      }
    }

    return {}
  }, [course.sections, selectedElement])

  const update = (patch: Partial<ThemeTokens>) => {
    if (!selectedElement || selectedElement.kind === 'course') return
    updateElementThemeTokens(selectedElement, patch)
  }

  return (
    <div className='space-y-4'>
      <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Design</p>

      <label className='space-y-1'>
        <span className='text-xs text-gray-600'>Font family</span>
        <select
          value={tokens.fontFamily ?? 'Inter'}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className='w-full rounded border px-2 py-1 text-sm'
        >
          <option value='Inter'>Inter</option>
          <option value='Arial'>Arial</option>
          <option value='Georgia'>Georgia</option>
        </select>
      </label>

      <NumberField label='Font size' min={10} max={72} value={tokens.fontSize ?? 16} onChange={(v) => update({ fontSize: v })} />
      <NumberField label='Font weight' min={300} max={900} step={100} value={tokens.fontWeight ?? 400} onChange={(v) => update({ fontWeight: v })} />
      <NumberField label='Line height' min={1} max={3} step={0.1} value={tokens.lineHeight ?? 1.6} onChange={(v) => update({ lineHeight: v })} />
      <NumberField label='Letter spacing' min={0} max={10} step={0.1} value={tokens.letterSpacing ?? 0} onChange={(v) => update({ letterSpacing: v })} />
      <NumberField label='Border radius' min={0} max={48} value={tokens.borderRadius ?? 12} onChange={(v) => update({ borderRadius: v })} />
      <NumberField label='Border width' min={0} max={8} value={tokens.borderWidth ?? 1} onChange={(v) => update({ borderWidth: v })} />
      <NumberField label='Opacity' min={0} max={1} step={0.05} value={tokens.opacity ?? 1} onChange={(v) => update({ opacity: v })} />

      <label className='space-y-1'>
        <span className='text-xs text-gray-600'>Shadow</span>
        <select
          value={tokens.shadow ?? 'none'}
          onChange={(e) => update({ shadow: e.target.value as ThemeTokens['shadow'] })}
          className='w-full rounded border px-2 py-1 text-sm'
        >
          <option value='none'>None</option>
          <option value='sm'>Small</option>
          <option value='md'>Medium</option>
          <option value='lg'>Large</option>
        </select>
      </label>

      <div className='space-y-2'>
        <span className='text-xs text-gray-600'>Background</span>
        <HexColorPicker color={tokens.background ?? '#ffffff'} onChange={(color) => update({ background: color })} />
      </div>
      <div className='space-y-2'>
        <span className='text-xs text-gray-600'>Text color</span>
        <HexColorPicker color={tokens.textColor ?? '#111827'} onChange={(color) => update({ textColor: color })} />
      </div>
      <div className='space-y-2'>
        <span className='text-xs text-gray-600'>Border color</span>
        <HexColorPicker color={tokens.borderColor ?? '#E5E7EB'} onChange={(color) => update({ borderColor: color })} />
      </div>

      <div className='space-y-2 rounded border p-2'>
        <p className='text-xs font-semibold text-gray-600'>Padding</p>
        <div className='grid grid-cols-2 gap-2'>
          {(['top', 'right', 'bottom', 'left'] as const).map((key) => (
            <input
              key={key}
              type='number'
              value={tokens.padding?.[key] ?? 0}
              onChange={(e) =>
                update({
                  padding: {
                    top: tokens.padding?.top ?? 0,
                    right: tokens.padding?.right ?? 0,
                    bottom: tokens.padding?.bottom ?? 0,
                    left: tokens.padding?.left ?? 0,
                    [key]: Number(e.target.value)
                  }
                })
              }
              className='rounded border px-2 py-1 text-xs'
              placeholder={`padding ${key}`}
            />
          ))}
        </div>
      </div>

      <div className='space-y-2 rounded border p-2'>
        <p className='text-xs font-semibold text-gray-600'>Gradient</p>
        <input
          type='text'
          value={tokens.gradient?.direction ?? 'to right'}
          onChange={(e) =>
            update({
              gradient: {
                from: tokens.gradient?.from ?? '#4F46E5',
                to: tokens.gradient?.to ?? '#9333EA',
                direction: e.target.value
              }
            })
          }
          className='w-full rounded border px-2 py-1 text-xs'
          placeholder='direction'
        />
        <input
          type='color'
          value={tokens.gradient?.from ?? '#4F46E5'}
          onChange={(e) =>
            update({
              gradient: {
                from: e.target.value,
                to: tokens.gradient?.to ?? '#9333EA',
                direction: tokens.gradient?.direction ?? 'to right'
              }
            })
          }
          className='h-8 w-full'
        />
        <input
          type='color'
          value={tokens.gradient?.to ?? '#9333EA'}
          onChange={(e) =>
            update({
              gradient: {
                from: tokens.gradient?.from ?? '#4F46E5',
                to: e.target.value,
                direction: tokens.gradient?.direction ?? 'to right'
              }
            })
          }
          className='h-8 w-full'
        />
      </div>
    </div>
  )
}

