import React from 'react'
import { courseApi, scormApi } from '@/services/api'
import { useCourseStore } from '../store/useCourseStore'
import { DesignTab } from './DesignTab'
import { TipTapEditor } from './TipTapEditor'
import { LayoutTab } from './LayoutTab'
import { QuestionFactory } from './questions/QuestionFactory'
import { EditableRichText } from './EditableRichText'

export function PropertyPanel() {
  const selectedElement = useCourseStore((s) => s.selectedElement)
  const selectedBlockId = useCourseStore((s) => s.selectedBlockId)
  const setSelectedBlockId = useCourseStore((s) => s.setSelectedBlockId)
  const selectElement = useCourseStore((s) => s.selectElement)
  const course = useCourseStore((s) => s.course)
  const updateElement = useCourseStore((s) => s.updateElement)
  const exportCourse = useCourseStore((s) => s.exportCourse)
  const undo = useCourseStore((s) => s.undo)
  const redo = useCourseStore((s) => s.redo)
  const deleteElement = useCourseStore((s) => s.deleteElement)
  const [isExporting, setIsExporting] = React.useState(false)
  const [courseIdInput, setCourseIdInput] = React.useState(() => {
    const queryCourseId = new URLSearchParams(window.location.search).get('courseId')
    return queryCourseId ?? ''
  })
  const [packages, setPackages] = React.useState<any[]>([])
  const [isLoadingPackages, setIsLoadingPackages] = React.useState(false)

  const selectedSection = React.useMemo(() => {
    if (selectedElement?.kind !== 'section') return null
    return course.sections.find((section) => section.id === selectedElement.id) ?? null
  }, [course.sections, selectedElement])

  const selectedPage = React.useMemo(() => {
    if (selectedElement?.kind !== 'page') return null
    for (const section of course.sections) {
      const page = section.pages.find((item) => item.id === selectedElement.id)
      if (page) return page
    }
    return null
  }, [course.sections, selectedElement])

  const selectedBlockInfo = React.useMemo(() => {
    if (!selectedBlockId) return null
    for (const section of course.sections) {
      for (const page of section.pages) {
        const block = page.contentPage?.blocks.find((item) => item.id === selectedBlockId)
        if (block) return { block, pageId: page.id }
      }
    }
    return null
  }, [course.sections, selectedBlockId])

  const firstBlockInfo = React.useMemo(() => {
    for (const section of course.sections) {
      for (const page of section.pages) {
        const block = page.contentPage?.blocks[0]
        if (block) return { block, pageId: page.id }
      }
    }
    return null
  }, [course.sections])

  const selectedQuestionInfo = React.useMemo(() => {
    if (selectedElement?.kind !== 'question') return null
    for (const section of course.sections) {
      for (const page of section.pages) {
        const question = page.quizPage?.questions.find((q) => q.id === selectedElement.id)
        if (question) return { question, sectionId: section.id, pageId: page.id }
      }
    }
    return null
  }, [course.sections, selectedElement])

  const [activeTab, setActiveTab] = React.useState<'content' | 'design' | 'layout'>('content')
  const hasAutoSelectedRef = React.useRef(false)

  React.useEffect(() => {
    if (hasAutoSelectedRef.current) return
    if (!selectedBlockId && firstBlockInfo) {
      setSelectedBlockId(firstBlockInfo.block.id)
      selectElement({ kind: 'block', id: firstBlockInfo.block.id, pageId: firstBlockInfo.pageId })
      hasAutoSelectedRef.current = true
    }
  }, [firstBlockInfo, selectElement, selectedBlockId, setSelectedBlockId])

  const loadPackages = React.useCallback(async () => {
    try {
      setIsLoadingPackages(true)
      const response = await scormApi.listPackages()
      setPackages(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('listPackages error', error)
    } finally {
      setIsLoadingPackages(false)
    }
  }, [])

  React.useEffect(() => {
    void loadPackages()
  }, [loadPackages])

  const onExport = async () => {
    const exportedCourse = exportCourse()
    const normalizedCourseId = Number.parseInt(courseIdInput.trim(), 10)

    try {
      setIsExporting(true)

      let courseIdForExport = normalizedCourseId
      if (!Number.isFinite(courseIdForExport) || courseIdForExport <= 0) {
        // Keep auto-create payload minimal to avoid backend JSON mapping/db issues.
        // Full authored data is sent in createCoursePackage snapshot below.
        try {
          const createCourseResponse = await courseApi.createCourse({
            title: exportedCourse.title || 'Untitled Course',
            status: exportedCourse.status || 'DRAFT'
          })

          const newCourseId = createCourseResponse?.data?.courseId
          if (!newCourseId) {
            throw new Error('Cannot create course before export')
          }

          courseIdForExport = Number(newCourseId)
          setCourseIdInput(String(newCourseId))
        } catch (createError) {
          console.error('createCourse error', createError)
          alert('Không thể tự tạo course mới. Vui lòng nhập courseId có sẵn rồi export lại.')
          return
        }
      }

      await scormApi.createCoursePackage(courseIdForExport, {
        packageName: exportedCourse.title || `course-${courseIdForExport}`,
        packageType: 'SCORM_2004',
        editorStateSnapshot: exportedCourse,
        interfaceSnapshot: {
          themeOverride: exportedCourse.themeOverride,
          layoutMeta: exportedCourse.layoutMeta
        }
      })
      await loadPackages()
      alert('SCORM package created successfully')
    } catch (error) {
      console.error('createCoursePackage error', error)
      alert('Failed to create SCORM package')
    } finally {
      setIsExporting(false)
    }
  }

  const onDownloadPackage = async (id: number, packageName?: string) => {
    try {
      const response = await scormApi.downloadPackage(id)
      const blob = new Blob([response.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${packageName || `scorm-${id}`}.zip`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('downloadPackage error', error)
      alert('Failed to download package')
    }
  }

  const onDeletePackage = async (id: number) => {
    try {
      await scormApi.deletePackage(id)
      await loadPackages()
    } catch (error) {
      console.error('deletePackage error', error)
      alert('Failed to delete package')
    }
  }

  return (
    <aside className='sticky top-0 h-screen w-[360px] overflow-y-auto border-l border-gray-100 bg-white p-5'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-gray-800'>Properties</h3>
        <div className='rounded-lg border border-gray-200 p-0.5'>
          <button
            onClick={() => setActiveTab('content')}
            className={`rounded-md px-2 py-1 text-xs ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`rounded-md px-2 py-1 text-xs ${activeTab === 'design' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`rounded-md px-2 py-1 text-xs ${activeTab === 'layout' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
          >
            Layout
          </button>
        </div>
      </div>

      {activeTab === 'content' ? (
        <>
          {selectedSection ? (
            <div className='mt-5 space-y-3 rounded-2xl bg-gray-50 p-4'>
              <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Section settings</p>
              <EditableRichText
                value={selectedSection.title}
                onChange={(html) => updateElement(selectedSection.id, { title: html })}
                placeholder='Section title'
                variant='sectionTitle'
                mode='edit'
              />
              <EditableRichText
                value={selectedSection.description}
                onChange={(html) => updateElement(selectedSection.id, { description: html })}
                placeholder='Section description'
                variant='sectionDescription'
                mode='edit'
              />
            </div>
          ) : null}

          {selectedPage ? (
            <div className='mt-5 space-y-3 rounded-2xl bg-gray-50 p-4'>
              <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Page settings</p>
              <EditableRichText
                value={selectedPage.title}
                onChange={(html) => updateElement(selectedPage.id, { title: html })}
                placeholder='Page title'
                variant='pageTitle'
                mode='edit'
              />
            </div>
          ) : null}

          <div className='mt-5 space-y-3 rounded-2xl bg-gray-50 p-4'>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Block editor</p>
            {!selectedBlockInfo ? (
              <p className='text-sm text-gray-400'>Select a block to edit</p>
            ) : (
              <TipTapEditor
                value={selectedBlockInfo.block.textHtml || ''}
                onChange={(html) => updateElement(selectedBlockInfo.block.id, { textHtml: html })}
              />
            )}
          </div>

          {selectedQuestionInfo ? (
            <div className='mt-5 space-y-3 rounded-2xl bg-gray-50 p-4'>
              <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Question template editor</p>
              <QuestionFactory
                question={selectedQuestionInfo.question}
                mode='editor'
                onChange={(templateData) =>
                  updateElement(selectedQuestionInfo.question.id, {
                    templateData,
                    promptHtml: templateData.prompt
                  })
                }
              />
              <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Live preview</p>
              <QuestionFactory
                question={selectedQuestionInfo.question}
                mode='preview'
                onChange={(templateData) =>
                  updateElement(selectedQuestionInfo.question.id, {
                    templateData,
                    promptHtml: templateData.prompt
                  })
                }
              />
            </div>
          ) : null}
        </>
      ) : activeTab === 'design' ? (
        <div className='mt-5 rounded-2xl bg-gray-50 p-4'>
          <DesignTab />
        </div>
      ) : (
        <div className='mt-5 rounded-2xl bg-gray-50 p-4'>
          <LayoutTab />
        </div>
      )}

      <div className='mt-6 grid grid-cols-2 gap-2'>
        <button onClick={undo} className='rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700'>
          Undo
        </button>
        <button onClick={redo} className='rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700'>
          Redo
        </button>
      </div>
      <div className='mt-2 grid grid-cols-1 gap-2'>
        {selectedElement?.id && selectedElement.id !== 'course-root' ? (
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className='rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700'
          >
            Delete Element
          </button>
        ) : null}
        <button className='rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700'>
          Save as Template
        </button>
        <input
          value={courseIdInput}
          onChange={(e) => setCourseIdInput(e.target.value)}
          placeholder='Backend courseId (optional)'
          className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
        />
        <button
          onClick={onExport}
          disabled={isExporting}
          className='rounded-xl bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isExporting ? 'Exporting...' : 'Export Package'}
        </button>
      </div>

      <div className='mt-4 rounded-2xl border border-gray-200 p-3'>
        <div className='mb-2 flex items-center justify-between'>
          <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Exported Packages</p>
          <button onClick={() => void loadPackages()} className='text-xs text-blue-600'>
            Refresh
          </button>
        </div>
        {isLoadingPackages ? <p className='text-sm text-gray-500'>Loading...</p> : null}
        {!isLoadingPackages && packages.length === 0 ? <p className='text-sm text-gray-400'>No packages yet</p> : null}
        <div className='space-y-2'>
          {packages.map((pkg) => (
            <div key={pkg.scormPackageId} className='rounded-lg bg-gray-50 p-2'>
              <p className='truncate text-sm font-medium text-gray-700'>
                {pkg.packageName || `Package ${pkg.scormPackageId}`}
              </p>
              <p className='text-xs text-gray-500'>{pkg.packageType}</p>
              <div className='mt-2 flex gap-2'>
                <button
                  onClick={() => onDownloadPackage(pkg.scormPackageId, pkg.packageName)}
                  className='rounded bg-emerald-600 px-2 py-1 text-xs text-white'
                >
                  Download
                </button>
                <button
                  onClick={() => onDeletePackage(pkg.scormPackageId)}
                  className='rounded bg-red-600 px-2 py-1 text-xs text-white'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
