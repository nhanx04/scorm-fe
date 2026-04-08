import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import MainLayout from '@/layouts/main-layout'
import { PageLoading } from '@/components'
import EditorLayout from './components/editor/EditorLayout'
import Sidebar from './components/editor/Sidebar'
import MainEditor from './components/editor/MainEditor'
import { useCourseEditorStore } from './store/use-course-editor-store'
import { loadDraft, saveDraft } from './api/editorApi'
import { hydrateFromPayload } from './utils/hydrateFromPayload'
import AIAssistantPanel from './components/editor/AIAssistantPanel'

export const EditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>()
  const hydrateStore = useCourseEditorStore((state) => state.hydrateStore)
  const resetStore = useCourseEditorStore((state) => state.resetStore)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hydratingRef = useRef(true)
  const [isPageLoading, setIsPageLoading] = useState(true)

  const hasToken =
    typeof window !== 'undefined' &&
    !!(localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('auth_token'))

  useEffect(() => {
    let mounted = true

    if (!hasToken) {
      hydratingRef.current = false
      setIsPageLoading(false)
      navigate('/')
      return () => {
        mounted = false
      }
    }

    if (!courseId) {
      hydratingRef.current = false
      setIsPageLoading(false)
      navigate('/my-course')
      return () => {
        mounted = false
      }
    }

    const isNewCourse = courseId === 'new'
    hydratingRef.current = true
    setIsPageLoading(true)
    ;(async () => {
      try {
        if (isNewCourse) {
          resetStore()
          return
        }

        const draft = await loadDraft(courseId)
        if (!mounted || !draft) return
        const hydrated = hydrateFromPayload(draft)
        hydrateStore(hydrated)
      } catch {
        // if no draft found or fetch failed, fallback to a blank editor for safety
        if (mounted) resetStore()
      } finally {
        if (mounted) {
          hydratingRef.current = false
          setIsPageLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [courseId, hasToken, hydrateStore, navigate, resetStore])

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

  if (isPageLoading) {
    return (
      <MainLayout>
        <PageLoading loading={isPageLoading} text='Loading course...' />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <EditorLayout sidebar={<Sidebar />} main={<MainEditor />} />
      <AIAssistantPanel />
    </MainLayout>
  )
}
