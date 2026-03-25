import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import MainLayout from '@/layouts/main-layout'
import EditorLayout from './components/editor/EditorLayout'
import Sidebar from './components/editor/Sidebar'
import MainEditor from './components/editor/MainEditor'
import { useCourseEditorStore } from './store/use-course-editor-store'
import { loadDraft, saveDraft } from './api/editorApi'
import { hydrateFromPayload } from './utils/hydrateFromPayload'
import AIAssistantPanel from './components/editor/AIAssistantPanel'

export const EditorPage: React.FC = () => {
  const navigate = useNavigate()
  const hydrateStore = useCourseEditorStore((state) => state.hydrateStore)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hydratingRef = useRef(true)

  const hasToken =
    typeof window !== 'undefined' &&
    !!(localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('auth_token'))

  useEffect(() => {
    if (!hasToken) {
      hydratingRef.current = false
      navigate('/')
      return
    }

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
  }, [hasToken, hydrateStore, navigate])

  useEffect(() => {
    if (!hasToken) return

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
  }, [hasToken])

  return (
    <MainLayout>
      <EditorLayout sidebar={<Sidebar />} main={<MainEditor />} />
      <AIAssistantPanel />
    </MainLayout>
  )
}
