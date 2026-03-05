import React from 'react'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import type { QuestionTemplateData } from '../../types/course'

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className='overflow-hidden rounded-2xl border bg-background shadow-lg'
    >
      {children}
    </motion.div>
  )
}

function Header({ title, badge, gradient }: { title: string; badge: string; gradient: string }) {
  return (
    <div className='border-b bg-white/80 p-6'>
      <div className={`-mx-6 -mt-6 mb-4 h-2 ${gradient}`} />
      <div className='mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>{badge}</div>
      <h4 className='text-xl font-bold text-slate-900'>{title}</h4>
    </div>
  )
}

export function McqSinglePreview({ data }: { data: QuestionTemplateData }) {
  const [selected, setSelected] = React.useState('')
  return (
    <Card>
      <Header title={data.prompt} badge='Single Choice' gradient='bg-gradient-to-r from-blue-500 to-sky-500' />
      <div className='space-y-3 p-6'>
        {(data.options ?? []).map((o) => (
          <motion.button
            key={o.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={() => setSelected(o.value)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm transition duration-200 ${selected === o.value ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-200/50' : 'border-slate-200 hover:border-blue-200 hover:shadow-md'}`}
          >
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${selected === o.value ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 text-slate-500'}`}
            >
              {selected === o.value ? <Circle className='h-3 w-3 fill-current' /> : <Circle className='h-3 w-3' />}
            </span>
            <span>{o.label}</span>
          </motion.button>
        ))}
      </div>
    </Card>
  )
}

export function McqMultiplePreview({ data }: { data: QuestionTemplateData }) {
  const [selected, setSelected] = React.useState<string[]>([])
  const toggle = (v: string) => setSelected((s) => (s.includes(v) ? s.filter((i) => i !== v) : [...s, v]))
  return (
    <Card>
      <Header title={data.prompt} badge='Multiple Choice' gradient='bg-gradient-to-r from-indigo-500 to-violet-500' />
      <div className='space-y-3 p-6'>
        <div className='inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700'>
          {selected.length} selected
        </div>
        {(data.options ?? []).map((o) => (
          <motion.button
            key={o.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={() => toggle(o.value)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm transition duration-200 ${selected.includes(o.value) ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-200/40' : 'border-slate-200 hover:border-indigo-200 hover:shadow-md'}`}
          >
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-lg border ${selected.includes(o.value) ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 text-slate-500'}`}
            >
              {selected.includes(o.value) ? <Check className='h-3 w-3' /> : null}
            </span>
            <span>{o.label}</span>
          </motion.button>
        ))}
      </div>
    </Card>
  )
}

export function TrueFalsePreview({ data }: { data: QuestionTemplateData }) {
  const [value, setValue] = React.useState<boolean | null>(null)
  return (
    <Card>
      <Header title={data.prompt} badge='True / False' gradient='bg-gradient-to-r from-emerald-500 to-rose-500' />
      <div className='grid grid-cols-2 gap-4 p-6'>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setValue(true)}
          className={`rounded-full border px-4 py-4 text-sm font-bold transition duration-200 ${value === true ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-300/40' : 'border-slate-200 hover:border-emerald-300'}`}
        >
          TRUE
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setValue(false)}
          className={`rounded-full border px-4 py-4 text-sm font-bold transition duration-200 ${value === false ? 'border-rose-500 bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-300/40' : 'border-slate-200 hover:border-rose-300'}`}
        >
          FALSE
        </motion.button>
      </div>
    </Card>
  )
}

export function ShortAnswerPreview({ data }: { data: QuestionTemplateData }) {
  const [value, setValue] = React.useState('')
  const limit = data.charLimit ?? 120
  const overLimit = value.length > limit
  return (
    <Card>
      <Header title={data.prompt} badge='Short Answer' gradient='bg-gradient-to-r from-amber-500 to-orange-500' />
      <div className='space-y-3 p-6'>
        <input
          className='w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm shadow-inner outline-none transition duration-200 focus:ring-2 focus:ring-amber-500'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className={`text-right text-xs font-semibold ${overLimit ? 'text-red-600' : 'text-slate-500'}`}>
          {value.length} / {limit} characters
        </p>
      </div>
    </Card>
  )
}

export function FillInTheBlankPreview({ data }: { data: QuestionTemplateData }) {
  const sentence = data.sentence ?? data.prompt
  const parts = sentence.split('____')
  const [values, setValues] = React.useState<string[]>(new Array(parts.length - 1).fill(''))
  return (
    <Card>
      <Header title={data.prompt} badge='Fill in the Blank' gradient='bg-gradient-to-r from-teal-500 to-cyan-500' />
      <div className='flex flex-wrap items-center gap-2 p-6 text-sm text-slate-800'>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 ? (
              <input
                className='inline-flex min-w-[120px] rounded-lg border border-teal-200 bg-slate-50 px-3 py-1 outline-none transition duration-200 focus:ring-2 focus:ring-teal-500'
                placeholder='Type answer'
                value={values[i] ?? ''}
                onChange={(e) => setValues((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
              />
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </Card>
  )
}

function DragItem({ id, label }: { id: string; label: string }) {
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({ id })
  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      animate={{ scale: isDragging ? 1.03 : 1, opacity: isDragging ? 0.85 : 1 }}
      style={{ transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined }}
      className='cursor-grab rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-800 shadow-sm'
    >
      {label}
    </motion.div>
  )
}

function DropZone({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <motion.div
      ref={setNodeRef}
      animate={{ scale: isOver ? 1.01 : 1 }}
      className={`min-h-[52px] rounded-xl border p-3 transition duration-200 ${isOver ? 'border-purple-500 bg-purple-100 shadow-md shadow-purple-200/50' : 'border-slate-200 bg-white'}`}
    >
      {children}
    </motion.div>
  )
}

export function MatchingPreview({ data }: { data: QuestionTemplateData }) {
  const pairs = data.pairs ?? []
  const [matches, setMatches] = React.useState<Record<string, string>>({})
  return (
    <Card>
      <Header title={data.prompt} badge='Matching' gradient='bg-gradient-to-r from-purple-500 to-fuchsia-500' />
      <div className='p-6'>
        <DndContext
          onDragEnd={({ active, over }) =>
            over && setMatches((m) => ({ ...m, [over.id as string]: active.id as string }))
          }
        >
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              {pairs.map((p) => (
                <DragItem key={p.id} id={p.id} label={p.term} />
              ))}
            </div>
            <div className='space-y-2'>
              {pairs.map((p) => (
                <DropZone key={p.id} id={p.id}>
                  <p className='text-xs text-slate-500'>{p.definition}</p>
                  {matches[p.id] ? (
                    <p className='mt-1 text-sm font-medium text-purple-800'>
                      Matched: {pairs.find((x) => x.id === matches[p.id])?.term}
                    </p>
                  ) : null}
                </DropZone>
              ))}
            </div>
          </div>
        </DndContext>
      </div>
    </Card>
  )
}
