import React, { useEffect, useRef, useState } from 'react'
import { FiBell } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { notificationApi } from '@/services/api'
import type { Notification } from '@/features/notification/types/notification.types'

const NotificationDropdown: React.FC = () => {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notificationRef = useRef<HTMLDivElement | null>(null)

  // Lấy số lượng thông báo chưa đọc khi component mount hoặc khi có user
  // Đã sửa dependency thành user?.userId để tránh re-render/lặp API vô hạn
  useEffect(() => {
    if (user?.userId) {
      notificationApi.getUnreadCount()
        .then(res => setUnreadCount(res.data))
        .catch(console.error)
    }
  }, [user?.userId])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleToggleNotifications = async () => {
    setShowNotifications(prev => !prev)
    // Nếu dropdown đang đóng, chuẩn bị mở VÀ chưa có data -> Gọi API lấy danh sách
    if (!showNotifications && notifications.length === 0) {
      try {
        const res = await notificationApi.getNotifications(0, 10)
        setNotifications(res.data.content)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id)
      setUnreadCount(prev => Math.max(0, prev - 1))
      setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n))
    } catch (error) {
      console.error(error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div ref={notificationRef} className='relative flex items-center'>
      {/* Icon quả chuông */}
      <div 
        className='relative cursor-pointer text-gray-600 hover:text-blue-900 transition-colors'
        onClick={handleToggleNotifications}
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown danh sách thông báo */}
      {showNotifications && (
        <div className='absolute right-0 top-12 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden'>
          <div className='p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50'>
            <h3 className='font-semibold text-gray-700'>Thông báo</h3>
            <button 
              onClick={handleMarkAllAsRead}
              className='text-xs text-blue-600 hover:underline cursor-pointer'
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>
          
          <div className='max-h-96 overflow-y-auto'>
            {notifications.length === 0 ? (
              <p className='p-4 text-center text-sm text-gray-500'>Không có thông báo nào</p>
            ) : (
              notifications.map(noti => (
                <div 
                  key={noti.notificationId} 
                  onClick={() => !noti.isRead && handleMarkAsRead(noti.notificationId)}
                  className={`p-3 border-b border-gray-100 transition-colors ${!noti.isRead ? 'bg-blue-50/50 cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  <h4 className={`text-sm ${!noti.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {noti.title}
                  </h4>
                  <p className='text-xs text-gray-500 mt-1 line-clamp-2'>{noti.message}</p>
                  {/* Format thời gian theo định dạng Việt Nam */}
                  <span className='text-[10px] text-gray-400 mt-1.5 block'>
                    {new Date(noti.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown