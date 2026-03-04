import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CheckCircle2, CheckSquare, FileText, HelpCircle, LayoutPanelTop, ToggleLeft, Type } from 'lucide-react'

type ItemConfig = {
  id: string
  title: string
  description: string
  data: Record<string, unknown>
  icon: React.ReactNode
  iconClassName: string
}

function DraggableItem({ item }: { item: ItemConfig }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id, data: item.data })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-full cursor-pointer rounded-xl border border-transparent bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${isDragging ? 'scale-[0.98] opacity-60 ring-2 ring-blue-500' : 'hover:border-gray-200'}`}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
      }}
    >
      <div className='flex items-start gap-3'>
        <div className={`rounded-full p-2 ${item.iconClassName}`}>{item.icon}</div>
        <div>
          <p className='text-sm font-semibold text-gray-800'>{item.title}</p>
          <p className='text-xs text-gray-500'>{item.description}</p>
        </div>
      </div>
    </div>
  )
}

const componentItems: ItemConfig[] = [
  {
    id: 'drag-section',
    title: 'Section',
    description: 'Group related learning pages',
    data: { type: 'sidebar-section' },
    icon: <LayoutPanelTop className='h-4 w-4' />,
    iconClassName: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'drag-content-page',
    title: 'Content Page',
    description: 'Static learning content page',
    data: { type: 'sidebar-content-page' },
    icon: <FileText className='h-4 w-4' />,
    iconClassName: 'bg-green-100 text-green-600'
  },
  {
    id: 'drag-quiz-page',
    title: 'Quiz Page',
    description: 'Interactive assessment page',
    data: { type: 'sidebar-quiz-page' },
    icon: <HelpCircle className='h-4 w-4' />,
    iconClassName: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'drag-content-block',
    title: 'Content Block',
    description: 'Rich text content section',
    data: { type: 'sidebar-content-block' },
    icon: <Type className='h-4 w-4' />,
    iconClassName: 'bg-orange-100 text-orange-600'
  }
]

const questionItems: ItemConfig[] = [
  {
    id: 'drag-mcq-single',
    title: 'MCQ Single',
    description: 'Choose one correct option',
    data: { type: 'sidebar-question', questionType: 'MCQ_SINGLE' },
    icon: <CheckCircle2 className='h-4 w-4' />,
    iconClassName: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: 'drag-mcq-multi',
    title: 'MCQ Multiple',
    description: 'Choose multiple correct options',
    data: { type: 'sidebar-question', questionType: 'MCQ_MULTI' },
    icon: <CheckSquare className='h-4 w-4' />,
    iconClassName: 'bg-pink-100 text-pink-600'
  },
  {
    id: 'drag-true-false',
    title: 'True / False',
    description: 'Binary choice question',
    data: { type: 'sidebar-question', questionType: 'TRUE_FALSE' },
    icon: <ToggleLeft className='h-4 w-4' />,
    iconClassName: 'bg-yellow-100 text-yellow-600'
  }
]

export function Sidebar() {
  return (
    <aside className='sticky top-0 h-screen w-[280px] overflow-y-auto border-r border-gray-100 bg-white p-4'>
      <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>Components</h3>
      <div className='space-y-3'>
        {componentItems.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </div>

      <h3 className='mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-gray-500'>Question Types</h3>
      <div className='space-y-3'>
        {questionItems.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </div>
    </aside>
  )
}
