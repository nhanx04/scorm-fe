import React from 'react'

type EditorLayoutProps = {
  sidebar: React.ReactNode
  main: React.ReactNode
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ sidebar, main }) => {
  return (
    <div className='flex h-full min-h-[calc(100vh-4rem)] bg-gray-50'>
      <aside className='w-[280px] bg-gray-100 border-r border-gray-200'>{sidebar}</aside>
      <main className='flex-1 bg-white'>{main}</main>
    </div>
  )
}

export default EditorLayout

