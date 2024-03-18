import React from 'react'
import MLable from './mLabel'
import MTextView from './mTextView'

export default function TextInput({
  label,
  setValue,
  placeholder,
  value,
  index,
  type,
  isPassword = false,
  isRequired = false,
}) {
  return (
    <div className="flex w-full flex-row items-center justify-between space-x-5">
      {label && (
        <div className="flex flex-row items-center">
          <MTextView content={label} />
          {isRequired && <div className="text-sm text-red-600">*</div>}
        </div>
      )}
      <input
        required={isRequired}
        className={
          label
            ? 'w-4/5 border-gray-100 py-3 px-3 text-sm font-medium shadow-none ring-1 ring-gray-200 transition duration-200 ease-in-out hover:ring-1 hover:ring-gray-400 focus:outline-none focus:ring-blue-300'
            : 'w-full flex-grow border-gray-100 py-3 px-3 text-sm font-medium shadow-none ring-1 ring-gray-200 transition duration-200 ease-in-out hover:ring-1 hover:ring-gray-400 focus:outline-none focus:ring-blue-300'
        }
        onChange={(e) => setValue(e.target.value)}
        value={value}
        type={isPassword ? `password` : type}
        placeholder={placeholder}
      />
    </div>
  )
}
