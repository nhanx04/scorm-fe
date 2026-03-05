import React from 'react'
import { QuestionFactory } from './QuestionFactory'
import { serializeQuestion } from './question-serializer'
import type { Question } from '../../types/course'

export function QuestionTemplateExample() {
  const [question, setQuestion] = React.useState<Question>({
    id: 'q1',
    title: 'MCQ demo',
    questionType: 'MCQ_SINGLE',
    promptHtml: 'What is the capital of France?',
    templateData: {
      prompt: 'What is the capital of France?',
      options: [
        { id: 'o1', label: 'Paris', value: 'paris' },
        { id: 'o2', label: 'London', value: 'london' },
        { id: 'o3', label: 'Berlin', value: 'berlin' },
        { id: 'o4', label: 'Madrid', value: 'madrid' }
      ],
      correctAnswer: 'paris'
    }
  })

  const payload = serializeQuestion(question)

  return (
    <div className='grid grid-cols-2 gap-4'>
      <QuestionFactory
        question={question}
        mode='editor'
        onChange={(templateData) => setQuestion((prev) => ({ ...prev, templateData, promptHtml: templateData.prompt }))}
      />
      <div className='space-y-3'>
        <QuestionFactory question={question} mode='preview' onChange={() => undefined} />
        <pre className='rounded-xl bg-slate-900 p-3 text-xs text-slate-100'>{JSON.stringify(payload, null, 2)}</pre>
      </div>
    </div>
  )
}

