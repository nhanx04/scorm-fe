import React, { useState } from 'react'
import { exportCourse } from '../../api/editorApi'
import { transformToPayload } from '../../utils/transformToPayload'
import { validateCourse } from '../../utils/validateCourse'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import Toast from './Toast'

type Props = { courseId: string }

const ExportActions: React.FC<Props> = ({ courseId }) => {
  const state = useCourseEditorStore()
  const mode = useCourseEditorStore((s) => s.mode)
  const setMode = useCourseEditorStore((s) => s.setMode)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleExport = async () => {
    const errors = validateCourse(state)
    if (errors.length > 0) {
      setToast({ type: 'error', message: errors[0] })
      return
    }

    try {
      const payload = transformToPayload(state)
      await exportCourse({ ...payload, courseId })
      setToast({ type: 'success', message: 'Export started successfully.' })
    } catch {
      setToast({ type: 'error', message: 'Export failed. Please try again.' })
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <button
        type='button'
        onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}
        className='rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100'
      >
        {mode === 'preview' ? 'Exit Preview' : 'Preview'}
      </button>
      <button
        type='button'
        onClick={handleExport}
        className='rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700'
      >
        Export
      </button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default ExportActions
