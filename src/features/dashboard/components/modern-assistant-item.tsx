import React from 'react'
import { Sparkles, Zap, FileText, AlertCircle } from 'lucide-react'
import type { SuggestionItem } from '../types'

type ModernAssistantItemProps = {
  item: SuggestionItem
}

const iconMap = {
  s1: Sparkles,
  s2: Zap,
  s3: FileText,
  s4: AlertCircle
}

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  s1: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
  s2: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
  s3: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-200' },
  s4: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200' }
}

const ModernAssistantItem: React.FC<ModernAssistantItemProps> = ({ item }) => {
  const Icon = iconMap[item.id] || Sparkles
  const colors = colorMap[item.id] || colorMap.s1

  return (
    <div
      className={`group rounded-xl border-2 ${colors.border} ${colors.bg} p-6 transition-all hover:shadow-lg hover:scale-105`}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-start gap-4'>
          <div className={`rounded-lg ${colors.bg} p-3 ${colors.icon}`}>
            <Icon className='h-6 w-6' />
          </div>
          <div className='flex-1'>
            <h3 className='font-semibold text-gray-900'>{item.title}</h3>
            <p className='mt-1 text-sm text-gray-600'>{item.description}</p>
          </div>
        </div>
      </div>
      <button className='mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 border border-gray-200'>
        <Sparkles className='h-4 w-4' />
        {item.cta}
      </button>
    </div>
  )
}

export default ModernAssistantItem

