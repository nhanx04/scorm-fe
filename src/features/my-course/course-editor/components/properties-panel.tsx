import React from 'react'
import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight } from 'react-icons/fi'

export function PropertiesPanel() {
  const [selectedColor, setSelectedColor] = React.useState('#3B82F6')
  const colors = [
    '#000000',
    '#4B5563',
    '#9CA3AF',
    '#FFFFFF',
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#10B981',
    '#3B82F6',
    '#6366F1',
    '#8B5CF6',
    '#EC4899'
  ]

  return (
    <div className='w-[300px] h-full bg-white border-l p-6 flex flex-col gap-8 overflow-y-auto'>
      {/* Color Section */}
      <section>
        <h3 className='text-sm font-semibold text-blue-700 mb-4'>Color</h3>
        <div className='grid grid-cols-4 gap-2'>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-md border transition-transform hover:scale-110 ${
                selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <div className='w-4 h-4 rounded border border-gray-200' style={{ backgroundColor: selectedColor }} />
          <span className='text-xs text-gray-500 font-mono'>{selectedColor}</span>
        </div>
      </section>

      {/* Text Formatting Section */}
      <section className='flex flex-col gap-4'>
        <h3 className='text-sm font-semibold text-gray-700'>Text</h3>

        <select className='w-full border rounded p-2 text-sm text-gray-700 bg-white'>
          <option>Times New Roman</option>
          <option>Arial</option>
          <option>Roboto</option>
        </select>

        <div className='flex gap-1'>
          <button className='flex-1 p-2 border rounded hover:bg-gray-50 flex justify-center text-gray-600'>
            <FiBold />
          </button>
          <button className='flex-1 p-2 border rounded hover:bg-gray-50 flex justify-center text-gray-600'>
            <FiItalic />
          </button>
          <button className='flex-1 p-2 border rounded hover:bg-gray-50 flex justify-center text-gray-600'>
            <FiUnderline />
          </button>
          <div className='w-px bg-gray-200 mx-1'></div>
          <select className='w-16 border rounded p-1 text-sm text-gray-700 bg-white'>
            <option>10</option>
            <option>12</option>
            <option>14</option>
            <option>16</option>
          </select>
        </div>

        <div className='flex gap-1 justify-center'>
          <button className='p-2 border rounded hover:bg-gray-50 text-gray-600'>
            <FiAlignLeft />
          </button>
          <button className='p-2 border rounded hover:bg-gray-50 text-gray-600'>
            <FiAlignCenter />
          </button>
          <button className='p-2 border rounded hover:bg-gray-50 text-gray-600'>
            <FiAlignRight />
          </button>
        </div>
      </section>

      {/* Bottom Buttons */}
      <div className='mt-auto flex flex-col gap-3'>
        <button className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition'>
          Save as Template
        </button>
        <button className='w-full bg-green-700 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-green-800 transition'>
          Export package
        </button>
      </div>
    </div>
  )
}
