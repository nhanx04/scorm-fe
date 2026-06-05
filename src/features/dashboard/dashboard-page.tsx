import React, { useMemo, useState, useEffect } from 'react'
import { FiSearch, FiZap } from 'react-icons/fi'
import MainLayout from '@/layouts/main-layout'
import { activityTimeline, aiSuggestions, quickActions, templates } from './mock-data'
import {
  CourseListItem,
  SectionHeader,
  HeroBanner,
  ExpandableActionCard,
  ModernAssistantItem,
  ActivityFeed,
  TemplateGrid
} from './components'
import { PageLoading } from '@/components'
import type { DashboardCourse } from './types'
import { courseApi } from '@/services/api'

type CourseFilter = 'All' | 'Lessons' | 'Exams' | 'Chapters'

const DashboardContent: React.FC = () => {
  const [filter, setFilter] = useState<CourseFilter>('All')
  const [search, setSearch] = useState('')
  const [recentCourses, setRecentCourses] = useState<DashboardCourse[]>([])
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    const fetchRecentCourses = async () => {
      try {
        const { data } = await courseApi.getRecentCourses(6)
        setRecentCourses(
          data.map((course) => ({
            id: course.courseId.toString(),
            title: course.title,
            description: course.description || '',
            thumbnailUrl:
              course.coverImageUrl ||
              'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80',
            status: course.status === 'PUBLISHED' ? 'Published' : course.status === 'EXPORTED' ? 'Exported' : 'Draft',
            progress: course.status === 'PUBLISHED' ? 100 : 62,
            lastUpdated: 'Recently',
            category: 'Lessons'
          }))
        )
      } catch (error) {
        console.error('Failed to fetch recent courses:', error)
      } finally {
        setIsPageLoading(false)
      }
    }

    fetchRecentCourses()
  }, [])

  const filteredCourses = useMemo(() => {
    return recentCourses.filter((course) => {
      const filterMatch = filter === 'All' || course.category === filter
      const searchMatch = course.title.toLowerCase().includes(search.toLowerCase())
      return filterMatch && searchMatch
    })
  }, [filter, search, recentCourses])

  if (isPageLoading) {
    return <PageLoading loading={isPageLoading} text='Loading dashboard...' minHeightClassName='min-h-[60vh]' />
  }

  return (
    <div className='flex h-full flex-1 overflow-hidden bg-white'>
      <div className='flex-1 overflow-y-auto bg-white px-16 py-10'>
        <h1 className='mb-6 text-[32px] font-bold text-gray-900'>Dashboard</h1>

        {/* Hero Banner */}
        <HeroBanner />

        {/* Learning Actions - Expandable Cards */}
        <section className='mb-10 space-y-6'>
          <SectionHeader title='Learning actions' subtitle='Start a new course or extend an existing learning path.' />
          <div className='grid gap-4 md:grid-cols-2'>
            {quickActions.map((item) => (
              <ExpandableActionCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Recent Courses */}
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

        {/* AI Learning Assistant */}
        <section className='mb-10 space-y-6'>
          <SectionHeader
            title='AI learning assistant'
            subtitle='Contextual suggestions based on your content creation.'
          />
          <div className='grid gap-6 md:grid-cols-2'>
            {aiSuggestions.map((item) => (
              <ModernAssistantItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Activity Feed & Learning Paths */}
        <section className='grid gap-8 lg:grid-cols-[1.3fr_1fr]'>
          <div className='space-y-6'>
            <SectionHeader title='Learning activity' subtitle='A timeline of creation and export events.' />
            <ActivityFeed items={activityTimeline} />
          </div>
          <div className='space-y-6'>
            <SectionHeader title='Learning paths' subtitle='Starter templates for common course structures.' />
            <TemplateGrid items={templates} />
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
