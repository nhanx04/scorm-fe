import React, { useState } from 'react'
import { FiPlus, FiTrash2, FiX, FiChevronDown, FiChevronUp, FiMenu, FiImage } from 'react-icons/fi'
import type { QuestionType, CreateScormPackageRequest } from '../../../services/api'

type Question = NonNullable<CreateScormPackageRequest['questions']>[0]
type Answer = NonNullable<Question['answers']>[0]

type QuestionEditorProps = {
  question: Question
  onChange: (question: Question) => void
  onRemove: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question: initialQuestion,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown
}) => {
  const [question, setQuestion] = useState<Question>({
    ...initialQuestion,
    answers: [...(initialQuestion.answers || [])]
  })
  const [isExpanded, setIsExpanded] = useState(true)

  const updateQuestion = (updates: Partial<Question>) => {
    const updated = { ...question, ...updates }
    setQuestion(updated)
    onChange(updated)
  }

  const addAnswer = () => {
    const newAnswer: Answer = {
      text: '',
      correct: false,
      answerOrder: question.answers.length
    }
    if (question.questionType === 'MATCHING') {
      newAnswer.matchValue = ''
    }
    updateQuestion({
      answers: [...question.answers, newAnswer]
    })
  }

  const updateAnswer = (index: number, updates: Partial<Answer>) => {
    const newAnswers = [...question.answers]
    newAnswers[index] = { ...newAnswers[index], ...updates }
    updateQuestion({ answers: newAnswers })
  }

  const removeAnswer = (index: number) => {
    const newAnswers = question.answers.filter((_: Answer, i: number) => i !== index)
    updateQuestion({ answers: newAnswers })
  }

  const toggleCorrect = (index: number) => {
    if (question.questionType === 'MULTIPLE_CHOICE') {
      // For multiple choice, only one answer can be correct
      const newAnswers = question.answers.map((ans: Answer, i: number) => ({
        ...ans,
        correct: i === index
      }))
      updateQuestion({ answers: newAnswers })
    } else {
      // For other types, toggle the correct state
      updateAnswer(index, { correct: !question.answers[index].correct })
    }
  }

  const renderAnswerInput = (answer: Answer, index: number) => {
    const isMatching = question.questionType === 'MATCHING'
    const isTrueFalse = question.questionType === 'TRUE_FALSE'
    const isShortAnswer = question.questionType === 'SHORT_ANSWER'
    const answerColors = ['bg-blue-50', 'bg-purple-50', 'bg-amber-50', 'bg-green-50', 'bg-rose-50']
    const answerColor = answerColors[index % answerColors.length]

    return (
      <div
        key={index}
        className={`group relative p-3 rounded-xl ${answerColor} border border-transparent hover:border-gray-200 transition-colors`}
      >
        <div className='flex items-start gap-3'>
          {/* Answer selection button */}
          <div className='flex-shrink-0 pt-1'>
            <button
              type='button'
              onClick={() => toggleCorrect(index)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                answer.correct
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'border-2 border-gray-300 text-transparent hover:border-green-400 bg-white'
              }`}
            >
              {answer.correct && <span className='text-sm'>✓</span>}
            </button>
          </div>

          {/* Answer content */}
          <div className='flex-1 space-y-2'>
            <div className='flex gap-2'>
              <div className='flex-1 space-y-2'>
                <input
                  type='text'
                  value={answer.text}
                  onChange={(e) => updateAnswer(index, { text: e.target.value })}
                  placeholder={isTrueFalse ? 'Ví dụ: Đúng' : 'Nhập đáp án'}
                  className='w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-2 px-3.5 bg-white/80'
                />

                {/* Image URL Input */}
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <FiImage className='w-3.5 h-3.5 text-gray-400' />
                    <span>Hình ảnh đáp án (tùy chọn)</span>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='url'
                      value={answer.imageUrl || ''}
                      onChange={(e) => updateAnswer(index, { imageUrl: e.target.value })}
                      className='flex-1 rounded-lg border-gray-200 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 text-sm py-1.5 px-3 bg-white/80'
                      placeholder='https://example.com/image.jpg'
                    />
                  </div>
                  {answer.imageUrl && (
                    <div className='mt-1'>
                      <div className='w-full max-w-xs border border-gray-200 rounded-lg overflow-hidden bg-white p-1'>
                        <img
                          src={answer.imageUrl}
                          alt='Xem trước đáp án'
                          className='w-full h-auto max-h-32 object-contain'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isMatching && (
                <div className='w-1/3'>
                  <input
                    type='text'
                    value={answer.matchValue || ''}
                    onChange={(e) => updateAnswer(index, { matchValue: e.target.value })}
                    placeholder='Giá trị khớp'
                    className='w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-2 px-3.5 bg-white/80'
                  />
                </div>
              )}

              <button
                type='button'
                onClick={() => removeAnswer(index)}
                className='text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 transition-colors'
              >
                <FiX className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderQuestionTypeLabel = () => {
    const labels: Record<QuestionType, string> = {
      MULTIPLE_CHOICE: 'Trắc nghiệm',
      TRUE_FALSE: 'Đúng/Sai',
      MATCHING: 'Nối câu',
      SHORT_ANSWER: 'Trả lời ngắn'
    }
    const colors: Record<QuestionType, string> = {
      MULTIPLE_CHOICE: 'bg-blue-100 text-blue-800',
      TRUE_FALSE: 'bg-purple-100 text-purple-800',
      MATCHING: 'bg-amber-100 text-amber-800',
      SHORT_ANSWER: 'bg-green-100 text-green-800'
    }
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${colors[question.questionType] || 'bg-gray-100 text-gray-800'}`}
      >
        {labels[question.questionType] || question.questionType}
      </span>
    )
  }

  return (
    <div className='border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden mb-6 bg-white'>
      <div className='bg-emerald-600 px-4 py-2 border-b border-gray-200/80 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <button
            type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-white hover:text-gray-700 p-1 -ml-1'
          >
            {isExpanded ? <FiChevronDown /> : <FiChevronUp />}
          </button>
          <span className='text-sm font-medium text-white'>
            Câu {question.questionOrder ? question.questionOrder + 1 : ''} - {renderQuestionTypeLabel()}
          </span>
        </div>
        <div className='flex items-center space-x-1'>
          {onMoveUp && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                onMoveUp()
              }}
              className='text-gray-400 hover:text-gray-600 p-1'
              title='Di chuyển lên'
            >
              <FiChevronUp className='w-4 h-4' />
            </button>
          )}
          {onMoveDown && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                onMoveDown()
              }}
              className='text-gray-400 hover:text-gray-600 p-1'
              title='Di chuyển xuống'
            >
              <FiChevronDown className='w-4 h-4' />
            </button>
          )}
          <button type='button' onClick={onRemove} className='text-gray-400 hover:text-red-500 p-1' title='Xóa câu hỏi'>
            <FiTrash2 className='w-4 h-4' />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className='p-4'>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Nội dung câu hỏi</label>
            <div className='space-y-3'>
              <textarea
                value={question.text}
                onChange={(e) => updateQuestion({ text: e.target.value })}
                className='w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-2.5 px-3.5 min-h-[100px]'
                placeholder='Nhập nội dung câu hỏi...'
              />

              {/* Image URL Input */}
              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <FiImage className='w-4 h-4 text-gray-400' />
                  <span>Hình ảnh minh họa (URL)</span>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='url'
                    value={question.imageUrl || ''}
                    onChange={(e) => updateQuestion({ imageUrl: e.target.value })}
                    className='flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3.5'
                    placeholder='https://example.com/image.jpg'
                  />
                </div>
                {question.imageUrl && (
                  <div className='mt-2'>
                    <div className='text-xs text-gray-500 mb-1'>Xem trước:</div>
                    <div className='w-full max-w-xs border border-gray-200 rounded-lg overflow-hidden'>
                      <img
                        src={question.imageUrl}
                        alt='Xem trước câu hỏi'
                        className='w-full h-auto max-h-48 object-contain bg-gray-50 p-2'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <label className='block text-sm font-medium text-gray-700'>
                {question.questionType === 'MATCHING' ? 'Các cặp nối' : 'Các đáp án'}
              </label>
              <button
                type='button'
                onClick={addAnswer}
                className='inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800'
              >
                <FiPlus className='w-3 h-3 mr-1' />
                Thêm đáp án
              </button>
            </div>

            <div className='space-y-2'>{question.answers.map((answer, index) => renderAnswerInput(answer, index))}</div>
          </div>

          <div className='flex items-center justify-between text-xs text-gray-500'>
            <div>
              <span className='font-medium'>Loại câu hỏi:</span>{' '}
              <select
                value={question.questionType}
                onChange={(e) =>
                  updateQuestion({
                    questionType: e.target.value as QuestionType,
                    // Reset answers when changing question type
                    answers: [
                      {
                        text: '',
                        correct: false,
                        answerOrder: 0,
                        ...(e.target.value === 'MATCHING' && { matchValue: '' })
                      }
                    ]
                  })
                }
                className='border-0 p-0 text-xs text-indigo-600 bg-transparent focus:ring-0 focus:ring-offset-0'
              >
                <option value='MULTIPLE_CHOICE'>Trắc nghiệm</option>
                <option value='TRUE_FALSE'>Đúng/Sai</option>
                <option value='MATCHING'>Nối câu</option>
                <option value='SHORT_ANSWER'>Trả lời ngắn</option>
              </select>
            </div>
            <div className='flex items-center'>
              <label className='mr-2'>Điểm tối đa:</label>
              <input
                type='number'
                min='0'
                step='0.5'
                value={question.points || 1}
                onChange={(e) => updateQuestion({ points: parseFloat(e.target.value) || 0 })}
                className='w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs h-6'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionEditor
