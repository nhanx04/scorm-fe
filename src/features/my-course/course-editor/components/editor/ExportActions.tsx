import React, { useMemo, useState } from 'react'
import { downloadExportedPackage, ensureExportableCourseId, exportCourse } from '../../api/editorApi'
import { transformToPayload } from '../../utils/transformToPayload'
import { validateCourse } from '../../utils/validateCourse'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import Toast from './Toast'

type Props = { courseId: string | number }

const ExportActions: React.FC<Props> = ({ courseId }) => {
  const state = useCourseEditorStore()
  const mode = useCourseEditorStore((s) => s.mode)
  const setMode = useCourseEditorStore((s) => s.setMode)
  const [packageType, setPackageType] = useState<'SCORM_2004' | 'SCORM_12'>('SCORM_2004')
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const packageName = useMemo(() => {
    const raw = (state.course.title || 'scorm-course').trim().toLowerCase()
    return raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'scorm-course'
  }, [state.course.title])

  const handleExport = async () => {
    const errors = validateCourse(state)
    if (errors.length > 0) {
      setToast({ type: 'error', message: errors[0] })
      return
    }

    try {
      setExporting(true)
      const payload = transformToPayload(state)
      const exportableCourseId = await ensureExportableCourseId({
        courseId,
        title: state.course.title,
        description: state.course.description,
        coverImageUrl: state.course.coverImageUrl,
        editorStateSnapshot: payload.editorStateSnapshot,
        interfaceSnapshot: state.theme
      })
      const result = await exportCourse({
        courseId: exportableCourseId,
        packageName,
        packageType,
        editorStateSnapshot: payload.editorStateSnapshot,
        interfaceSnapshot: state.theme
      })
      await downloadExportedPackage(result.scormPackageId, `${packageName}-${packageType.toLowerCase()}`)
      setToast({ type: 'success', message: `Export ${packageType} thành công.` })
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 401) {
        setToast({ type: 'error', message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' })
      } else {
        setToast({ type: 'error', message: 'Export failed. Please try again.' })
      }
    } finally {
      setExporting(false)
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
      <select
        value={packageType}
        onChange={(e) => setPackageType(e.target.value as 'SCORM_2004' | 'SCORM_12')}
        className='rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700'
      >
        <option value='SCORM_2004'>SCORM 2004</option>
        <option value='SCORM_12'>SCORM 1.2</option>
      </select>
      <button
        type='button'
        onClick={handleExport}
        disabled={exporting}
        className='rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {exporting ? 'Exporting...' : 'Export'}
      </button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default ExportActions
