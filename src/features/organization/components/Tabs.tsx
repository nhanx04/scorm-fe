import React from 'react'

export interface TabItem {
  key: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
}

const Tabs: React.FC<TabsProps> = ({ items, activeKey, onChange }) => {
  return (
    <div className='mb-6 border-b border-gray-200'>
      <div className='flex flex-wrap items-center gap-2'>
        {items.map((item) => {
          const active = activeKey === item.key
          return (
            <button
              key={item.key}
              type='button'
              onClick={() => onChange(item.key)}
              className={`px-4 py-2 text-sm cursor-pointer font-medium transition-colors ${
                active ? 'border-b-4 border-blue-900 text-blue-900' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Tabs
