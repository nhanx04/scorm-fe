import React from 'react'

type ColorPickerProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <label className='flex items-center justify-between gap-3 text-sm text-gray-700'>
      <span>{label}</span>
      <input
        type='color'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='h-9 w-14 cursor-pointer rounded'
      />
    </label>
  )
}

export default ColorPicker
