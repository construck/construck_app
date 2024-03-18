import React from 'react'

export default function MTextView({ content, selected }) {
  return (
    <div
      className={
        !selected
          ? 'flex text-sm font-normal '
          : 'flex rounded bg-gray-500 px-1 text-sm font-normal transition duration-150 ease-in-out'
      }
    >
      {content}
    </div>
  )
}
