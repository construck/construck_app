import React, { useContext, useEffect, useState } from 'react'
import { Table } from 'semantic-ui-react'
import MSubmitButton from './../../common/mSubmitButton'
import Menu from './menu'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

let url = process.env.NEXT_PUBLIC_BKEND_URL
let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

export default function DispatchReport() {
  const [report, setReport] = useState([])

  useEffect(() => {
    getReport()
  }, [])

  const getReport = async () => {
    const res = await fetch(`${url}/works/reports/2024-02-10`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
    const data = await res.json()
    console.log(data)
    setReport(data)
  }

  return (
    <div className="my-5 flex flex-col space-y-3 px-10">
      <div className="flex h-12 items-start justify-end">
        <h2 className="flex-1">
          <span>Dispatches</span>
        </h2>
      </div>
      <Menu current="dispatchReports" reportsCount={report?.count} />
      <div className="flex items-center justify-end">
        <div className="relative flex flex-1 items-center rounded-md bg-white shadow-sm md:items-stretch">
          <button
            type="button"
            className="flex h-10 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
          >
            <span className="sr-only">Previous day</span>
            <ArrowLeftIcon className="h-5 w-5" />
            {/* <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> */}
          </button>
          <button
            type="button"
            className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
          >
            Feb 10th, 2024
          </button>
          <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button
            type="button"
            className="flex h-10 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
          >
            <span className="sr-only">Next day</span>
            <ArrowRightIcon className="h-5 w-5" />
            {/* <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> */}
          </button>
        </div>
        <div>
          <MSubmitButton
            icon={<ArrowDownTrayIcon className="text-zinc-800 h-5 w-5" />}
            label="Download"
          />
        </div>
      </div>
      <div>
        <Table size="small" compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Project name</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>In progress</Table.HeaderCell>
              <Table.HeaderCell>Stopped</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {report &&
              report?.report?.map((row, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{row.project}</Table.Cell>
                    <Table.Cell>{row.created}</Table.Cell>
                    <Table.Cell>{row.inProgres}</Table.Cell>
                    <Table.Cell>{row.stopped}</Table.Cell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}
