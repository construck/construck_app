import React, { useEffect, useState } from 'react'
import { Table, Segment, Loader } from 'semantic-ui-react'
import MSubmitButton from './../../common/mSubmitButton'
import Menu from './menu'
import Image from 'next/image'
import _ from 'lodash'
import moment from 'moment'
import { DatePicker } from 'antd'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

import Nodata from './../../../assets/images/no-data.png'

let url = process.env.NEXT_PUBLIC_BKEND_URL
let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

export default function DispatchReport() {
  const [report, setReport] = useState([])
  const [date, setDate] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getReport(moment().subtract(1, 'days').format('YYYY-MM-DD'))
  }, [])

  const getReport = (d) => {
    setLoading(true)
    if (d === null || d === undefined) return
    fetch(`${url}/works/reports/${d}`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setReport(response?.report?.length === 0 ? [] : response)
        setLoading(false)
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false)
      })
  }

  const getTotal = (record) => {
    return record.created + record.stopped
  }
  const getPercentage = (record) => {
    if (record.created === 0 && record.stopped === 0) return '-'
    return (
      _.round((record.stopped * 100) / (record.created + record.stopped), 1) +
      '%'
    )
  }
  const getGlobalInProgressTotal = (records) => {
    let total = 0
    records.map((r) => {
      if (_.isEmpty(r.inProgress)) {
        total = 0
      } else {
        total = total + r.inProgress
      }
    })
    return total
  }
  const getGlobalStoppedTotal = (records) => {
    let total = 0
    records.map((r) => {
      total = total + r.stopped
    })
    return total
  }
  const getGlobalTotal = (records) => {
    let total = 0
    records.map((r) => {
      total = total + (r.created + r.stopped + r.inProgress)
    })
    return total
  }
  const getGlobalPercentStopped = (records) => {
    let totalStopped = 0
    let totalCreated = 0

    records.map((r) => {
      totalStopped = totalStopped + r.stopped
      totalCreated = totalCreated + r.created
    })
    return 0
  }
  const handleButtonClick = () => {
    getReport(date)
  }
  const disabledDate = (current) => {
    return current && current.isSameOrAfter(moment())
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
        <div className="relative flex flex-1 items-center gap-x-2">
          <DatePicker
            defaultValue={moment().subtract(1, 'days')}
            onChange={(values, dateStrings) => {
              setDate(dateStrings)
            }}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            placeholder="Select date"
            allowClear={true}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '0px',
              cursor: 'pointer',
              fontSize: '17px',
              margin: '0px',
              padding: '8px 12px',
            }}
          />
          {date !== '' && (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 p-0 text-gray-400 hover:text-gray-500 focus:relative md:hover:bg-gray-50"
              onClick={handleButtonClick}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div>
        {!loading && report?.count === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Image src={Nodata} width={125} height={125} priority alt="icon" />
            <h2 className="text-xl font-bold">No data found!</h2>
            <div className="text-md font-normal">
              Report on the selected date does not have any data.
            </div>
          </div>
        )}
        {!loading && report?.report?.length > 0 && (
          <Table size="small" compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Project name</Table.HeaderCell>
                <Table.HeaderCell>Created</Table.HeaderCell>
                <Table.HeaderCell>In progress</Table.HeaderCell>
                <Table.HeaderCell>Stopped</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>% Stopped</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {report &&
                report?.report?.map((row, index) => {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{row.project}</Table.Cell>
                      <Table.Cell>
                        {row.created === 0 ? (
                          <span className="text-gray-200">0</span>
                        ) : (
                          <>{row.created}</>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {row.inProgress === 0 ? (
                          <span className="text-gray-200">0</span>
                        ) : (
                          <>{row.inProgress}</>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {row.stopped === 0 ? (
                          <span className="text-gray-200">0</span>
                        ) : (
                          <>{row.stopped}</>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {getTotal(row) === 0 ? (
                          <span className="text-gray-200">0</span>
                        ) : (
                          <>{getTotal(row)}</>
                        )}
                        {}
                      </Table.Cell>
                      <Table.Cell>{getPercentage(row)}</Table.Cell>
                    </Table.Row>
                  )
                })}

              <Table.Row className="bg-gray-50/50">
                <Table.Cell></Table.Cell>
                <Table.Cell>{getTotal(report?.report)}</Table.Cell>
                <Table.Cell>
                  {getGlobalInProgressTotal(report?.report)}
                </Table.Cell>
                <Table.Cell>{getGlobalStoppedTotal(report?.report)}</Table.Cell>
                <Table.Cell>{getGlobalTotal(report?.report)}</Table.Cell>
                <Table.Cell>
                  {getGlobalPercentStopped(report?.report)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}
        {loading && (
          <Segment>
            <Loader active inline="centered" />
          </Segment>
        )}
      </div>
    </div>
  )
}
