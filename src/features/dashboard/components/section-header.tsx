import React from 'react'

type SectionHeaderProps = {
  title: string
  subtitle?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight'>{title}</h2>
      {subtitle ? <p className='text-base text-slate-600 dark:text-slate-300 leading-relaxed'>{subtitle}</p> : null}
    </div>
  )
}

export default SectionHeader
