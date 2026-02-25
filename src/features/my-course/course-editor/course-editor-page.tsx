import React, { useState } from 'react'
import { Sidebar } from './components/sidebar'
import { Canvas } from './components/canvas'
import { PropertiesPanel } from './components/properties-panel'

export function CourseEditorPage() {
  const [selectedComponent, setSelectedComponent] = useState<string>()
  const [selectedQuestion, setSelectedQuestion] = useState<string>()

  return (
    <div className='flex flex-1 overflow-hidden bg-gray-100'>
      {/* LEFT SIDEBAR — COMPONENT & QUESTION TOOLBOX */}
      <Sidebar
        selectedComponent={selectedComponent}
        onSelectComponent={setSelectedComponent}
        selectedQuestion={selectedQuestion}
        onSelectQuestion={setSelectedQuestion}
      />

      {/* CENTER — MAIN EDITING CANVAS */}
      <main className='flex-1 flex flex-col min-w-0'>
        <Canvas />
      </main>

      {/* RIGHT SIDEBAR — PROPERTIES PANEL */}
      <PropertiesPanel />
    </div>
  )
}
