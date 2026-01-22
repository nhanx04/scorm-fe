import React from 'react'

const filters = ['Bài giảng', 'Bài học', 'Kiểm tra đánh giá tiếp thu', 'Bài kiểm tra', 'Chương']

const CourseFilter: React.FC = () => (
  <div className='flex flex-wrap gap-3 mt-4'>
    {filters.map((f) => (
      <span
        key={f}
        className='px-4 py-1 bg-blue-50 border-[0.5px] border-blue-800 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200'
      >
        {f}
      </span>
    ))}
  </div>
)

export default CourseFilter
