import type { ActionItem, DashboardCourse, StatItem, SuggestionItem, TemplateItem, TimelineItem } from './types'

export const dashboardStats: StatItem[] = [
  { id: 'total', title: 'Total Courses', value: '24', subtext: '+3 this week', icon: 'book' },
  { id: 'exports', title: 'SCORM Packages Exported', value: '58', subtext: '12 in this month', icon: 'package' },
  { id: 'ai', title: 'AI-generated Courses', value: '17', subtext: '71% adoption rate', icon: 'sparkles' },
  { id: 'activity', title: 'Last Activity', value: '2h ago', subtext: 'Edited React Security Course', icon: 'activity' }
]

export const quickActions: ActionItem[] = [
  { id: 'create', title: 'Create Course', description: 'Start a new structured course', icon: 'plus' },
  { id: 'ai', title: 'Generate with AI', description: 'Create outline and chapters instantly', icon: 'sparkles' },
  { id: 'import', title: 'Import SCORM', description: 'Bring existing SCORM package', icon: 'import' },
  { id: 'templates', title: 'Browse Templates', description: 'Use proven learning structures', icon: 'layout' },
  { id: 'quiz', title: 'Create Quiz', description: 'Build quiz pages with AI support', icon: 'quiz' },
  { id: 'assets', title: 'Manage Assets', description: 'Organize images, videos, docs', icon: 'asset' }
]

export const recentCourses: DashboardCourse[] = [
  {
    id: 'c1',
    title: 'Spring Boot Fundamentals for Backend Teams',
    description: 'Core architecture, APIs, validation, and deployment workflow.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80',
    status: 'Draft',
    progress: 62,
    lastUpdated: '20 minutes ago',
    category: 'Lessons'
  },
  {
    id: 'c2',
    title: 'React Security and Authentication Patterns',
    description: 'Token handling, route protection, and secure UI patterns.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    status: 'Published',
    progress: 100,
    lastUpdated: '2 hours ago',
    category: 'Chapters'
  },
  {
    id: 'c3',
    title: 'Workplace Safety Compliance Assessment',
    description: 'Scenario-driven assessment mapped to policy standards.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80',
    status: 'Exported',
    progress: 100,
    lastUpdated: 'Yesterday',
    category: 'Exams'
  }
]

export const aiSuggestions: SuggestionItem[] = [
  {
    id: 's1',
    title: 'Generate quiz for your React course',
    description: 'Create 10 mixed questions from latest chapter content.',
    cta: 'Generate now'
  },
  {
    id: 's2',
    title: 'Convert this course into SCORM package',
    description: 'Export in SCORM 2004 with completion tracking enabled.',
    cta: 'Start export'
  },
  {
    id: 's3',
    title: 'Improve learning outcomes section',
    description: 'AI can rewrite outcomes to be measurable and clearer.',
    cta: 'Suggest improvements'
  }
]

export const activityTimeline: TimelineItem[] = [
  { id: 't1', title: 'Created course “Kubernetes Basics”', timestamp: 'Today, 09:20', icon: 'create' },
  { id: 't2', title: 'Edited lesson “JWT Refresh Token Flow”', timestamp: 'Today, 08:45', icon: 'edit' },
  { id: 't3', title: 'Exported “Safety Compliance 101” to SCORM', timestamp: 'Yesterday, 18:12', icon: 'export' }
]

export const templates: TemplateItem[] = [
  {
    id: 'tp1',
    title: 'E-learning basic',
    description: 'Intro, theory slides, quiz and summary.',
    icon: 'layout'
  },
  {
    id: 'tp2',
    title: 'Technical training',
    description: 'Hands-on modules with code walkthrough structure.',
    icon: 'code'
  },
  {
    id: 'tp3',
    title: 'Quiz-based course',
    description: 'Assessment-first format with adaptive hints.',
    icon: 'quiz'
  },
  {
    id: 'tp4',
    title: 'Corporate training',
    description: 'Compliance-focused flow for internal teams.',
    icon: 'building'
  }
]

