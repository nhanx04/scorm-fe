import Welcome from '../components/Welcome'
import RecentActivity from '../components/RecentActivity'
import PopularTemplates from '../components/PopularTemplates'

const HomePage = () => {
  return (
    <div className='p-10 ml-20 mr-20'>
      <div className='flex gap-10'>
        <div className='flex-[4]'>
          <Welcome />
          <RecentActivity />
        </div>
        <div className='flex-1 bg-blue-900 p-5'>
          <PopularTemplates />
        </div>
      </div>
    </div>
  )
}

export default HomePage
