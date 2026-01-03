import React, { useState } from 'react'
import { FiPlus, FiFolderPlus, FiShare2 } from 'react-icons/fi'
import type { CreateScormPackageRequest, ReviewMode } from '../../../services/api'

type Props = {
  onCreate: (payload: CreateScormPackageRequest) => void
  loading?: boolean
}

const CreateCourseSide: React.FC<Props> = ({ onCreate, loading }) => {
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState('')
  const [passingScore, setPassingScore] = useState<number>(80)
  const [maxAttempts, setMaxAttempts] = useState<number>(3)
  const [reviewMode, setReviewMode] = useState<ReviewMode>('REVIEW_WITH_ANSWERS')

  const handleCreateCourse = () => {
    setOpen((v) => !v)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: CreateScormPackageRequest = {
      title: title.trim() || 'Untitled',
      description: description.trim() || undefined,
      welcomeVideoUrl: welcomeVideoUrl.trim() || undefined,
      passingScore,
      maxAttempts,
      reviewMode,
      themeJson: JSON.stringify({ primaryColor: '#10b981' }),
      questions: []
    }
    onCreate(payload)
    setOpen(false)
  }

  return (
    <aside className='h-full border-r border-gray-200 p-6 overflow-auto'>
      {/* Create Course Button */}
      <div className='flex justify-center'>
        <button
          onClick={handleCreateCourse}
          className='w-60 flex items-center justify-center gap-2 bg-teal-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-full transition-colors duration-200 shadow-sm mb-4 disabled:opacity-60'
          disabled={!!loading}
        >
          <FiPlus size={18} />
          <span>{open ? 'Close' : 'Create course'}</span>
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className='mb-8 rounded-lg bg-white p-4 shadow-sm space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500'
              placeholder='Course title'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500'
              placeholder='Short description'
              rows={3}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Welcome video URL</label>
            <input
              value={welcomeVideoUrl}
              onChange={(e) => setWelcomeVideoUrl(e.target.value)}
              className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500'
              placeholder='https://...'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Passing score</label>
              <input
                type='number'
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Max attempts</label>
              <input
                type='number'
                min={1}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Review mode</label>
            <select
              value={reviewMode}
              onChange={(e) => setReviewMode(e.target.value as ReviewMode)}
              className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500'
            >
              <option value='NO_REVIEW'>No review</option>
              <option value='REVIEW_WITHOUT_ANSWERS'>Review without answers</option>
              <option value='REVIEW_WITH_ANSWERS'>Review with answers</option>
            </select>
          </div>

          <button
            type='submit'
            disabled={!!loading}
            className='w-full rounded-md bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-sm font-medium disabled:opacity-60'
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      {/* Placeholder sections kept for UI parity */}
      <div className='mb-8'>
        <div className='flex items-center gap-2 mb-4'>
          <FiFolderPlus size={20} className='text-gray-600' />
          <h3 className='text-gray-900 font-semibold'>My courses</h3>
        </div>
        <p className='text-gray-500 text-sm'>Use the form above to create a course.</p>
      </div>

      <div>
        <div className='flex items-center gap-2 mb-4'>
          <FiShare2 size={20} className='text-gray-600' />
          <h3 className='text-gray-900 font-semibold'>Shared courses</h3>
        </div>
        <p className='text-gray-500 text-sm px-1'>No shared courses yet</p>
      </div>
    </aside>
  )
}

export default CreateCourseSide
