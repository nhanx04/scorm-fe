import React from 'react'

type EditorLayoutProps = {
  sidebar: React.ReactNode
  main: React.ReactNode
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ sidebar, main }) => {
  return (
    <div className='flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50'>
      <aside className='h-full w-[360px] shrink-0 border-r border-gray-200 bg-gray-100'>{sidebar}</aside>
      <main className='h-full flex-1 overflow-y-auto bg-white'>{main}</main>
    </div>
  )
}

export default EditorLayout
