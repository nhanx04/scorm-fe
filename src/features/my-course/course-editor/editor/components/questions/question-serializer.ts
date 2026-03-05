import type { Question, QuestionTemplateData, QuestionType } from '../../types/course'

export interface SerializedQuestion {
  id: string
  type: Exclude<QuestionType, 'MCQ_MULTI' | 'FILL_BLANK' | 'GROUPING'>
  prompt: string
  explanation?: string
  options?: { id: string; label: string; value: string }[]
  correctAnswer?: string | string[] | boolean
  charLimit?: number
  sentence?: string
  blanks?: string[]
  pairs?: { id: string; term: string; definition: string }[]
}

export function normalizeQuestionType(type: QuestionType): SerializedQuestion['type'] {
  if (type === 'MCQ_MULTI') return 'MCQ_MULTIPLE'
  if (type === 'FILL_BLANK') return 'FILL_IN_THE_BLANK'
  if (type === 'GROUPING') return 'MATCHING'
  return type
}

export function toTemplateData(question: Question): QuestionTemplateData {
  return (
    question.templateData ?? {
      prompt: stripHtml(question.promptHtml || question.title || 'Question prompt...'),
      options: question.options?.map((o, idx) => ({ id: o.id, label: o.label, value: `option_${idx + 1}` })),
      correctAnswer: question.correctValue,
      charLimit: 120
    }
  )
}

function stripHtml(text: string) {
  return text.replace(/<[^>]+>/g, '').trim()
}

export function serializeQuestion(question: Question): SerializedQuestion {
  const type = normalizeQuestionType(question.questionType)
  const data = toTemplateData(question)
  return {
    id: question.id,
    type,
    prompt: data.prompt,
    explanation: data.explanation,
    options: data.options,
    correctAnswer: data.correctAnswer,
    charLimit: data.charLimit,
    sentence: data.sentence,
    blanks: data.blanks,
    pairs: data.pairs
  }
}

