import React, { useEffect, useRef } from 'react'
import MainLayout from '@/layouts/main-layout'
import EditorLayout from './components/editor/EditorLayout'
import Sidebar from './components/editor/Sidebar'
import MainEditor from './components/editor/MainEditor'
import { useCourseEditorStore } from './store/use-course-editor-store'
import { loadDraft, saveDraft } from './api/editorApi'
import { hydrateFromPayload } from './utils/hydrateFromPayload'

export const EditorPage: React.FC = () => {
  const hydrateStore = useCourseEditorStore((state) => state.hydrateStore)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hydratingRef = useRef(true)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const draft = await loadDraft('current')
        if (!mounted || !draft) return
        const hydrated = hydrateFromPayload(draft)
        hydrateStore(hydrated)
      } catch {
        // no-op: create new course if no draft found
      } finally {
        hydratingRef.current = false
      }
    })()

    return () => {
      mounted = false
    }
  }, [hydrateStore])

  useEffect(() => {
    const unsub = useCourseEditorStore.subscribe((state) => {
      if (hydratingRef.current) return

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        void saveDraft(state)
      }, 800)
    })

    return () => {
      unsub()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <MainLayout>
      <EditorLayout sidebar={<Sidebar />} main={<MainEditor />} />
    </MainLayout>
  )
}
