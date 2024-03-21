import React, { useState } from 'react'
import { DatePicker } from 'antd'
import { Segment, Loader } from 'semantic-ui-react'
import MSubmitButton from '@/components/common/mSubmitButton'
import _ from 'lodash'
import moment from 'moment'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'

const { RangePicker } = DatePicker

const url = process.env.NEXT_PUBLIC_BKEND_URL
const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

export default function Download({ onDownloadCompleted }) {
  let [startDate, setStartDate] = useState()
  let [endDate, setEndDate] = useState()
  let [loading, setLoading] = useState(false)
  let [error, setError] = useState('')

  const disabledDate = (current) => {
    return current && current.isSameOrAfter(moment())
  }

  const handleDownload = () => {
    setLoading(true)
    setError('')
    fetch(`${url}/equipments/utilization/download/${startDate}/${endDate}`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((resp) => {
        const data = resp?.length === 0 ? [] : resp
        if (data.length > 0) {
          exportToCSV(
            data,
            `Equipment utilization for ${startDate} to ${endDate}`
          )
          onDownloadCompleted()
          setStartDate(null)
          setEndDate(null)
        } else {
          setError('No data found on dates you have selected, try again')
        }
        setLoading(false)
      })
      .catch((err) =>
        toast.error('Something went wrong, refresh the page and try again!')
      )

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToCSV = (apiData, fileName) => {
      const ws = XLSX.utils.json_to_sheet(apiData)
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: fileType })
      FileSaver.saveAs(data, fileName + fileExtension)
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <div>Choose date range</div>
        <div className="w-full">
          <RangePicker
            onChange={(values, dateStrings) => {
              setStartDate(dateStrings[0])
              setEndDate(dateStrings[1])
            }}
            disabledDate={disabledDate}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '0px',
              cursor: 'pointer',
              fontSize: '17px',
              margin: '0px',
              padding: '6px 6px',
              width: '100%',
            }}
          />
        </div>
        {error && (
          <div className="mt-3 rounded bg-red-50 px-3 py-1 text-sm text-red-500">
            {error}
          </div>
        )}
      </div>
      <div className="flex items-center justify-end">
        {loading && (
          <div className="pr-3">
            <Loader active size="small" inline="left" />
          </div>
        )}
        <MSubmitButton
          submit={() => handleDownload()}
          label={!loading ? 'Download now' : 'Downloading...'}
          intent={!loading ? 'primary' : 'disabled'}
        />
      </div>
    </div>
  )
}
