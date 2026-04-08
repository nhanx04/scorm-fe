import React from 'react'
import type { OrganizationActivity } from '../type'

interface ActivityTimelineProps {
  activities: OrganizationActivity[]
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  if (!activities.length) {
    return (
      <div className='rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500'>
        No activity yet
      </div>
    )
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
      <ol className='relative border-l border-gray-200 pl-5'>
        {activities.map((activity) => (
          <li key={activity.id} className='mb-6 ml-2'>
            <span className='absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-blue-500' />
            <p className='text-sm text-gray-800'>
              <span className='font-medium'>{activity.userName}</span> {activity.action}{' '}
              {activity.targetName ? <span className='font-medium'>“{activity.targetName}”</span> : null}
            </p>
            <p className='mt-1 text-xs text-gray-500'>{new Date(activity.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default ActivityTimeline

