import React, { useState, useRef, useEffect } from 'react'
import { FiSend, FiX } from 'react-icons/fi'

type ChatMessage = {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const AIAssistantPanel: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleChatSend = async () => {
    if (!chatInput.trim()) return

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMsg])
    setChatInput('')

    // Simulate AI response (placeholder - integrate with real API later)
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Đây là câu trả lời mẫu. Vui lòng kết nối với API AI thực.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, assistantMsg])
    }, 500)
  }

  return (
    <div className='pointer-events-none fixed bottom-5 right-5 z-40'>
      {open ? (
        <div className='pointer-events-auto w-[400px] rounded-2xl border border-violet-200 bg-white shadow-2xl flex flex-col h-[600px]'>
          {/* Header */}
          <div className='flex items-center justify-between rounded-t-2xl bg-violet-600 px-4 py-3 text-white'>
            <div>
              <p className='text-sm font-semibold'>AI Q&A Assistant</p>
              <p className='text-xs text-violet-100'>Ask questions about your course</p>
            </div>
            <button
              type='button'
              onClick={() => setOpen(false)}
              className='rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20'
            >
              <FiX className='w-4 h-4' />
            </button>
          </div>

          {/* Chat messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3'>
            {messages.length === 0 ? (
              <div className='flex items-center justify-center h-full text-gray-500 text-sm'>
                <p>Bắt đầu đặt câu hỏi về khóa học</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.type === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div className='border-t border-gray-200 p-3 flex gap-2'>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleChatSend()
                }
              }}
              placeholder='Hỏi AI...'
              className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200'
            />
            <button
              onClick={handleChatSend}
              disabled={!chatInput.trim()}
              className='rounded-lg bg-violet-600 px-3 py-2 text-white disabled:opacity-50'
            >
              <FiSend className='w-4 h-4' />
            </button>
          </div>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='pointer-events-auto rounded-full bg-violet-600 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-violet-700'
        >
          ✨ AI Q&A
        </button>
      )}
    </div>
  )
}

export default AIAssistantPanel

