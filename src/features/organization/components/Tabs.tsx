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
    <div className='mb-6 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm'>
      <div className='flex flex-wrap gap-1'>
        {items.map((item) => {
          const active = activeKey === item.key
          return (
            <button
              key={item.key}
              type='button'
              onClick={() => onChange(item.key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
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

