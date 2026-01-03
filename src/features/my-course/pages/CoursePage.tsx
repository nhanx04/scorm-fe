import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FiArrowLeft } from 'react-icons/fi'
import CourseList, { type Course } from '../components/CourseList'
import { scormApi, type CreateScormPackageRequest } from '../../../services/api'
import ScormBuilder from '../components/ScormBuilder'

const CoursePage = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<'list' | 'create'>('list')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPackage, setCurrentPackage] = useState<any>(null)

  const loadCourses = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await scormApi.listPackages()
      const data = Array.isArray(res.data) ? res.data : []
      const mapped: Course[] = data.map((p: any) => ({
        id: String(p.id),
        title: p.title || 'Untitled',
        description: p.description || `Modified: ${new Date(p.updatedAt || p.createdAt).toLocaleDateString()}`,
        imageUrl: p.imageUrl || 'https://images.pexels.com/photos/3184429/pexels-photo-3184429.jpeg',
        modifiedAt: (p.updatedAt || p.createdAt || new Date().toISOString()).slice(0, 10),
        packageUrl: p.packageUrl
      }))
      setCourses(mapped)
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || 'Không tải được danh sách khóa học. Vui lòng đăng nhập lại.'
      setError(errorMsg)
      if (e.response?.status === 401) {
        // Redirect to login if unauthorized
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleCreatePackage = async (payload: CreateScormPackageRequest) => {
    setError(null)
    setLoading(true)
    try {
      const response = await scormApi.createPackage(payload)
      setCurrentPackage(response.data)
      // Keep editor open after create so user can download package
      setView('create')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Tạo gói SCORM thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPackage = async () => {
    if (!currentPackage?.id) return

    try {
      // This will trigger file download in browser
      window.open(currentPackage.packageUrl, '_blank')
    } catch (e) {
      setError('Xuất gói SCORM thất bại. Vui lòng thử lại.')
    }
  }

  const handleBackToList = () => {
    setView('list')
    setCurrentPackage(null)
    loadCourses()
  }

  return (
    <div className='min-h-[calc(100vh-5rem)] bg-gray-50'>
      <div className='w-full pl-4 pr-4 lg:pl-6 lg:pr-10 py-6'>
        {view === 'list' ? (
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sidebar */}
            <div className='w-full lg:w-72 shrink-0'>
              <div className='sticky top-6 space-y-6'>
                <button
                  onClick={() => setView('create')}
                  className='w-full rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-green-700'
                >
                  Create course
                </button>

                <div className='rounded-lg bg-white shadow'>
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <div className='text-sm font-semibold text-gray-900'>My courses</div>
                  </div>
                  <div className='p-2 text-sm'>
                    <button className='w-full flex items-center justify-between rounded-md px-3 py-2 text-left hover:bg-gray-50'>
                      <span className='text-gray-800'>My courses</span>
                      <span className='text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-700'>
                        {courses.length}
                      </span>
                    </button>
                    <button className='w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-gray-500 hover:bg-gray-50'>
                      <span>Shared courses</span>
                      <span className='text-xs rounded-full bg-gray-100 px-2 py-0.5'>0</span>
                    </button>
                    <button className='w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-gray-500 hover:bg-gray-50'>
                      <span>Deleted courses</span>
                      <span className='text-xs rounded-full bg-gray-100 px-2 py-0.5'>0</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className='flex-1'>
              {error && (
                <div className='mb-4 rounded-md bg-red-50 p-4'>
                  <div className='flex'>
                    <div className='flex-shrink-0'>
                      <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <h3 className='text-sm font-medium text-red-800'>{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <CourseList courses={courses} loading={loading} />
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200 flex items-center'>
              <button
                onClick={handleBackToList}
                className='mr-4 p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                <FiArrowLeft className='h-5 w-5' />
              </button>
              <h1 className='text-lg font-medium text-gray-900'>
                {currentPackage ? 'Chỉnh sửa gói SCORM' : 'Tạo gói SCORM mới'}
              </h1>
              {currentPackage?.packageUrl && (
                <div className='ml-auto'>
                  <button
                    onClick={handleExportPackage}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  >
                    Xuất gói SCORM
                  </button>
                </div>
              )}
            </div>
            <div className='p-6'>
              <ScormBuilder initialData={currentPackage} onSubmit={handleCreatePackage} loading={loading} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursePage
