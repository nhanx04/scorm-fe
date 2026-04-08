import React, { useMemo, useState } from 'react'
import { Plus, Search, Sparkles, Wand2 } from 'lucide-react'
import MainLayout from '@/layouts/main-layout'
import { activityTimeline, aiSuggestions, dashboardStats, quickActions, recentCourses, templates } from './mock-data'
import {
  ActionButton,
  AssistantItem,
  CourseListItem,
  InsightItem,
  PathCard,
  SectionHeader,
  TimelineItemRow
} from './components'
import { PageLoading } from '@/components'

type CourseFilter = 'All' | 'Lessons' | 'Exams' | 'Chapters'

const DashboardContent: React.FC = () => {
  const [filter, setFilter] = useState<CourseFilter>('All')
  const [search, setSearch] = useState('')

  const isPageLoading = false

  const filteredCourses = useMemo(() => {
    return recentCourses.filter((course) => {
      const filterMatch = filter === 'All' || course.category === filter
      const searchMatch = course.title.toLowerCase().includes(search.toLowerCase())
      return filterMatch && searchMatch
    })
  }, [filter, search])

  if (isPageLoading) {
    return <PageLoading loading={isPageLoading} text='Loading dashboard...' minHeightClassName='min-h-[60vh]' />
  }

  return (
    <div className='px-4 md:px-8 lg:px-20 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
      <div className='bg-white dark:bg-slate-900 shadow-xl dark:shadow-none border border-slate-200/70 dark:border-slate-800 px-6 py-8 rounded-sm'>
        <div className='mx-auto flex w-full max-w-7xl flex-col gap-12'>
          <section className='flex flex-col gap-8 rounded-sm bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800/60 dark:to-slate-700/60 p-8 border-b border-indigo-700 dark:border-slate-700'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
              <div className='max-w-2xl space-y-3'>
                <p className='text-xs uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 font-medium'>
                  Learning workspace
                </p>
                <h1 className='text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight'>
                  Continue your learning journey
                </h1>
                <p className='text-base text-slate-600 dark:text-slate-300 leading-relaxed'>
                  Return to your drafting flow, build new SCORM modules, and keep learners on track.
                </p>
                <div className='flex flex-wrap gap-4'>
                  <button className='inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:scale-105'>
                    <Sparkles className='h-5 w-5' /> Create with AI
                  </button>
                  <button className='inline-flex items-center gap-3 rounded-full border-2 border-slate-300 dark:border-slate-600 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md'>
                    <Plus className='h-5 w-5' /> New course
                  </button>
                </div>
              </div>
              <div className='w-full max-w-md rounded-sm border-2 border-slate-200/70 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-sm'>
                <p className='text-xs uppercase text-slate-500 dark:text-slate-400 font-medium'>Last edited course</p>
                <p className='mt-3 text-lg font-bold text-slate-900 dark:text-slate-100'>
                  React Security and Authentication Patterns
                </p>
                <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>Updated 2 hours ago · 14 lessons</p>
                <button className='mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md'>
                  Continue editing
                </button>
              </div>
            </div>
          </section>

          <section className='space-y-6'>
            <SectionHeader
              title='Learning insights'
              subtitle='A quick snapshot of your learning production this month.'
            />
            <div className='grid gap-6 bg-green-200 md:grid-cols-2 xl:grid-cols-4 p-4'>
              {dashboardStats.map((item) => (
                <InsightItem key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className='space-y-6'>
            <SectionHeader
              title='Learning actions'
              subtitle='Start a new course or extend an existing learning path.'
            />
            <div className='grid gap-6 md:grid-cols-2'>
              {quickActions.map((item) => (
                <ActionButton key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className='space-y-6'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
              <SectionHeader title='Recent courses' subtitle='Drafts and published modules you were working on.' />
              <div className='flex flex-wrap items-center gap-3 text-sm'>
                {(['All', 'Lessons', 'Exams', 'Chapters'] as CourseFilter[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`rounded-full px-4 py-2 transition-all duration-300 ${
                      filter === tab
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-105'
                        : 'border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className='relative max-w-md'>
              <Search className='absolute left-4 top-3 h-5 w-5 text-slate-400 dark:text-slate-500' />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className='w-full rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-3 pl-12 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all'
                placeholder='Search course title...'
              />
            </div>
            <div className='space-y-4  bg-sky-100 p-4'>
              {filteredCourses.map((course) => (
                <CourseListItem key={course.id} course={course} />
              ))}
              {filteredCourses.length === 0 ? (
                <div className='rounded-sm border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-800/40 p-8 text-center text-base text-slate-600 dark:text-slate-400'>
                  No courses match this filter yet.
                </div>
              ) : null}
            </div>
          </section>

          <section className='space-y-6'>
            <SectionHeader
              title='AI learning assistant'
              subtitle='Contextual suggestions based on your content creation.'
            />
            <div className='grid gap-6 md:grid-cols-2'>
              {aiSuggestions.map((item) => (
                <AssistantItem key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className='grid gap-8 lg:grid-cols-[1.3fr_1fr]'>
            <div className='space-y-6'>
              <SectionHeader title='Learning activity' subtitle='A timeline of creation and export events.' />
              <div className='rounded-sm border-2 border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900/60 p-6'>
                {activityTimeline.map((item, idx) => (
                  <TimelineItemRow key={item.id} item={item} isLast={idx === activityTimeline.length - 1} />
                ))}
              </div>
            </div>
            <div className='space-y-6'>
              <SectionHeader title='Learning paths' subtitle='Starter templates for common course structures.' />
              <div className='grid gap-4 sm:grid-cols-2'>
                {templates.map((item) => (
                  <PathCard key={item.id} item={item} />
                ))}
              </div>
              <div className='rounded-sm border-2 border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800/60 dark:to-slate-700/60 p-6 text-base text-slate-700 dark:text-slate-300'>
                <div className='flex items-center gap-3'>
                  <Wand2 className='h-5 w-5 text-indigo-600 dark:text-indigo-400' />
                  <p className='font-medium'>Need a custom path? Ask AI to draft a course structure.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

const DashboardPage: React.FC = () => (
  <MainLayout>
    <DashboardContent />
  </MainLayout>
)

export default DashboardPage
