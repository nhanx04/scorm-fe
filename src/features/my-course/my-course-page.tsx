import React, { useEffect, useRef, useState } from 'react'
import { FiSearch, FiChevronDown, FiFileText, FiLayers } from 'react-icons/fi'
import { CourseCard } from '@/components'
import CourseFilter from './components/CourseFilter'
import CreateCourseWithAIModal from './components/CreateCourseWithAIModal'
import DeleteCourseConfirmDialog from './components/DeleteCourseConfirmDialog'
import MainLayout from '@/layouts/main-layout'
import { courseApi, type CourseResponse } from '@/services/api'
import { generateCourseOutline, generateCourseOutlineFromFile } from './course-editor/api/aiApi'

import { useNavigate } from 'react-router'

const DEFAULT_COURSE_IMAGE = 'https://via.placeholder.com/640x360?text=Course'

const MyCourseContent: React.FC = () => {
  const navigate = useNavigate()
  const [newCourseOpen, setNewCourseOpen] = useState<boolean>(false)
  const [courses, setCourses] = useState<CourseResponse[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true)
  const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false)
  const [deletingCourseIds, setDeletingCourseIds] = useState<Set<number>>(new Set())
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false)
  const [aiActionMessage, setAiActionMessage] = useState<string | null>(null)
  const [coursePendingDelete, setCoursePendingDelete] = useState<CourseResponse | null>(null)
  const newCourseBtnRef = useRef<HTMLButtonElement | null>(null)
  const newCourseMenuRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <div className='px-20 bg-gray-100 min-h-screen'>
      {/* 2. LỚP ĐỆM TRẮNG (White Container): Đây là phần bạn đang thiếu */}
      <div className='bg-white h-full shadow-lg px-6 py-4'>
        {/* --- Nội dung chính bắt đầu từ đây --- */}

        {/* Top actions */}
        <div className='flex items-center gap-4 mb-6 h-5'>
          {' '}
          {/* Thêm mb-6 để tách với filter */}
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
              className='flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors'
              onClick={() => setNewCourseOpen((v: boolean) => !v)}
              ref={newCourseBtnRef}
              type='button'
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
                    className='group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-900 hover:bg-green-50 hover:text-green-800 disabled:opacity-60'
                    onClick={() => {
                      void handleCreateFromScratch()
                    }}
                    type='button'
                    disabled={isCreatingCourse}
                  >
                    <FiFileText className='h-4 w-4' />
                    Create from scratch
                  </button>

                  <button
                    className='group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-900 hover:bg-green-50 hover:text-green-800'
                    onClick={() => {
                      setNewCourseOpen(false)
                      setAiModalOpen(true)
                    }}
                    type='button'
                  >
                    <FiLayers className='h-4 w-4' />
                    Create course with AI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className='mb-6 h-7'>
          {' '}
          {/* Bọc Filter để chỉnh khoảng cách nếu cần */}
          <CourseFilter />
        </div>

        {/* Course grid */}
        {isLoadingCourses ? (
          <div className='text-gray-500'>Loading courses...</div>
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

      {aiActionMessage ? (
        <div className='fixed bottom-5 right-5 z-[120] rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow'>
          <div className='flex items-center gap-3'>
            <span>{aiActionMessage}</span>
            <button
              type='button'
              onClick={() => setAiActionMessage(null)}
              className='text-xs font-medium text-emerald-800 hover:text-emerald-950'
            >
              Đóng
            </button>
          </div>
        </div>
      ) : null}

      <CreateCourseWithAIModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onGenerate={async (form, referenceFile) => {
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

          const outline = referenceFile
            ? await generateCourseOutlineFromFile(referenceFile, payload)
            : await generateCourseOutline(payload)

          const created = await courseApi.createCourse({
            title: outline.title || payload.courseTitle,
            description: outline.description || payload.courseDescription
          })

          const courseId = created.data?.courseId
          if (courseId) {
            setAiActionMessage('Đã tạo course từ AI thành công. Đang chuyển tới editor...')
            navigate(`/my-course/editor/${courseId}`)
          } else {
            setAiActionMessage('Đã tạo outline AI nhưng chưa mở được editor.')
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
