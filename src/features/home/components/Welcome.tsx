import { FaPlus } from 'react-icons/fa'

const Welcome = () => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='m-0 text-2xl font-bold'>Hello, Nhan</h1>
        <p className='mt-1.5 text-gray-600'>Turn your expertise into engaging courses—quick and easy!</p>
      </div>
      <button className='cursor-pointer rounded-full border-none bg-blue-900 py-2.5 px-5 text-base text-white hover:bg-blue-400 flex items-center'>
        <FaPlus className='inline-block mr-1' />
        Create course
      </button>
    </div>
  )
}

export default Welcome
