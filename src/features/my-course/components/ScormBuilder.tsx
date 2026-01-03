import React, { useState } from 'react'
import { FiPlus, FiSave, FiDownload } from 'react-icons/fi'
import type { CreateScormPackageRequest, ReviewMode } from '../../../services/api'
import QuestionList from './QuestionList'

type Props = {
  initialData?: any
  onSubmit: (payload: CreateScormPackageRequest) => Promise<void>
  loading?: boolean
}

const defaultPayload: CreateScormPackageRequest = {
  welcomeVideoUrl: '',
  themeJson: '{"primaryColor": "#007bff"}',
  title: '',
  description: '',
  passingScore: 80,
  maxAttempts: 3,
  reviewMode: 'REVIEW_WITH_ANSWERS',
  questions: []
}

const reviewModeOptions: { value: ReviewMode; label: string }[] = [
  { value: 'NO_REVIEW', label: 'Không cho xem lại' },
  { value: 'REVIEW_WITHOUT_ANSWERS', label: 'Xem lại không hiển thị đáp án' },
  { value: 'REVIEW_WITH_ANSWERS', label: 'Xem lại có hiển thị đáp án' }
]

const ScormBuilder: React.FC<Props> = ({ initialData, onSubmit, loading }) => {
  const [payload, setPayload] = useState<CreateScormPackageRequest>({
    ...defaultPayload,
    ...initialData,
    questions: initialData?.questions?.length ? initialData.questions : []
  })
  const [activeTab, setActiveTab] = useState<'settings' | 'questions'>('settings')

  const handleChange = (field: keyof CreateScormPackageRequest, value: any) => {
    setPayload((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuestionsChange = (questions: any[]) => {
    handleChange('questions', questions)
  }

  const handleSubmit = async () => {
    // Validate before submit
    if (!payload.title.trim()) {
      alert('Vui lòng nhập tiêu đề gói SCORM')
      return
    }

    if (payload.questions.length === 0) {
      if (!confirm('Bạn chưa thêm câu hỏi nào. Bạn có muốn tiếp tục không?')) {
        return
      }
    }

    await onSubmit(payload)
  }

  return (
    <div className='rounded-md border border-gray-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50 shadow-sm'>
      {/* Top tabs */}
      <div className='sticky top-0 z-10 rounded-md border-b border-gray-200 bg-blue-200 backdrop-blur'>
        <nav className='-mb-px flex space-x-8'>
          <button
            type='button'
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xl ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Cài đặt chung
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('questions')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xl ${
              activeTab === 'questions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Câu hỏi ({payload.questions?.length || 0})
          </button>
        </nav>
      </div>

      {activeTab === 'settings' ? (
        <div className='space-y-8 px-6 py-8'>
          <div>
            <h3 className='text-lg font-medium text-black mb-2'>THÔNG TIN CƠ BẢN</h3>
            <p className='text-sm text-blue-800'>Nhập thông tin chung cho gói SCORM của bạn.</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8'>
            <div className='md:col-span-2'>
              <label className='block text-lg font-medium text-blue-950'>Tiêu đề *</label>
              <input
                value={payload.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className='mt-1 block w-full bg-white rounded-sm border-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-base py-2.5 px-3.5'
                placeholder='Ví dụ: Kiểm tra kiến thức an toàn thông tin'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-lg font-medium text-blue-950'>Mô tả</label>
              <textarea
                value={payload.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className='mt-1 block w-full rounded-sm border-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-2.5 px-3.5'
                rows={3}
                placeholder='Mô tả chi tiết về gói SCORM này...'
              />
            </div>

            <div>
              <label className='block text-lg font-medium text-blue-950'>Điểm đạt yêu cầu (%) *</label>
              <input
                type='number'
                min='0'
                max='100'
                value={payload.passingScore}
                onChange={(e) => handleChange('passingScore', Number(e.target.value))}
                className='mt-1 block w-full rounded-sm border-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-2.5 px-3.5'
              />
            </div>

            <div>
              <label className='block text-lg font-medium text-blue-950'>Số lần thử tối đa</label>
              <input
                type='number'
                min='1'
                value={payload.maxAttempts}
                onChange={(e) => handleChange('maxAttempts', Number(e.target.value))}
                className='mt-1 block w-full rounded-sm border-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-2.5 px-3.5'
              />
            </div>

            <div>
              <label className='block text-lg font-medium text-blue-950'>Chế độ xem lại</label>
              <select
                value={payload.reviewMode}
                onChange={(e) => handleChange('reviewMode', e.target.value as ReviewMode)}
                className='mt-1 block w-full rounded-sm border-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-2.5 px-3.5'
              >
                {reviewModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-lg font-medium text-blue-950'>Video chào mừng (URL)</label>
              <input
                type='url'
                value={payload.welcomeVideoUrl || ''}
                onChange={(e) => handleChange('welcomeVideoUrl', e.target.value)}
                className='mt-1 block w-full rounded-sm border-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-2.5 px-3.5'
                placeholder='https://example.com/video.mp4'
              />
            </div>
          </div>

          <div className='pt-2'>
            <label className='block text-lg font-medium text-blue-950 mb-1'>Tùy chỉnh giao diện (JSON)</label>
            <textarea
              value={payload.themeJson}
              onChange={(e) => handleChange('themeJson', e.target.value)}
              className='block w-full rounded-sm border-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm h-44 py-3 px-3.5 bg-white/70'
              placeholder='{"primaryColor": "#007bff", "fontFamily": "Arial, sans-serif"}'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Định dạng JSON để tùy chỉnh giao diện. Để trống để sử dụng mặc định.
            </p>
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Quản lý câu hỏi</h3>
            <p className='text-sm text-gray-500'>Thêm và chỉnh sửa các câu hỏi cho bài kiểm tra.</p>
          </div>

          <QuestionList questions={payload.questions || []} onChange={handleQuestionsChange} />
        </div>
      )}

      <div className='flex justify-between pt-6 border-t bg-white/60 backdrop-blur px-6 py-4 rounded-sm'>
        <div className='text-sm text-gray-500'>
          {payload.questions?.length || 0} câu hỏi
          {payload.passingScore > 0 && ` • Điểm đạt: ${payload.passingScore}%`}
        </div>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={() => setActiveTab(activeTab === 'settings' ? 'questions' : 'settings')}
            className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            {activeTab === 'settings' ? 'Tiếp theo: Câu hỏi' : 'Quay lại Cài đặt'}
          </button>

          <button
            type='button'
            disabled={loading}
            onClick={handleSubmit}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            {loading ? (
              'Đang xử lý...'
            ) : (
              <>
                {initialData?.id ? (
                  <>
                    <FiSave className='-ml-1 mr-2 h-4 w-4' />
                    Cập nhật
                  </>
                ) : (
                  <>
                    <FiDownload className='-ml-1 mr-2 h-4 w-4' />
                    Tạo gói SCORM
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScormBuilder
