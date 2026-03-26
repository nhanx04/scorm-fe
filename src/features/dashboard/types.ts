export type CourseStatus = 'Draft' | 'Published' | 'Exported'

export type DashboardCourse = {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  status: CourseStatus
  progress: number
  lastUpdated: string
  category: 'Lessons' | 'Exams' | 'Chapters'
}

export type StatItem = {
  id: string
  title: string
  value: string
  subtext?: string
  icon: 'book' | 'sparkles' | 'package' | 'activity'
}

export type ActionItem = {
  id: string
  title: string
  description: string
  icon: 'plus' | 'sparkles' | 'import' | 'layout' | 'quiz' | 'asset'
}

export type SuggestionItem = {
  id: string
  title: string
  description: string
  cta: string
}

export type TimelineItem = {
  id: string
  title: string
  timestamp: string
  icon: 'edit' | 'export' | 'create'
}

export type TemplateItem = {
  id: string
  title: string
  description: string
  icon: 'layout' | 'code' | 'quiz' | 'building'
}

