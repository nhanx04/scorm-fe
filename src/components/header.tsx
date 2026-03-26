import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { FiBell, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const fullName = user ? [user.fname, user.minit, user.lname].filter(Boolean).join(' ') : ''
  const initials = user ? [user.fname?.[0], user.lname?.[0]].filter(Boolean).join('').toUpperCase() : ''

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'course', label: 'Course', path: '/my-course' },
    { id: 'library', label: 'Library', path: '/library' },
    { id: 'organization', label: 'Organization', path: '/organization' }
  ]

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    // 1. Giữ nguyên h-12 hoặc tăng lên h-14/h-16 nếu muốn thoáng hơn
    <header className='bg-white border-b border-gray-200 h-13 flex items-center px-8 justify-between'>
      {/* Left: Logo & Nav Container */}
      <div className='flex items-center h-full'>
        {' '}
        {/* Wrapper để giữ logo và nav cùng dòng */}
        <h1 className='text-2xl font-bold text-blue-900 cursor-pointer select-none mr-12' onClick={() => navigate('/')}>
          SCORMGO
        </h1>
        {/* Nav */}
        {/* 2. Thêm h-full để Nav chiếm hết chiều cao header */}
        <nav className='flex space-x-8 h-full'>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              // 3. Quan trọng: h-full (cao hết cỡ), flex items-center (căn giữa chữ), relative
              className={`relative h-full cursor-pointer flex items-center px-1 font-medium transition-colors 
                ${isActive(item.path) ? 'text-blue-900' : 'text-gray-500 hover:text-blue-700'}`}
            >
              {item.label}

              {/* 4. Line: bottom-0 sẽ nằm đè lên border của header */}
              {isActive(item.path) && <span className='absolute bottom-0 left-0 right-0 h-[2px] bg-blue-900' />}
            </button>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className='flex items-center space-x-6'>
        {/* Notification */}
        <div className='relative cursor-pointer text-gray-600 hover:text-blue-900'>
          <FiBell size={22} />
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center'>
            3
          </span>
        </div>

        {/* User info */}
        <div ref={menuRef} className='relative flex items-center space-x-3'>
          <button
            type='button'
            className='flex items-center space-x-3 cursor-pointer'
            onClick={() => setMenuOpen((prev) => !prev)}
            title='Account menu'
          >
            <div className='text-right leading-none'>
              <p className='text-sm font-semibold text-blue-900'>{fullName}</p>
              <p className='text-xs text-gray-500'>{user?.email}</p>
            </div>
            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold'>
              {initials}
            </div>
            <FiChevronDown className='text-gray-500' />
          </button>

          {menuOpen && (
            <div className='absolute right-0 top-12 z-50 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg'>
              <button
                type='button'
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/profile')
                }}
                className='flex w-full items-center cursor-pointer gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                <FiUser className='h-4 w-4' />
                Profile
              </button>
              <button
                type='button'
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}
                className='flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50'
              >
                <FiLogOut className='h-4 w-4' />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
