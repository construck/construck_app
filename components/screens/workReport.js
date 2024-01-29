import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { UserContext } from '../../contexts/UserContext'
import MSubmitButton from '../common/mSubmitButton'
import MTextView from '../common/mTextView'
import MPagination from '../common/pagination'
import TextInput from '../common/TextIput'
import TextInputLogin from '../common/TextIputLogin'

const WorkReport = () => {
  const [report, setReport] = useState([])
  useEffect(() => {}, [])

  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      <div className="flex items-center">
        <h1 className="flex-1 text-2xl font-semibold">Dispatch reports</h1>
        <div className="flex items-center space-x-10 divide-y divide-gray-200">
          <div className="flex items-center space-x-3">
            <span className="rounded-full bg-gray-100 p-2">
              <ChevronLeftIcon
                className="h-5 w-5 cursor-pointer"
                onClick={() => download()}
              />
            </span>
            <span className="rounded-full py-2">Jan 04, 2024</span>
            <span className="rounded-full bg-gray-100 p-2">
              <ChevronRightIcon
                className="h-5 w-5 cursor-pointer"
                onClick={() => download()}
              />
            </span>
          </div>
          <div>
            <MSubmitButton
              submit={() => {
                console.log('refreshing....')
              }}
              intent="primary"
              icon={<ArrowDownTrayIcon className="h-5 w-5 text-zinc-800" />}
              label="Download"
            />
          </div>
        </div>
      </div>
      <div>Dispatch report here...</div>
    </div>
  )
}

export default WorkReport
