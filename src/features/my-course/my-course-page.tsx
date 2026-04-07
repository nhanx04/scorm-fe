import React, { useEffect, useRef, useState } from 'react'
import { FiSearch, FiChevronDown, FiFileText, FiLayers, FiUpload, FiX } from 'react-icons/fi'
import { CourseCard, PageLoading } from '@/components'
import CourseFilter from './components/CourseFilter'
import CreateCourseWithAIModal from './components/CreateCourseWithAIModal'
import DeleteCourseConfirmDialog from './components/DeleteCourseConfirmDialog'
import MainLayout from '@/layouts/main-layout'
import { courseApi, type CourseResponse } from '@/services/api'
import { generateCourseOutline, generateCourseOutlineFromFile } from './course-editor/api/aiApi'

import { useNavigate } from 'react-router'

const DEFAULT_COURSE_IMAGE = 'https://via.placeholder.com/640x360?text=Course'

type ToastMessage = {
  type: 'success' | 'error' | 'loading'
  text: string
}

const MyCourseContent: React.FC = () => {
  const navigate = useNavigate()
  const [newCourseOpen, setNewCourseOpen] = useState<boolean>(false)
  const [courses, setCourses] = useState<CourseResponse[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true)
  const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false)
  const [deletingCourseIds, setDeletingCourseIds] = useState<Set<number>>(new Set())
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false)

  // MERGED: Giữ lại cả toastMessage (UX AI Modal) và coursePendingDelete (Tính năng xoá khoá học)
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)
  const [coursePendingDelete, setCoursePendingDelete] = useState<CourseResponse | null>(null)

  const newCourseBtnRef = useRef<HTMLButtonElement | null>(null)
  const newCourseMenuRef = useRef<HTMLDivElement | null>(null)
  const importScormInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!newCourseOpen) return

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (!target) return

      const btn = newCourseBtnRef.current
      const menu = newCourseMenuRef.current

      if (btn?.contains(target)) return
      if (menu?.contains(target)) return

      setNewCourseOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNewCourseOpen(false)
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [newCourseOpen])

  const fetchCourses = async (mountedRef?: { current: boolean }) => {
    try {
      setIsLoadingCourses(true)
      const response = await courseApi.listCourses()
      if (mountedRef && !mountedRef.current) return
      setCourses(response.data ?? [])
    } catch (error) {
      console.error('Failed to fetch courses', error)
    } finally {
      if (!mountedRef || mountedRef.current) setIsLoadingCourses(false)
    }
  }

  useEffect(() => {
    const mountedRef = { current: true }

    void fetchCourses(mountedRef)

    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleCreateFromScratch = async () => {
    if (isCreatingCourse) return

    try {
      setIsCreatingCourse(true)
      setNewCourseOpen(false)
      const response = await courseApi.createCourse({
        title: 'Untitled Course'
      })
      const courseId = response.data?.courseId
      if (!courseId) return
      navigate(`/my-course/editor/${courseId}`)
    } catch (error) {
      console.error('Failed to create course', error)
    } finally {
      setIsCreatingCourse(false)
    }
  }

  const handleOpenCourse = (courseId: number) => {
    navigate(`/my-course/editor/${courseId}`)
  }

  const handleDeleteCourse = async (courseId: number) => {
    try {
      setDeletingCourseIds((prev) => {
        const next = new Set(prev)
        next.add(courseId)
        return next
      })

      await courseApi.deleteCourse(courseId)
      setCourses((prev) => prev.filter((course) => course.courseId !== courseId))
      setCoursePendingDelete(null)
    } catch (error) {
      console.error('Failed to delete course', error)
    } finally {
      setDeletingCourseIds((prev) => {
        const next = new Set(prev)
        next.delete(courseId)
        return next
      })
    }
  }

  const handleImportScormPackage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setNewCourseOpen(false)
    setToastMessage({ type: 'loading', text: 'Đang import SCORM package, vui lòng chờ...' })

    try {
      const response = await courseApi.importScormPackage(file)
      const courseId = response.data?.courseId
      if (!courseId) throw new Error('Missing imported course id')

      setToastMessage({ type: 'success', text: 'Import SCORM thành công. Đang chuyển đến editor...' })
      navigate(`/my-course/editor/${courseId}`)
    } catch (error) {
      console.error('Failed to import SCORM package', error)
      setToastMessage({ type: 'error', text: 'Import SCORM thất bại. Vui lòng kiểm tra file zip hợp lệ.' })
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className='px-20 bg-gray-100 min-h-screen'>
      {/* 2. LỚP ĐỆM TRẮNG (White Container) */}
      <div className='bg-white h-full shadow-lg px-6 py-4'>
        {/* --- Nội dung chính bắt đầu từ đây --- */}

        {/* Top actions */}
        <div className='flex items-center gap-4 mb-6 h-5'>
          <div className='relative flex-1'>
            <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-blue-800' />
            <input
              type='text'
              placeholder='Type here to search...'
              className='w-full pl-10 pr-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 transition-colors'
            />
          </div>
          <div className='relative'>
            <button
              className='flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={() => setNewCourseOpen((v: boolean) => !v)}
              ref={newCourseBtnRef}
              type='button'
              disabled={toastMessage?.type === 'loading'}
            >
              New Course <FiChevronDown />
            </button>

            {newCourseOpen && (
              <div
                ref={newCourseMenuRef}
                className='absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50'
              >
                <div className='p-1'>
                  <button
                    className='group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-900 hover:bg-green-50 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => {
                      void handleCreateFromScratch()
                    }}
                    type='button'
                    disabled={isCreatingCourse || toastMessage?.type === 'loading'}
                  >
                    <FiFileText className='h-4 w-4' />
                    Create from scratch
                  </button>

                  <button
                    className='group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-900 hover:bg-green-50 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => {
                      setNewCourseOpen(false)
                      setAiModalOpen(true)
                    }}
                    type='button'
                    disabled={toastMessage?.type === 'loading'}
                  >
                    <FiLayers className='h-4 w-4' />
                    Create course with AI
                  </button>

                  <button
                    className='group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-900 hover:bg-green-50 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => importScormInputRef.current?.click()}
                    type='button'
                    disabled={toastMessage?.type === 'loading'}
                  >
                    <FiUpload className='h-4 w-4' />
                    Import SCORM package
                  </button>

                  <input
                    ref={importScormInputRef}
                    type='file'
                    accept='.zip,application/zip'
                    className='hidden'
                    onChange={(e) => {
                      void handleImportScormPackage(e)
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className='mb-6 h-7'>
          <CourseFilter />
        </div>

        {/* Course grid */}
        {isLoadingCourses ? (
          <PageLoading loading={isLoadingCourses} text='Loading courses...' minHeightClassName='min-h-[60vh]' />
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
            {courses.map((course) => (
              <CourseCard
                key={course.courseId}
                title={course.title}
                description={course.description ?? ''}
                image={course.coverImageUrl || DEFAULT_COURSE_IMAGE}
                onClick={() => handleOpenCourse(course.courseId)}
                onDelete={() => {
                  setCoursePendingDelete(course)
                }}
                isDeleting={deletingCourseIds.has(course.courseId)}
              />
            ))}
          </div>
        )}

        {/* --- Kết thúc nội dung chính --- */}
      </div>

      {toastMessage ? (
        <div
          className={`fixed bottom-5 right-5 z-[120] flex items-center gap-3 rounded-xl border px-5 py-4 text-sm shadow-xl backdrop-blur-sm transition-all duration-300 ease-in-out ${
            toastMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50/95 text-emerald-800'
              : toastMessage.type === 'error'
                ? 'border-red-200 bg-red-50/95 text-red-800'
                : 'border-blue-200 bg-blue-50/95 text-blue-800'
          }`}
        >
          {toastMessage.type === 'loading' && (
            <svg
              className='h-5 w-5 animate-spin text-blue-600'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          )}

          <span className='font-medium'>{toastMessage.text}</span>

          {toastMessage.type !== 'loading' && (
            <button
              type='button'
              onClick={() => setToastMessage(null)}
              className={`ml-2 rounded-md p-1.5 transition-colors ${
                toastMessage.type === 'success' ? 'hover:bg-emerald-100' : 'hover:bg-red-100'
              }`}
            >
              <FiX className='h-4 w-4' />
            </button>
          )}
        </div>
      ) : null}

      <CreateCourseWithAIModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onGenerate={async (form, referenceFile) => {
          // 1. Đóng modal ngay lập tức để UX mượt hơn
          setAiModalOpen(false)

          // 2. Hiển thị thông báo trạng thái "Loading"
          setToastMessage({
            type: 'loading',
            text: 'AI đang phân tích và tạo khóa học, vui lòng chờ trong giây lát...'
          })

          try {
            let outline

            if (referenceFile) {
              outline = await generateCourseOutlineFromFile(referenceFile, {
                language: form.language.trim() || 'Vietnamese'
              })
            } else {
              const payload = {
                courseTitle: form.courseTitle.trim(),
                courseDescription: form.courseDescription.trim(),
                targetAudience: form.targetAudience.trim() || 'General learners',
                audienceProficiencyLevel: form.proficiencyLevel || 'Beginner',
                duration: form.duration.trim() || '2 hours',
                language: form.language.trim() || 'Vietnamese',
                learningOutcomes: form.learningGoal.trim(),
                prerequisites: form.requiredKnowledge.trim() || 'Không yêu cầu',
                additionalInstructions: form.additionalInstructions.trim() || undefined
              }
              outline = await generateCourseOutline(payload)
            }

            const created = await courseApi.createCourse({
              title: outline?.title || form.courseTitle.trim() || 'Untitled AI Course',
              description: outline?.description || form.courseDescription.trim() || 'Generated by AI'
            })

            const courseId = created.data?.courseId
            if (courseId) {
              setToastMessage({
                type: 'success',
                text: 'Đã tạo course từ AI thành công. Đang chuyển tới editor...'
              })
              navigate(`/my-course/editor/${courseId}`)
            } else {
              setToastMessage({
                type: 'error',
                text: 'Đã tạo outline AI nhưng chưa mở được editor.'
              })
            }
          } catch (error) {
            console.error('Lỗi khi tạo course bằng AI:', error)
            setToastMessage({
              type: 'error',
              text: 'Có lỗi xảy ra khi tạo course bằng AI. Vui lòng kiểm tra kết nối và thử lại!'
            })
          }
        }}
      />

      <DeleteCourseConfirmDialog
        open={!!coursePendingDelete}
        courseTitle={coursePendingDelete?.title}
        isDeleting={coursePendingDelete ? deletingCourseIds.has(coursePendingDelete.courseId) : false}
        onClose={() => setCoursePendingDelete(null)}
        onConfirm={() => {
          if (!coursePendingDelete) return
          void handleDeleteCourse(coursePendingDelete.courseId)
        }}
      />
    </div>
  )
}

const MyCoursePage: React.FC = () => (
  <MainLayout>
    <MyCourseContent />
  </MainLayout>
)

export default MyCoursePage
