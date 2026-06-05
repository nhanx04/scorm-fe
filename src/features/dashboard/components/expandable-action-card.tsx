import React, { useState } from 'react'
import { ChevronDown, Plus, Sparkles, Rocket, BookOpen, GraduationCap, NotebookPen } from 'lucide-react'
import type { ActionItem } from '../types'

type ExpandableActionCardProps = {
  item: ActionItem
}

const guides: Record<string, { steps: string[] }> = {
  create: {
    steps: [
      'Click Create Course.',
      'Enter a course name.',
      'Select language and topic.',
      'Create chapters and lessons.',
      'Add learning content, images, and videos.',
      'Save and publish.'
    ]
  },
  ai: {
    steps: [
      'Click Generate with AI.',
      'Describe your topic.',
      'AI generates learning outcomes, course structure, chapters and lessons.',
      'Review the generated content.',
      'Publish the course.'
    ]
  },
  import: {
    steps: [
      'Select a SCORM file.',
      'Upload the package.',
      'Wait for processing.',
      'Review the imported content.',
      'Finish the import.'
    ]
  },
  templates: {
    steps: [
      'Open the template gallery.',
      'Select a template.',
      'Preview it.',
      'Create a copy.',
      'Customize the content.'
    ]
  },
  quiz: {
    steps: [
      'Select a lesson.',
      'Choose question types.',
      'Select question quantity.',
      'Generate questions.',
      'Review and save.'
    ]
  },
  assets: {
    steps: [
      'Upload files.',
      'Create folders.',
      'Add tags.',
      'Search resources.',
      'Insert assets into courses.'
    ]
  }
}

const iconMap = {
  plus: Plus,
  sparkles: Sparkles,
  import: Rocket,
  layout: BookOpen,
  quiz: GraduationCap,
  asset: NotebookPen
}

const descriptions: Record<string, string> = {
  create: 'Create a new course from scratch.',
  ai: 'Generate a course automatically using AI.',
  import: 'Import an existing SCORM package.',
  templates: 'Start from a predefined template.',
  quiz: 'Build quizzes with AI assistance.',
  assets: 'Organize learning resources.'
}

const ExpandableActionCard: React.FC<ExpandableActionCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = iconMap[item.icon]
  const guide = guides[item.id]
  const description = descriptions[item.id]

  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full px-6 py-4 text-left hover:bg-gray-50'
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='rounded-lg bg-indigo-100 p-3 text-indigo-600'>
              <Icon className='h-5 w-5' />
            </div>
            <div>
              <h3 className='font-semibold text-gray-900'>{item.title}</h3>
              <p className='text-sm text-gray-600'>{item.description}</p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isExpanded && guide && (
        <div className='border-t border-gray-200 bg-gray-50 px-6 py-4'>
          <p className='mb-3 text-sm font-medium text-gray-900'>{description}</p>
          <ol className='space-y-2'>
            {guide.steps.map((step, idx) => (
              <li key={idx} className='flex gap-3 text-sm text-gray-700'>
                <span className='font-semibold text-indigo-600'>{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default ExpandableActionCard

