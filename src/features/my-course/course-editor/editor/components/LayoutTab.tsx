import React from 'react'
import { useCourseStore } from '../store/useCourseStore'

export function LayoutTab() {
  const selectedElement = useCourseStore((s) => s.selectedElement)
  const updateElement = useCourseStore((s) => s.updateElement)
  const updateElementLayoutMeta = useCourseStore((s) => s.updateElementLayoutMeta)
  const selectedElementIds = useCourseStore((s) => s.selectedElementIds)
  const groupSelectedElements = useCourseStore((s) => s.groupSelectedElements)
  const toggleElementLock = useCourseStore((s) => s.toggleElementLock)
  const lockedElementIds = useCourseStore((s) => s.lockedElementIds)
  const canvasZoom = useCourseStore((s) => s.canvasZoom)
  const setCanvasZoom = useCourseStore((s) => s.setCanvasZoom)

  const setLayout = (patch: Record<string, unknown>) => {
    if (!selectedElement || selectedElement.kind === 'course') return
    updateElementLayoutMeta(selectedElement, patch)
  }

  const setFlow = () => {
    if (!selectedElement || selectedElement.kind === 'course') return
    updateElement(selectedElement.id, { layoutMode: 'flow' })
  }

  const setAbsolute = () => {
    if (!selectedElement || selectedElement.kind === 'course') return
    updateElement(selectedElement.id, { layoutMode: 'absolute' })
    setLayout({ position: 'absolute' })
  }

  return (
    <div className='space-y-4'>
      <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Layout</p>

      <div className='grid grid-cols-2 gap-2'>
        <button className='rounded border px-2 py-1 text-xs' onClick={setFlow}>
          Flow mode
        </button>
        <button className='rounded border px-2 py-1 text-xs' onClick={setAbsolute}>
          Absolute mode
        </button>
      </div>

      <div className='space-y-1'>
        <p className='text-xs text-gray-600'>Text align</p>
        <div className='grid grid-cols-4 gap-1'>
          {(['left', 'center', 'right', 'justify'] as const).map((align) => (
            <button key={align} className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ textAlign: align })}>
              {align}
            </button>
          ))}
        </div>
      </div>

      <div className='space-y-1'>
        <p className='text-xs text-gray-600'>Object align</p>
        <div className='grid grid-cols-3 gap-1'>
          <button className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ x: 0 })}>Left</button>
          <button className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ x: 300 })}>Center</button>
          <button className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ x: 600 })}>Right</button>
          <button className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ y: 0 })}>Top</button>
          <button className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ y: 200 })}>Middle</button>
          <button className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ y: 400 })}>Bottom</button>
        </div>
      </div>

      <div className='space-y-1'>
        <p className='text-xs text-gray-600'>Position + Size</p>
        <div className='grid grid-cols-2 gap-2'>
          <input className='rounded border px-2 py-1 text-xs' type='number' placeholder='x' onChange={(e) => setLayout({ x: Number(e.target.value) })} />
          <input className='rounded border px-2 py-1 text-xs' type='number' placeholder='y' onChange={(e) => setLayout({ y: Number(e.target.value) })} />
          <input className='rounded border px-2 py-1 text-xs' type='number' placeholder='width' onChange={(e) => setLayout({ width: Number(e.target.value) })} />
          <input className='rounded border px-2 py-1 text-xs' type='number' placeholder='height' onChange={(e) => setLayout({ height: Number(e.target.value) })} />
          <input className='rounded border px-2 py-1 text-xs' type='number' placeholder='zIndex' onChange={(e) => setLayout({ zIndex: Number(e.target.value) })} />
          <input className='rounded border px-2 py-1 text-xs' type='number' placeholder='rotation' onChange={(e) => setLayout({ rotation: Number(e.target.value) })} />
        </div>
      </div>

      <div className='space-y-1'>
        <p className='text-xs text-gray-600'>Distribution</p>
        <div className='grid grid-cols-2 gap-2'>
          <button className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ distribute: 'horizontal' })}>
            Space H
          </button>
          <button className='rounded border px-2 py-1 text-xs' onClick={() => setLayout({ distribute: 'vertical' })}>
            Space V
          </button>
        </div>
      </div>

      <div className='space-y-2 rounded border p-2'>
        <p className='text-xs text-gray-600'>Multi-select actions</p>
        <p className='text-xs text-gray-400'>Selected: {selectedElementIds.length}</p>
        <button className='w-full rounded border px-2 py-1 text-xs' onClick={groupSelectedElements}>
          Group selected
        </button>
        {selectedElement?.id ? (
          <button className='w-full rounded border px-2 py-1 text-xs' onClick={() => toggleElementLock(selectedElement.id)}>
            {lockedElementIds.includes(selectedElement.id) ? 'Unlock element' : 'Lock element'}
          </button>
        ) : null}
      </div>

      <div className='space-y-1'>
        <p className='text-xs text-gray-600'>Canvas zoom</p>
        <input type='range' min={0.25} max={2} step={0.05} value={canvasZoom} onChange={(e) => setCanvasZoom(Number(e.target.value))} className='w-full' />
        <p className='text-xs text-gray-400'>{Math.round(canvasZoom * 100)}%</p>
      </div>
    </div>
  )
}

