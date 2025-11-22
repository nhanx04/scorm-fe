import CreateCourseSide from '../components/CreateCourseSide'
import CourseList from '../components/CourseList'

const HomePage = () => {
  return (
    <div className='h-[calc(100vh-5rem)]'>
      <div className='flex h-[calc(100vh-5rem)] gap-6'>
        {/* Left sidebar fixed width */}
        <div className='w-80 shrink-0 h-full bg-gray-100'>
          <CreateCourseSide />
        </div>
        {/* Right content area fills remaining width */}
        <div className='flex-1 h-full'>
          <div className='mx-auto max-w-5xl px-4 py-6 h-full'>
            <CourseList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
