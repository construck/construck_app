import React from 'react'
import { BadgeCheckIcon } from '@heroicons/react/24/outline'

export default function MSubmitButton({
  submit,
  label = 'Submit',
  icon,
  intent = '',
  disabled = false,
  intentColor,
}) {
  function getClassByIntent(intent) {
    if (intent === 'primary') {
      return 'flex items-center justify-center space-x-1 bg-primary hover:bg-primary/60  text-dark rounded border border-primary cursor-pointer px-3 py-2'
    } else if (intent === 'warning') {
      return 'flex items-center justify-center space-x-1 bg-yellow-200 rounded  cursor-pointer px-3 py-2'
    } else if (intent === 'danger') {
      return 'flex items-center justify-center space-x-1 bg-red-200 rounded  cursor-pointer px-3 py-2'
    } else if (intent === 'neutral') {
      return 'flex items-center justify-center space-x-1 bg-gray-50 rounded  cursor-pointer px-3 py-2'
    } else if (intent === 'success') {
      return 'flex items-center justify-center space-x-1 bg-green-100 rounded  cursor-pointer px-3 py-2'
    } else if (intent === 'disabled') {
      return 'flex items-center justify-center space-x-1 bg-gray-100 rounded  cursor-not-allowed px-3 py-2'
    } else {
      return 'flex items-center justify-center space-x-1 bg-secondary hover:bg-secondary/60 text-black rounded  cursor-pointer px-3 py-2'
    }
  }
  return (
    <button
      onClick={() => (disabled ? {} : submit())}
      className={getClassByIntent(intent)}
    >
      {icon}
      <div
        className={`text-sm font-bold ${
          intentColor && intentColor == 'danger'
            ? 'text-red-400'
            : intentColor == 'success'
            ? 'text-green-400'
            : ''
        }`}
      >
        {label}
      </div>
    </button>
  )
}
