import React from 'react'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import ColorPicker from './ColorPicker'

const ThemePanel: React.FC = () => {
  const theme = useCourseEditorStore((state) => state.theme)
  const updateThemeGlobal = useCourseEditorStore((state) => state.updateThemeGlobal)

  return (
    <div className='bg-white p-1'>
      <div className='flex flex-wrap items-center gap-3'>
        <span className='text-xs font-semibold text-gray-600'>Custom Theme</span>
        <ColorPicker
          label='Primary'
          value={theme.global.primaryColor}
          onChange={(value) => updateThemeGlobal({ primaryColor: value })}
        />
        <ColorPicker
          label='Background'
          value={theme.global.background}
          onChange={(value) => updateThemeGlobal({ background: value })}
        />
        <ColorPicker
          label='Text'
          value={theme.global.textColor}
          onChange={(value) => updateThemeGlobal({ textColor: value })}
        />
        <label className='flex items-center gap-2 text-sm text-gray-700'>
          <span>Radius</span>
          <input
            type='range'
            min={0}
            max={24}
            value={theme.global.borderRadius}
            onChange={(e) => updateThemeGlobal({ borderRadius: Number(e.target.value) })}
            className='w-24'
          />
        </label>
        <label className='flex items-center gap-2 text-sm text-gray-700'>
          <span>Font</span>
          <input
            type='text'
            value={theme.global.fontFamily}
            onChange={(e) => updateThemeGlobal({ fontFamily: e.target.value })}
            className='w-36 rounded border border-gray-300 px-2 py-1 text-sm'
          />
        </label>
      </div>
    </div>
  )
}

export default ThemePanel
