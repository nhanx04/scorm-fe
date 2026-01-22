import React from 'react'

const Divider: React.FC = () => (
  <div className="flex items-center my-6">
    <div className="flex-grow h-px bg-gray-300" />
    <span className="mx-3 text-gray-400 text-sm uppercase">or</span>
    <div className="flex-grow h-px bg-gray-300" />
  </div>
)

export default Divider

