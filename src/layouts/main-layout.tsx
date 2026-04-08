import React from 'react'
import { Header } from '../components'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    // 1. Cố định chiều cao toàn màn hình và ẩn cuộn của body
    <div className='flex flex-col h-screen overflow-hidden'>
      <Header />
      {/* 2. flex-1 tự động chiếm không gian còn lại, overflow-y-auto tạo thanh cuộn riêng cho phần nội dung */}
      <main className='flex-1 flex flex-col overflow-y-auto'>
        {children}
      </main>
    </div>
  )
}

export default MainLayout