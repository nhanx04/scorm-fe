import React from 'react'
import { useNavigate, useLocation } from 'react-router'
import logo from '../assets/scorm.png'

const Header: React.FC = () => {
  const nevigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const handleNavigate = (path: string) => {
    nevigate(path)
  }

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/home',
      active: currentPath === '/home'
    },
    {
      id: 'course',
      label: 'Courses',
      path: '/course',
      active: currentPath === '/courses'
    },
    {
      id: 'library',
      label: 'My library',
      path: '/library',
      active: currentPath === '/library'
    },
    {
      id: 'organization',
      label: 'My organization',
      path: '/organization',
      active: currentPath === '/organization'
    },
    {
      id: 'connection',
      label: 'Connection',
      path: '/connection',
      active: currentPath === '/connection'
    }
  ]

  return (
    <header className='bg-white border-b border-gray-200 h-20 flex justify-center'>
      <div className='flex items-center w-full'>
        {/* Logo */}
        <div className='flex items-center ml-10 mr-6'>
          <img src={logo} alt='Logo Scorm' className='w-30 h-15'></img>
        </div>
        {/* Menu */}
        <div className='flex items-center space-x-8 mr-1 w-2/5'>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={`flex items-center h-20 space-x-3 px-1 py-3 text-left cursor-pointer transition-colors text-base font-medium ${item.active ? 'text-blue-950 border-b-4 border-blue-950' : 'text-gray-500 hover:text-blue-700 border-b-4 border-transparent'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
