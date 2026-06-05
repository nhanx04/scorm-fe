import React from 'react'
import { CheckCircle, Edit3, Download, Zap } from 'lucide-react'
import type { TimelineItem } from '../types'

type ActivityFeedProps = {
  items: TimelineItem[]
}

const iconMap = {
  create: CheckCircle,
  edit: Edit3,
  export: Download,
  update: Zap
}

const colorMap = {
  create: 'bg-green-100 text-green-600',
  edit: 'bg-blue-100 text-blue-600',
  export: 'bg-purple-100 text-purple-600',
  update: 'bg-amber-100 text-amber-600'
}

const groupActivitiesByDate = (items: TimelineItem[]) => {
  const grouped: Record<string, TimelineItem[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Older: []
  }

  items.forEach((item) => {
    if (item.timestamp.includes('Today')) {
      grouped.Today.push(item)
    } else if (item.timestamp.includes('Yesterday')) {
      grouped.Yesterday.push(item)
    } else if (item.timestamp.includes('Week') || item.timestamp.includes('day')) {
      grouped['This Week'].push(item)
    } else {
      grouped.Older.push(item)
    }
  })

  return Object.entries(grouped).filter(([, items]) => items.length > 0)
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => {
  const groupedActivities = groupActivitiesByDate(items)

  if (items.length === 0) {
    return (
      <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
        <Zap className='mx-auto mb-3 h-8 w-8 text-gray-400' />
        <p className='font-medium text-gray-900'>No learning activity yet.</p>
        <p className='mt-1 text-sm text-gray-600'>Start by creating your first course.</p>
        <button className='mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
          Create First Course
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {groupedActivities.map(([dateGroup, groupItems]) => (
        <div key={dateGroup}>
          <h4 className='mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wide'>{dateGroup}</h4>
          <div className='space-y-3'>
            {groupItems.map((item) => {
              const Icon = iconMap[item.icon] || CheckCircle
              const colorClass = colorMap[item.icon] || colorMap.create

              return (
                <div key={item.id} className='flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm'>
                  <div className={`rounded-lg ${colorClass} p-2 flex-shrink-0`}>
                    <Icon className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-gray-900'>{item.title}</p>
                    <p className='text-sm text-gray-500'>{item.timestamp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityFeed

