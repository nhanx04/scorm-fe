import React from 'react'
import { Sidebar } from './components/Sidebar'
import { Canvas } from './components/Canvas'
import { PropertyPanel } from './components/PropertyPanel'
import { CourseDndProvider } from './dnd/DndProvider'

export function EditorPage() {
  return (
    <CourseDndProvider>
      <div className='flex h-full min-h-0 flex-1 overflow-hidden bg-gray-100'>
        <Sidebar />
        <Canvas />
        <PropertyPanel />
      </div>
    </CourseDndProvider>
  )
}

