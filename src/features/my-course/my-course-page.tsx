import React, { useEffect, useRef, useState } from 'react'
import {
  FiSearch,
  FiChevronDown,
  FiFileText,
  FiLayers,
  FiX,
  FiPlusCircle,
  FiFolderPlus,
  FiTag,
  FiArrowUp,
  FiArrowDown,
  FiUpload
} from 'react-icons/fi'
import { CourseCard, PageLoading } from '@/components'
import CreateCourseWithAIModal from './components/CreateCourseWithAIModal'
import DeleteCourseConfirmDialog from './components/DeleteCourseConfirmDialog'
import MainLayout from '@/layouts/main-layout'
import { courseApi, type CourseResponse } from '@/services/api'
import { generateCourseOutline, generateCourseOutlineFromFile } from './course-editor/api/aiApi'
import { convertOutlineToEditorState } from './course-editor/api/editorStateConverter'

import { useNavigate } from 'react-router'

type ToastMessage = {
  type: 'success' | 'error' | 'loading'
  text: string
}

const STATUS_FILTERS = ['All', 'Draft', 'In review', 'Ready to publish', 'Published', 'Archived']

const MyCourseContent: React.FC = () => {
  const navigate = useNavigate()
  const [newCourseOpen, setNewCourseOpen] = useState<boolean>(false)
  const [courses, setCourses] = useState<CourseResponse[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true)
  const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false)
  const [deletingCourseIds, setDeletingCourseIds] = useState<Set<number>>(new Set())
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false)

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)
  const [coursePendingDelete, setCoursePendingDelete] = useState<CourseResponse | null>(null)

  // 1. STATE QUẢN LÝ TỪ KHOÁ TÌM KIẾM
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Quản lý bộ lọc trạng thái
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [statusFilterOpen, setStatusFilterOpen] = useState<boolean>(false)
  const statusFilterRef = useRef<HTMLDivElement>(null)

  // Quản lý bộ lọc tag
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [tagFilterOpen, setTagFilterOpen] = useState<boolean>(false)
  const tagFilterRef = useRef<HTMLDivElement>(null)

  const newCourseBtnRef = useRef<HTMLButtonElement | null>(null)
  const newCourseMenuRef = useRef<HTMLDivElement | null>(null)
  const importScormInputRef = useRef<HTMLInputElement | null>(null)

  // Đóng dropdown tạo mới khoá học khi click ra ngoài
  useEffect(() => {
    if (!newCourseOpen) return
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (!target) return
      const btn = newCourseBtnRef.current
      const menu = newCourseMenuRef.current
      if (btn?.contains(target) || menu?.contains(target)) return
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

  // Đóng dropdown lọc trạng thái khi click ra ngoài
  useEffect(() => {
    if (!statusFilterOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) {
        setStatusFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [statusFilterOpen])

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

  const handleCreateFromScratch = () => {
    if (isCreatingCourse) return
    setNewCourseOpen(false)
    navigate('/my-course/editor/new')
  }

  const handleImportScormPackage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setNewCourseOpen(false)
    setToastMessage({ type: 'loading', text: 'Đang import SCORM package, vui lòng chờ...' })

    try {
      // Lưu ý: Đảm bảo courseApi.importScormPackage đã được định nghĩa trong services/api.ts
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

  const handleUpdateCourseStatus = (courseId: number, newStatus: string) => {
    setCourses((prev) =>
      prev.map((course) => (course.courseId === courseId ? { ...course, status: newStatus } : course))
    )
    courseApi.updateCourse(courseId, { status: newStatus }).catch((error) => {
      console.error('Failed to update course status', error)
      setToastMessage({ type: 'error', text: 'Cập nhật trạng thái thất bại' })
      // Rollback
      void fetchCourses()
    })
  }

  // Xử lý thêm Tag cho khóa học
  const handleAddTag = async (courseId: number, newTag: string) => {
    const courseIndex = courses.findIndex((c) => c.courseId === courseId)
    if (courseIndex === -1) return

    const courseToUpdate = courses[courseIndex]
    const currentTags = courseToUpdate.tags || []
    const updatedTags = [...currentTags, newTag]

    // Cập nhật local state trước để UI phản hồi mượt mà (Optimistic Update)
    setCourses((prev) =>
      prev.map((course) => (course.courseId === courseId ? { ...course, tags: updatedTags } : course))
    )

    try {
      // Gọi API cập nhật tags lên DB
      await courseApi.updateCourse(courseId, { tags: updatedTags })
    } catch (error) {
      console.error('Failed to add tag', error)
      setToastMessage({ type: 'error', text: 'Thêm tag thất bại' })
      // Rollback lại state nếu API lỗi
      setCourses((prev) =>
        prev.map((course) => (course.courseId === courseId ? { ...course, tags: currentTags } : course))
      )
    }
  }

  // Xử lý bật/tắt đánh dấu khóa học yêu thích
  const handleFavoriteToggle = async (courseId: number, newFavoriteStatus: boolean) => {
    const courseIndex = courses.findIndex((c) => c.courseId === courseId)
    if (courseIndex === -1) return

    const courseToUpdate = courses[courseIndex]
    const previousStatus = courseToUpdate.isFavorite || false

    // Optimistic Update: Cập nhật UI ngay lập tức
    setCourses((prev) =>
      prev.map((course) => (course.courseId === courseId ? { ...course, isFavorite: newFavoriteStatus } : course))
    )

    try {
      // Gọi API cập nhật isFavorite
      await courseApi.updateCourse(courseId, { isFavorite: newFavoriteStatus })
    } catch (error) {
      console.error('Failed to update favorite status', error)
      setToastMessage({ type: 'error', text: 'Cập nhật trạng thái yêu thích thất bại' })
      // Rollback lại state cũ nếu API lỗi
      setCourses((prev) =>
        prev.map((course) => (course.courseId === courseId ? { ...course, isFavorite: previousStatus } : course))
      )
    }
  }

  // 2. LỌC KHOÁ HỌC KẾT HỢP TRẠNG THÁI & TỪ KHOÁ TÌM KIẾM & TAG
  const filteredCourses = courses.filter((course) => {
    // Lọc theo trạng thái
    const currentStatus = course.status || 'Draft'
    const matchesStatus = selectedStatus === 'All' || currentStatus === selectedStatus

    // Lọc theo từ khoá (tìm trong title và description)
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      course.title.toLowerCase().includes(searchLower) ||
      (course.description?.toLowerCase().includes(searchLower) ?? false)

    // Lọc theo tag - nếu có tag được chọn thì course phải có ít nhất 1 tag trùng
    const matchesTags = selectedTags.size === 0 || (course.tags ?? []).some((tag) => selectedTags.has(tag))

    return matchesStatus && matchesSearch && matchesTags
  })

  // Lấy tất cả unique tags từ tất cả courses
  const allTags = Array.from(new Set(courses.flatMap((course) => course.tags ?? [])))

  return (
    <div className='flex flex-1 h-full bg-white overflow-hidden'>
      {/* 1. SIDEBAR TRÁI */}
      <div className='w-[310px] bg-[#F7F9FA] border-r border-gray-200 shrink-0 flex flex-col p-6 overflow-y-auto'>
        <div className='relative mb-10 w-full mt-4'>
          <button
            ref={newCourseBtnRef}
            onClick={() => setNewCourseOpen((v) => !v)}
            disabled={toastMessage?.type === 'loading'}
            className='w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white py-3 px-4 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            type='button'
          >
            <FiPlusCircle className='w-5 h-5' />
            Create course
          </button>

          {newCourseOpen && (
            <div
              ref={newCourseMenuRef}
              className='absolute left-0 mt-2 w-full origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50'
            >
              <div className='p-1'>
                <button
                  className='group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={() => void handleCreateFromScratch()}
                  type='button'
                  disabled={isCreatingCourse || toastMessage?.type === 'loading'}
                >
                  <FiFileText className='h-4 w-4' />
                  Create from scratch
                </button>
                <button
                  className='group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
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
                  className='group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
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

        <div className='flex flex-col gap-6'>
          <div>
            <h3 className='font-bold text-lg text-gray-900 mb-4'>My courses</h3>
            {/* Course list */}
            <div className='space-y-1 max-h-[400px] overflow-y-auto'>
              {courses.map((course) => (
                <button
                  key={course.courseId}
                  onClick={() => handleOpenCourse(course.courseId)}
                  className='w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-200 cursor-pointer truncate transition-colors'
                  title={course.title}
                >
                  {course.title}
                </button>
              ))}
              {courses.length === 0 && <p className='text-sm text-gray-500 px-3 py-2'>No courses yet</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 2. NỘI DUNG CHÍNH */}
      <div className='flex-1 py-10 px-16 bg-white overflow-y-auto'>
        <h1 className='text-[32px] font-bold text-gray-900 mb-4'>My courses</h1>

        {/* 3. GẮN STATE VÀO THANH TÌM KIẾM */}
        <div className='max-w-[700px] mx-auto mb-8 relative'>
          <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5' />
          <input
            type='text'
            placeholder='Search courses by title or description...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full border border-gray-300 rounded-xl py-3 pl-12 pr-12 text-base focus:outline-none focus:ring-1 focus:ring-gray-800 transition-colors'
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors'
              title='Clear search'
            >
              <FiX className='w-4 h-4' />
            </button>
          )}
        </div>

        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-normal text-gray-500'>Recent</h2>

          <div className='flex items-center gap-4'>
            {/* Bộ lọc trạng thái (Status Filter) */}
            <div className='relative' ref={statusFilterRef}>
              <button
                onClick={() => setStatusFilterOpen((v) => !v)}
                className={`flex items-center gap-2 border rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  selectedStatus !== 'All'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-400 text-gray-800 hover:bg-gray-50'
                }`}
              >
                <FiFileText className='w-4 h-4' />
                {selectedStatus === 'All' ? 'Status' : selectedStatus}
                <FiChevronDown className={`w-4 h-4 transition-transform ${statusFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {statusFilterOpen && (
                <div className='absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20'>
                  {STATUS_FILTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedStatus(s)
                        setStatusFilterOpen(false)
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        selectedStatus === s ? 'font-semibold text-blue-700 bg-blue-50/50' : 'text-gray-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className='relative' ref={tagFilterRef}>
              <button
                onClick={() => setTagFilterOpen((v) => !v)}
                className={`flex items-center gap-2 border rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  selectedTags.size > 0
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-400 text-gray-800 hover:bg-gray-50'
                }`}
              >
                <FiTag className='w-4 h-4' />
                Tags {selectedTags.size > 0 && `(${selectedTags.size})`}
                <FiChevronDown className={`w-4 h-4 transition-transform ${tagFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {tagFilterOpen && (
                <div className='absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20'>
                  {allTags.length === 0 ? (
                    <p className='px-4 py-2 text-sm text-gray-500'>No tags available</p>
                  ) : (
                    allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedTags((prev) => {
                            const next = new Set(prev)
                            if (next.has(tag)) {
                              next.delete(tag)
                            } else {
                              next.add(tag)
                            }
                            return next
                          })
                        }}
                        className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2'
                      >
                        <input
                          type='checkbox'
                          checked={selectedTags.has(tag)}
                          onChange={() => {}}
                          className='cursor-pointer'
                        />
                        <span>{tag}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className='flex flex-col items-center justify-center p-1 hover:bg-gray-100 rounded text-gray-700 transition-colors'>
              <div className='flex -space-x-1'>
                <FiArrowUp className='w-5 h-5' />
                <FiArrowDown className='w-5 h-5' />
              </div>
            </button>
          </div>
        </div>

        {/* Lưới hiển thị danh sách */}
        {isLoadingCourses ? (
          <PageLoading loading={isLoadingCourses} text='Loading courses...' minHeightClassName='min-h-[60vh]' />
        ) : filteredCourses.length === 0 ? (
          <div className='text-gray-400 flex flex-col items-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
            <FiLayers className='w-12 h-12 mb-3 text-gray-300' />
            {/* 4. CẬP NHẬT CÂU THÔNG BÁO KHI KHÔNG TÌM THẤY */}
            <p>
              {searchQuery.trim() !== ''
                ? `No courses found matching search`
                : `No courses found for "${selectedStatus}" status.`}
            </p>
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.courseId}
                title={course.title}
                description={course.description ?? ''}
                image={course.coverImageUrl}
                status={course.status || 'Draft'}
                tags={course.tags || []}
                isFavorite={course.isFavorite} // Đã loại bỏ as any
                onFavoriteToggle={(newStatus) => handleFavoriteToggle(course.courseId, newStatus)}
                onAddTag={(newTag) => handleAddTag(course.courseId, newTag)}
                onStatusChange={(newStatus) => handleUpdateCourseStatus(course.courseId, newStatus)}
                onClick={() => handleOpenCourse(course.courseId)}
                onDelete={() => {
                  setCoursePendingDelete(course)
                }}
                isDeleting={deletingCourseIds.has(course.courseId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS & TOAST */}
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
          setAiModalOpen(false)
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
              description: outline?.description || form.courseDescription.trim() || 'Generated by AI',
              // Round-trip văn bản gốc (chỉ có khi tạo từ file) để backend lưu làm nguồn
              // cho RAG + sinh quiz/nội dung bám tài liệu. Thiếu dòng này → source_document_text NULL.
              sourceDocumentText: outline?.sourceDocumentText,
              editorState: convertOutlineToEditorState(
                outline,
                outline?.description || form.courseDescription.trim() || 'Generated by AI'
              ),
              editorVersion: 'course-editor-v1',
              editorStatus: 'Draft'
            })

            const courseId = created.data?.courseId
            if (!courseId) throw new Error('Failed to create course')

            setToastMessage({
              type: 'success',
              text: 'Đã tạo course từ AI thành công. Đang chuyển tới editor...'
            })
            navigate(`/my-course/editor/${courseId}`)
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
