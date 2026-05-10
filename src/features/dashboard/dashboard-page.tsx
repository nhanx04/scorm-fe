import React, { useMemo, useState } from 'react'
import { FiPlus, FiSearch, FiStar, FiZap } from 'react-icons/fi'
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
    <div className='flex h-full flex-1 overflow-hidden bg-white'>
      <div className='flex-1 overflow-y-auto bg-white px-16 py-10'>
        <h1 className='mb-6 text-[32px] font-bold text-gray-900'>Dashboard</h1>

        <section className='mb-10 rounded-xl border border-gray-200 bg-gray-50 p-8'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='max-w-2xl space-y-3'>
              <p className='text-xs font-medium uppercase tracking-[0.2em] text-blue-700'>Learning workspace</p>
              <h2 className='text-3xl font-bold text-gray-900'>Continue your learning journey</h2>
              <p className='text-base text-gray-600'>
                Return to your drafting flow, build new SCORM modules, and keep learners on track.
              </p>
              <div className='flex flex-wrap gap-3'>
                <button className='inline-flex items-center gap-2 rounded-full bg-blue-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800'>
                  <FiStar className='h-4 w-4' /> Create with AI
                </button>
                <button className='inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100'>
                  <FiPlus className='h-4 w-4' /> New course
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className='mb-10 space-y-6'>
          <SectionHeader
            title='Learning insights'
            subtitle='A quick snapshot of your learning production this month.'
          />
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
            {dashboardStats.map((item) => (
              <InsightItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className='mb-10 space-y-6'>
          <SectionHeader title='Learning actions' subtitle='Start a new course or extend an existing learning path.' />
          <div className='grid gap-6 md:grid-cols-2'>
            {quickActions.map((item) => (
              <ActionButton key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className='mb-10 space-y-6'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <SectionHeader title='Recent courses' subtitle='Drafts and published modules you were working on.' />
            <div className='flex flex-wrap items-center gap-3 text-sm'>
              {(['All', 'Lessons', 'Exams', 'Chapters'] as CourseFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`rounded-full px-4 py-2 transition-colors ${
                    filter === tab ? 'bg-blue-900 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className='relative max-w-md'>
            <FiSearch className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500' />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className='w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm text-gray-800 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-800'
              placeholder='Search course title...'
            />
          </div>
          <div className='space-y-4'>
            {filteredCourses.map((course) => (
              <CourseListItem key={course.id} course={course} />
            ))}
            {filteredCourses.length === 0 ? (
              <div className='rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-base text-gray-500'>
                No courses match this filter yet.
              </div>
            ) : null}
          </div>
        </section>

        <section className='mb-10 space-y-6'>
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
            <div className='rounded-xl border border-gray-200 bg-white p-6'>
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
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6 text-base text-gray-700'>
              <div className='flex items-center gap-3'>
                <FiZap className='h-5 w-5 text-blue-700' />
                <p className='font-medium'>Need a custom path? Ask AI to draft a course structure.</p>
              </div>
            </div>
          </div>
        </section>
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
