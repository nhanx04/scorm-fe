import React, { useEffect, useMemo, useState } from 'react'
import { FiBookOpen, FiTarget, FiUploadCloud, FiFileText, FiTrendingUp, FiZap, FiX } from 'react-icons/fi'

type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | ''

type FormState = {
  courseDescription: string
  targetAudience: string
  proficiencyLevel: ProficiencyLevel
  duration: string
  learningGoal: string
  requiredKnowledge: string
  courseTitle: string
  language: string
  additionalInstructions: string
}

type CreateCourseWithAIModalProps = {
  open: boolean
  onClose: () => void
  onGenerate?: (form: FormState, referenceFile?: File | null) => Promise<void> | void
}

const MAX_DESC = 600
const MAX_GOAL = 400
const MAX_REQUIRED = 400

const TextInput: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helperText?: string
  required?: boolean
}> = ({ label, value, onChange, placeholder, helperText, required }) => (
  <label className='block'>
    <div className='mb-1.5 text-sm font-semibold text-gray-800'>
      {label} {required && <span className='text-red-500'>*</span>}
    </div>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className='w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all duration-150 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100'
    />
    {helperText && <p className='mt-1 text-xs text-gray-500'>{helperText}</p>}
  </label>
)

const TextAreaInput: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helperText?: string
  required?: boolean
  maxLength?: number
}> = ({ label, value, onChange, placeholder, helperText, required, maxLength }) => (
  <label className='block'>
    <div className='mb-1.5 flex items-center justify-between'>
      <span className='text-sm font-semibold text-gray-800'>
        {label} {required && <span className='text-red-500'>*</span>}
      </span>
      {maxLength ? (
        <span className='text-xs text-gray-400'>
          {value.length}/{maxLength}
        </span>
      ) : null}
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
      placeholder={placeholder}
      rows={4}
      className='w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all duration-150 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100'
    />
    {helperText && <p className='mt-1 text-xs text-gray-500'>{helperText}</p>}
  </label>
)

const SelectInput: React.FC<{
  label: string
  value: string
  onChange: (value: ProficiencyLevel) => void
  helperText?: string
  required?: boolean
}> = ({ label, value, onChange, helperText, required }) => (
  <label className='block'>
    <div className='mb-1.5 text-sm font-semibold text-gray-800'>
      {label} {required && <span className='text-red-500'>*</span>}
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ProficiencyLevel)}
      className='w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all duration-150 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100'
    >
      <option value=''>Select level</option>
      <option value='Beginner'>Beginner</option>
      <option value='Intermediate'>Intermediate</option>
      <option value='Advanced'>Advanced</option>
    </select>
    {helperText && <p className='mt-1 text-xs text-gray-500'>{helperText}</p>}
  </label>
)

const CreateCourseWithAIModal: React.FC<CreateCourseWithAIModalProps> = ({ open, onClose, onGenerate }) => {
  const [form, setForm] = useState<FormState>({
    courseDescription: '',
    targetAudience: '',
    proficiencyLevel: '',
    duration: '',
    learningGoal: '',
    requiredKnowledge: '',
    courseTitle: '',
    language: 'Vietnamese',
    additionalInstructions: ''
  })
  const [dragActive, setDragActive] = useState(false)
  const [referenceFile, setReferenceFile] = useState<File | null>(null)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const canGenerate = useMemo(() => {
    return Boolean(form.courseTitle.trim() && form.courseDescription.trim() && form.learningGoal.trim())
  }, [form.courseTitle, form.courseDescription, form.learningGoal])

  const handleDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setReferenceFile(file)
  }

  const handleFileChange = (file?: File | null) => {
    if (!file) return
    setReferenceFile(file)
  }

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return
    setIsGenerating(true)
    try {
      await onGenerate?.(form, referenceFile)
      onClose()
    } catch (error) {
      console.error('Lỗi khi gọi onGenerate trong Modal:', error)
      // Khi có lỗi ném ra từ onGenerate, nó sẽ nhảy thẳng vào đây và không gọi onClose(), 
      // cho phép modal vẫn mở và người dùng có thể thử lại.
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFakeSuggestion = async () => {
    setIsSuggesting(true)
    await new Promise((r) => setTimeout(r, 500))
    setForm((prev) => ({
      ...prev,
      learningGoal: prev.learningGoal || 'Learners can apply core concepts to real-world scenarios.',
      requiredKnowledge: prev.requiredKnowledge || 'Basic familiarity with the subject and standard digital tools.'
    }))
    setIsSuggesting(false)
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-[2px]'>
      <div className='w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl'>
        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
          <h2 className='text-xl font-bold text-gray-900'>Create Course with AI</h2>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800'
          >
            <FiX className='h-5 w-5' />
          </button>
        </div>

        <div className='max-h-[75vh] space-y-5 overflow-y-auto px-6 py-5'>
          <section className='rounded-2xl border border-gray-200 bg-gray-50/70 p-4'>
            <div className='mb-4 flex items-center gap-2'>
              <FiUploadCloud className='h-4 w-4 text-blue-600' />
              <h3 className='text-sm font-bold text-gray-900'>Upload Reference File</h3>
            </div>
            <label
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`block cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all duration-150 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'
              }`}
            >
              <input
                type='file'
                accept='.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'
                className='hidden'
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
              <p className='text-sm font-medium text-gray-700'>Drag & drop file here or click to upload</p>
              <p className='mt-1 text-xs text-gray-500'>Accepted formats: PDF, DOCX, TXT (optional)</p>
            </label>
            {referenceFile ? (
              <div className='mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2'>
                <FiFileText className='h-4 w-4 text-gray-500' />
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium text-gray-800'>{referenceFile.name}</p>
                  <p className='text-xs text-gray-500'>{Math.max(referenceFile.size / 1024, 1).toFixed(1)} KB</p>
                </div>
              </div>
            ) : null}
          </section>

          <section className='rounded-2xl border border-gray-200 bg-gray-50/70 p-4'>
            <div className='mb-4 flex items-center gap-2'>
              <FiBookOpen className='h-4 w-4 text-blue-600' />
              <h3 className='text-sm font-bold text-gray-900'>Describe Your Course</h3>
            </div>
            <div className='space-y-4'>
              <TextAreaInput
                label='Course Description'
                required
                value={form.courseDescription}
                onChange={(value) => updateField('courseDescription', value)}
                placeholder='Describe what your course is about...'
                helperText='Give AI enough context to generate a relevant structure.'
                maxLength={MAX_DESC}
              />
              <TextInput
                label='Target Audience'
                value={form.targetAudience}
                onChange={(value) => updateField('targetAudience', value)}
                placeholder='Who is this course for?'
                helperText='Example: New joiners, product managers, sales team...'
              />
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <SelectInput
                  label='Audience Proficiency Level'
                  value={form.proficiencyLevel}
                  onChange={(value) => updateField('proficiencyLevel', value)}
                  helperText='Choose how deep and technical the content should be.'
                />
                <TextInput
                  label='Duration'
                  value={form.duration}
                  onChange={(value) => updateField('duration', value)}
                  placeholder='e.g. 2 hours, 3 days...'
                  helperText='Helps AI scope the course content and pacing.'
                />
              </div>
              <TextInput
                label='Language'
                value={form.language}
                onChange={(value) => updateField('language', value)}
                placeholder='Vietnamese / English...'
              />
            </div>
          </section>

          <section className='rounded-2xl border border-gray-200 bg-gray-50/70 p-4'>
            <div className='mb-2 flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <FiTarget className='h-4 w-4 text-blue-600' />
                <h3 className='text-sm font-bold text-gray-900'>Set Learning Context</h3>
              </div>
              <button
                type='button'
                onClick={() => {
                  void handleFakeSuggestion()
                }}
                className='inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100'
              >
                <FiZap className='h-3.5 w-3.5' />
                {isSuggesting ? 'Generating...' : 'AI Suggestion'}
              </button>
            </div>
            <p className='mb-4 text-xs text-gray-500'>AI suggestions will be generated based on your description.</p>

            <div className='space-y-4'>
              <TextAreaInput
                label='Learning Goal'
                required
                value={form.learningGoal}
                onChange={(value) => updateField('learningGoal', value)}
                placeholder='What do you want learners to do after finishing?'
                helperText='Use action verbs like explain, apply, design, evaluate.'
                maxLength={MAX_GOAL}
              />
              <TextAreaInput
                label='Required Knowledge'
                value={form.requiredKnowledge}
                onChange={(value) => updateField('requiredKnowledge', value)}
                placeholder='What should learners already know?'
                helperText='Define prerequisites to improve AI-generated sequencing.'
                maxLength={MAX_REQUIRED}
              />
              <TextInput
                label='Course Title'
                required
                value={form.courseTitle}
                onChange={(value) => updateField('courseTitle', value)}
                placeholder='Enter course title...'
                helperText='A clear title helps AI create focused chapter names.'
              />
              <TextAreaInput
                label='Additional Instructions'
                value={form.additionalInstructions}
                onChange={(value) => updateField('additionalInstructions', value)}
                placeholder='Any tone/style/constraints you want AI to follow...'
              />
            </div>
          </section>
        </div>

        <div className='flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100'
          >
            Cancel
          </button>
          <button
            type='button'
            disabled={!canGenerate || isGenerating}
            onClick={() => {
              void handleGenerate()
            }}
            className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300'
          >
            <FiTrendingUp className='h-4 w-4' />
            {isGenerating ? 'Generating...' : 'Generate Course'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateCourseWithAIModal
