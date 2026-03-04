import React from 'react'
import { Sidebar } from './components/Sidebar'
import { Canvas } from './components/Canvas'
import { PropertyPanel } from './components/PropertyPanel'
import { CourseDndProvider } from './dnd/DndProvider'

export function EditorPage() {
  return (
    <CourseDndProvider>
      <div className='flex h-screen overflow-hidden bg-gray-900 font-[Inter]'>
        <Sidebar />
        <Canvas />
        <PropertyPanel />
      </div>
    </CourseDndProvider>
  )
}
