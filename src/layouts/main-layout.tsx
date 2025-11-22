import React from 'react'
import { Header } from '../components'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      {/* main area uses exact viewport height minus header so h-full works in children */}
      <main className='flex flex-col' style={{ height: 'calc(100vh - 5rem)' }}>
        {children}
      </main>
    </div>
  )
}

export default MainLayout
