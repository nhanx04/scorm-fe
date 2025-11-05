import logo from '../../assets/scorm.png'

export function Welcome() {
  return (
    <main className='flex items-center justify-center pt-16 pb-4'>
      <div className='flex-1 flex flex-col items-center gap-16 min-h-0'>
        <header className='flex flex-col items-center gap-9'>
          <div className='w-[500px] max-w-[100vw] p-4'>
            <img src={logo} alt='React Router' className='block w-full dark:hidden' />
            <img src={logo} alt='React Router' className='hidden w-full dark:block' />
          </div>
        </header>
        <button className='px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer'>
          Đăng nhập
        </button>
        <button className='px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer'>
          Đăng ký
        </button>
      </div>
    </main>
  )
}
