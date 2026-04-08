import React from 'react'
import type { Member } from '../type'

interface MembersTableProps {
  members: Member[]
  canManage?: boolean
}

const MembersTable: React.FC<MembersTableProps> = ({ members, canManage = false }) => {
  if (!members.length) {
    return (
      <div className='rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500'>
        No members yet
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500'>User</th>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500'>Role</th>
            <th className='px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {members.map((member) => {
            const name = [member.fname, member.minit, member.lname].filter(Boolean).join(' ') || member.email
            return (
              <tr key={member.userId} className='hover:bg-gray-50'>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700'>
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>{name}</p>
                      <p className='text-xs text-gray-500'>{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3 text-sm text-gray-700'>{member.role}</td>
                <td className='px-4 py-3 text-right'>
                  {canManage ? (
                    <div className='inline-flex gap-2'>
                      <button className='rounded-lg border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100'>
                        Change role
                      </button>
                      <button className='rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50'>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className='text-xs text-gray-400'>No actions</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default MembersTable

