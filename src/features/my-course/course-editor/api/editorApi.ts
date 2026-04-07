import { api, courseApi, scormApi } from '@/services/api'
import type { EditorState } from '../types/editor.types'

export const saveDraft = async (editorState: EditorState) => {
  const { data } = await api.post('/editor/draft', { editorState })
  return data
}

export const loadDraft = async (courseId: string) => {
  const { data } = await courseApi.getCourseById(courseId)
  const rawSnapshot = (data.editorState ?? data.editorStateSnapshot ?? {}) as Record<string, unknown>
  return {
    editorStateSnapshot: {
      ...rawSnapshot,
      title: (rawSnapshot.title as string | undefined) ?? data.title,
      description: (rawSnapshot.description as string | undefined) ?? data.description ?? '',
      coverImageUrl: (rawSnapshot.coverImageUrl as string | undefined) ?? data.coverImageUrl ?? '',
      passingScore: (rawSnapshot.passingScore as number | undefined) ?? data.passingScore ?? 80,
      attemptLimit: (rawSnapshot.attemptLimit as number | undefined) ?? data.attemptLimit ?? 0,
      durationMin: (rawSnapshot.durationMin as number | undefined) ?? data.durationMin ?? 0
    },
    interfaceSnapshot: data.themeOverride
  }
}

type ExportCoursePayload = {
  courseId: string | number
  packageName: string
  packageType: 'SCORM_12' | 'SCORM_2004'
  editorStateSnapshot: unknown
  interfaceSnapshot?: unknown
}

type EnsureCoursePayload = {
  courseId: string
  title: string
  description?: string
  coverImageUrl?: string
  passingScore?: number
  attemptLimit?: number
  durationMin?: number
  editorStateSnapshot: unknown
  interfaceSnapshot?: unknown
}

export const saveCourseOnly = async ({
  courseId,
  title,
  description,
  coverImageUrl,
  passingScore,
  attemptLimit,
  durationMin,
  editorStateSnapshot,
  interfaceSnapshot
}: EnsureCoursePayload) => {
  const payload = {
    title,
    description,
    coverImageUrl,
    passingScore,
    attemptLimit,
    durationMin,
    status: 'Draft',
    editorState: editorStateSnapshot,
    themeOverride: interfaceSnapshot,
    editorVersion: 'editor-state-v2',
    editorStatus: 'DRAFT'
  }

  if (/^[0-9]+$/.test(courseId)) {
    const { data } = await courseApi.updateCourse(Number(courseId), payload)
    return data.courseId as number
  }

  const { data } = await courseApi.createCourse(payload)
  return data.courseId as number
}

export const exportCourse = async ({
  courseId,
  packageName,
  packageType,
  editorStateSnapshot,
  interfaceSnapshot
}: ExportCoursePayload) => {
  const { data } = await scormApi.createCoursePackage(courseId, {
    packageName,
    packageType,
    editorStateSnapshot,
    interfaceSnapshot
  })
  return data as { scormPackageId: number; packageName?: string; packageType?: string; cloudUrl?: string }
}

export const ensureExportableCourseId = async ({
  courseId,
  title,
  description,
  coverImageUrl,
  passingScore,
  attemptLimit,
  durationMin,
  editorStateSnapshot,
  interfaceSnapshot
}: EnsureCoursePayload) => {
  if (/^[0-9]+$/.test(courseId)) return Number(courseId)

  const { data } = await courseApi.createCourse({
    title,
    description,
    coverImageUrl,
    passingScore,
    attemptLimit,
    durationMin,
    status: 'Draft',
    editorState: editorStateSnapshot,
    themeOverride: interfaceSnapshot,
    editorVersion: 'editor-state-v2',
    editorStatus: 'DRAFT'
  })

  return data.courseId as number
}

export const downloadExportedPackage = async (packageId: number | string, fallbackName = 'scorm-package') => {
  const response = await scormApi.downloadPackage(packageId)
  const blob = response.data as Blob
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fallbackName}.zip`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
