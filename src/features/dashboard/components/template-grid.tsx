import React from 'react'
import { BookOpen, Code, GraduationCap, Building } from 'lucide-react'
import type { TemplateItem } from '../types'

type TemplateGridProps = {
  items: TemplateItem[]
}

const iconMap = {
  layout: BookOpen,
  code: Code,
  quiz: GraduationCap,
  building: Building
}

const colorMap: Record<string, { bg: string; accent: string; icon: string }> = {
  tp1: { bg: 'from-blue-50 to-cyan-50', accent: 'bg-blue-100 text-blue-600', icon: 'text-blue-600' },
  tp2: { bg: 'from-purple-50 to-indigo-50', accent: 'bg-purple-100 text-purple-600', icon: 'text-purple-600' },
  tp3: { bg: 'from-orange-50 to-red-50', accent: 'bg-orange-100 text-orange-600', icon: 'text-orange-600' },
  tp4: { bg: 'from-green-50 to-emerald-50', accent: 'bg-green-100 text-green-600', icon: 'text-green-600' }
}

const TemplateGrid: React.FC<TemplateGridProps> = ({ items }) => {
  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {items.map((template) => {
        const Icon = iconMap[template.icon] || BookOpen
        const colors = colorMap[template.id] || colorMap.tp1

        return (
          <div
            key={template.id}
            className={`group rounded-xl bg-gradient-to-br ${colors.bg} border border-gray-200 p-6 transition-all hover:shadow-lg hover:scale-105 cursor-pointer`}
          >
            <div className={`mb-4 inline-flex rounded-lg ${colors.accent} p-3`}>
              <Icon className='h-6 w-6' />
            </div>
            <h3 className='font-semibold text-gray-900'>{template.title}</h3>
            <p className='mt-2 text-sm text-gray-600'>{template.description}</p>
            <button className='mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium border border-gray-200 transition-all hover:bg-gray-50 opacity-0 group-hover:opacity-100'>
              Use Template
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default TemplateGrid

