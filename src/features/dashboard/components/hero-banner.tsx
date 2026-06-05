import React from 'react'
import { useNavigate } from 'react-router'
import { Sparkles, BookOpen } from 'lucide-react'

const HeroBanner: React.FC = () => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('/my-course')
  }

  return (
    <div className='relative mb-12 overflow-hidden rounded-2xl bg-blue-400 px-4 py-4 md:px-12 md:py-20'>
      {/* Decorative background elements */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 h-40 w-40 rounded-full bg-white blur-3xl'></div>
        <div className='absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl'></div>
      </div>

      {/* Content */}
      <div className='relative z-10'>
        <div className='max-w-2xl'>
          <h2 className='mb-4 text-4xl font-bold text-white md:text-5xl'>Build engaging SCORM courses with AI</h2>
          <p className='mb-8 text-lg text-indigo-100'>
            Create complete learning experiences, quizzes, and SCORM packages in minutes.
          </p>

          {/* Buttons */}
          <div className='flex flex-wrap gap-4'>
            <button
              onClick={handleNavigate}
              className='inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-lg'
            >
              <Sparkles className='h-5 w-5' />
              Create with AI
            </button>
            <button
              onClick={handleNavigate}
              className='inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-3 font-semibold text-white transition-all hover:bg-white/10'
            >
              <BookOpen className='h-5 w-5' />
              New Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
