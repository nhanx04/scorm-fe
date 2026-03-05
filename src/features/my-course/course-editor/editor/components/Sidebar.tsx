import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import {
  CheckCircle2,
  CheckSquare,
  FileText,
  GitCompareArrows,
  HelpCircle,
  LayoutPanelTop,
  Pilcrow,
  SquarePen,
  ToggleLeft,
  Type
} from 'lucide-react'

type ItemConfig = {
  id: string
  title: string
  description: string
  data: Record<string, unknown>
  icon: React.ReactNode
  iconClassName: string
  accentClassName?: string
}

function DraggableItem({ item, active, onActivate }: { item: ItemConfig; active: boolean; onActivate: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id, data: item.data })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseDown={onActivate}
      className={`w-full cursor-pointer rounded-2xl border bg-white p-3 pl-4 transition-all duration-200 ${item.accentClassName ?? 'border-slate-200'} ${active ? 'shadow-lg ring-2 ring-blue-200' : 'hover:-translate-y-0.5 hover:shadow-md'} ${isDragging ? 'scale-[0.98] opacity-60 ring-2 ring-blue-500' : ''}`}
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
    description: 'Choose exactly one option',
    data: { type: 'sidebar-question', questionType: 'MCQ_SINGLE' },
    icon: <CheckCircle2 className='h-4 w-4' />,
    iconClassName: 'bg-blue-100 text-blue-600',
    accentClassName: 'border-l-4 border-l-blue-500'
  },
  {
    id: 'drag-mcq-multiple',
    title: 'MCQ Multiple',
    description: 'Choose one or more options',
    data: { type: 'sidebar-question', questionType: 'MCQ_MULTIPLE' },
    icon: <CheckSquare className='h-4 w-4' />,
    iconClassName: 'bg-indigo-100 text-indigo-600',
    accentClassName: 'border-l-4 border-l-indigo-500'
  },
  {
    id: 'drag-true-false',
    title: 'True / False',
    description: 'Binary statement evaluation',
    data: { type: 'sidebar-question', questionType: 'TRUE_FALSE' },
    icon: <ToggleLeft className='h-4 w-4' />,
    iconClassName: 'bg-emerald-100 text-emerald-600',
    accentClassName: 'border-l-4 border-l-emerald-500'
  },
  {
    id: 'drag-short-answer',
    title: 'Short Answer',
    description: 'Free text response with character limit',
    data: { type: 'sidebar-question', questionType: 'SHORT_ANSWER' },
    icon: <SquarePen className='h-4 w-4' />,
    iconClassName: 'bg-amber-100 text-amber-600',
    accentClassName: 'border-l-4 border-l-amber-500'
  },
  {
    id: 'drag-fill-blank',
    title: 'Fill in the Blank',
    description: 'Complete sentence blanks inline',
    data: { type: 'sidebar-question', questionType: 'FILL_IN_THE_BLANK' },
    icon: <Pilcrow className='h-4 w-4' />,
    iconClassName: 'bg-teal-100 text-teal-600',
    accentClassName: 'border-l-4 border-l-teal-500'
  },
  {
    id: 'drag-matching',
    title: 'Matching',
    description: 'Drag terms to their correct definitions',
    data: { type: 'sidebar-question', questionType: 'MATCHING' },
    icon: <GitCompareArrows className='h-4 w-4' />,
    iconClassName: 'bg-purple-100 text-purple-600',
    accentClassName: 'border-l-4 border-l-purple-500'
  }
]

export function Sidebar() {
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null)

  return (
    <aside className='sticky top-0 h-screen w-[300px] overflow-y-auto border-r border-gray-100 bg-white p-4'>
      <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>Components</h3>
      <div className='space-y-3'>
        {componentItems.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            active={activeItemId === item.id}
            onActivate={() => setActiveItemId(item.id)}
          />
        ))}
      </div>

      <h3 className='mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-gray-500'>Question Types</h3>
      <div className='space-y-3'>
        {questionItems.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            active={activeItemId === item.id}
            onActivate={() => setActiveItemId(item.id)}
          />
        ))}
      </div>
    </aside>
  )
}
