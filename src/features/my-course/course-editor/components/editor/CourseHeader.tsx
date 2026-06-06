import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { FiChevronDown } from 'react-icons/fi'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import ExportActions from './ExportActions'
import ThemePanel from './theme/ThemePanel'
import { useLibraries, useLibraryItems } from '../../../../my-library/hooks/useLibrary'
import { useUploadMedia } from '../../../../my-library/hooks/useUpload'

const getImageUrl = (metadata: unknown) => {
  if (!metadata || typeof metadata !== 'object') return null
  const map = metadata as Record<string, unknown>
  const publicUrl = map.publicUrl
  return typeof publicUrl === 'string' ? publicUrl : null
}

const CourseHeader: React.FC = () => {
  const { courseId: routeCourseId } = useParams<{ courseId: string }>()
  const course = useCourseEditorStore((state) => state.course)
  const updateCourse = useCourseEditorStore((state) => state.updateCourse)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  const uploadInputRef = useRef<HTMLInputElement | null>(null)

  const [collapsed, setCollapsed] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedLibraryId, setSelectedLibraryId] = useState<number | undefined>()

  const { data: libraries = [] } = useLibraries()
  const effectiveLibraryId = selectedLibraryId ?? libraries[0]?.libraryId
  const { data: libraryItems = [] } = useLibraryItems(effectiveLibraryId)
  const uploadMedia = useUploadMedia()

  const titleFontSize = useMemo(() => {
    const length = (course.title || '').trim().length
    if (length <= 16) return 44
    if (length <= 28) return 38
    if (length <= 40) return 32
    return 28
  }, [course.title])

  useEffect(() => {
    if (!descriptionRef.current) return
    descriptionRef.current.style.height = 'auto'
    descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`
  }, [course.description])

  const handleUploadCover: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!effectiveLibraryId) {
      alert('Please create/select a library first.')
      return
    }

    uploadMedia.mutate(
      {
        type: 'IMAGE',
        file,
        title: file.name,
        libraryId: effectiveLibraryId
      },
      {
        onSuccess: (item) => {
          const imageUrl = getImageUrl(item.metadata)
          if (imageUrl) updateCourse({ coverImageUrl: imageUrl })
        }
      }
    )
  }

  const imageItems = libraryItems.filter((item) => item.mediaType === 'IMAGE')

  const toNonNegativeInt = (value: string) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return 0
    return Math.max(0, Math.floor(parsed))
  }

  const toPassingScore = (value: string) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return 0
    return Math.min(100, Math.max(0, parsed))
  }

  return (
    <div className='space-y-5'>
      <div className='rounded-sm bg-white p-1 shadow-sm'>
        <ThemePanel />
      </div>

      <div className='bg-white p-3 shadow-sm'>
        <div className='flex items-center justify-between gap-3'>
          <button
            type='button'
            onClick={() => setCollapsed((v) => !v)}
            className='rounded-lg p-2 text-gray-700 transition hover:bg-gray-100'
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <FiChevronDown className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
          <ExportActions courseId={course.serverId ?? routeCourseId ?? course.id} />
        </div>

        <div className='mx-auto mt-6 flex max-w-5xl flex-col items-center gap-6 text-center'>
          <input
            value={course.title}
            onChange={(e) => updateCourse({ title: e.target.value })}
            placeholder='Untitled Course'
            style={{ fontSize: `${titleFontSize}px` }}
            className='w-full bg-transparent text-center font-extrabold uppercase tracking-wide text-gray-900 placeholder:text-gray-300 transition-colors focus:outline-none'
          />

          {!collapsed && (
            <>
              <div className='w-full space-y-2'>
                <div className='relative h-56 w-full overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-100 text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 group'>
                  {course.coverImageUrl ? (
                    <img src={course.coverImageUrl} alt='Course cover' className='h-full w-full object-cover' />
                  ) : (
                    <div className='flex flex-col items-center justify-center h-full gap-2'>
                      <div className='flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-white'>
                        <svg
                          aria-hidden='true'
                          className='h-7 w-7 text-gray-400'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='1.6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M7 16a4 4 0 0 1 0-8 5 5 0 0 1 10 0 4 4 0 0 1 0 8'
                          />
                          <path strokeLinecap='round' strokeLinejoin='round' d='M12 12v7' />
                          <path strokeLinecap='round' strokeLinejoin='round' d='m9 15 3-3 3 3' />
                        </svg>
                      </div>
                      <span className='text-sm font-medium'>Upload cover image</span>
                    </div>
                  )}

                  {/* Buttons appear on hover */}
                  <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button
                      type='button'
                      onClick={() => uploadInputRef.current?.click()}
                      className='rounded-lg bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Upload image
                    </button>
                    <button
                      type='button'
                      onClick={() => setPickerOpen(true)}
                      className='rounded-lg bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Chọn từ library
                    </button>
                    <input
                      ref={uploadInputRef}
                      type='file'
                      accept='image/*'
                      onChange={handleUploadCover}
                      className='hidden'
                    />
                  </div>
                </div>
              </div>

              <div className='w-full'>
                <textarea
                  ref={descriptionRef}
                  value={course.description ?? ''}
                  onChange={(e) => updateCourse({ description: e.target.value })}
                  placeholder='Add learning objective...'
                  className='min-h-[110px] w-full resize-none rounded-xl bg-gray-100 px-4 py-3 text-left text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
                />

                <div className='mt-4 grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left md:grid-cols-3'>
                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Passing score (%)
                    </label>
                    <input
                      type='number'
                      min={0}
                      max={100}
                      value={course.passingScore ?? 80}
                      onChange={(e) => updateCourse({ passingScore: toPassingScore(e.target.value) })}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Attempt limit
                    </label>
                    <input
                      type='number'
                      min={0}
                      value={course.attemptLimit ?? 0}
                      onChange={(e) => updateCourse({ attemptLimit: toNonNegativeInt(e.target.value) })}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none'
                    />
                    <p className='mt-1 text-xs text-gray-500'>0 = unlimited attempts</p>
                  </div>
                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500'>
                      Duration (minutes)
                    </label>
                    <input
                      type='number'
                      min={0}
                      value={course.durationMin ?? 0}
                      onChange={(e) => updateCourse({ durationMin: toNonNegativeInt(e.target.value) })}
                      className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none'
                    />
                    <p className='mt-1 text-xs text-gray-500'>0 = no time limit</p>
                  </div>
                </div>

                <div className='mt-4 h-px w-full bg-gray-200' />
              </div>
            </>
          )}
        </div>
      </div>

      {pickerOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-4xl rounded-xl bg-white p-4 shadow-xl'>
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>Chọn cover từ library</h3>
              <button type='button' className='rounded border px-3 py-1 text-sm' onClick={() => setPickerOpen(false)}>
                Đóng
              </button>
            </div>
            <select
              value={selectedLibraryId ?? ''}
              onChange={(e) => setSelectedLibraryId(Number(e.target.value))}
              className='mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
            >
              {libraries.map((lib) => (
                <option key={lib.libraryId} value={lib.libraryId}>
                  {lib.libraryName}
                </option>
              ))}
            </select>
            <div className='grid max-h-[50vh] grid-cols-2 gap-3 overflow-y-auto md:grid-cols-4'>
              {imageItems.map((item) => {
                const imageUrl = getImageUrl(item.metadata)
                if (!imageUrl) return null
                return (
                  <button
                    key={item.mediaId}
                    type='button'
                    onClick={() => {
                      updateCourse({ coverImageUrl: imageUrl })
                      setPickerOpen(false)
                    }}
                    className='overflow-hidden rounded-lg border border-gray-200 text-left hover:border-blue-400'
                  >
                    <img src={imageUrl} alt={item.title} className='h-32 w-full object-cover' />
                    <p className='truncate px-2 py-2 text-xs text-gray-700'>{item.title}</p>
                  </button>
                )
              })}
              {imageItems.length === 0 && <p className='col-span-full text-sm text-gray-500'>Library chưa có ảnh.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseHeader
