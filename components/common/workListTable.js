import { useContext, useState } from 'react'

import React from 'react'
import { Table } from 'semantic-ui-react'
import MTextView from './mTextView'
import MLable from './mLabel'
import MPagination from './pagination'
import { paginate } from '../../utils/paginate'
import { UserContext } from '../../contexts/UserContext'
import _ from 'lodash'

import { ResponsiveWrapper } from '@nivo/core'
import { Tooltip } from 'antd'
import moment from 'moment'
import {
  ArrowsUpDownIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  EllipsisHorizontalIcon,
  FolderOpenIcon,
  PrinterIcon,
  ReceiptPercentIcon,
  TrashIcon,
  XMarkIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'

import {
  StopIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  ReceiptRefundIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid'
const MStatusIndicator = ({ status }) => {
  if (status === 'approved')
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <CheckIcon className="h-5 w-5 text-green-500" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  else if (status === 'rejected') {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <XMarkIcon className="h-5 w-5 text-red-500" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  } else if (status === 'in progress' || status === 'on going') {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  } else if (status === 'checked') {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <ExclamationCircleIcon className="h-5 w-5 text-blue-500" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  } else if (status === 'created') {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <PlayIcon className="h-5 w-5 text-teal-500" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  } else if (status === 'stopped') {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <StopIcon className="h-5 w-5 text-red-500" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  } else if (status === 'recalled') {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <ReceiptRefundIcon className="h-5 w-5 text-zinc-600" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  } else if (status === 'validated') {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <CheckBadgeIcon className="h-5 w-5 text-green-600" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  } else if (status === 'released') {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <HandThumbUpIcon className="h-5 w-5 text-indigo-500" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title={status}>
        <div className="flex flex-row items-center justify-center">
          <EllipsisHorizontalIcon className="h-5 w-5 text-gray-200" />
          {/* <MTextView content={status} /> */}
        </div>
      </Tooltip>
    )
  }
}

const getDuration = (startTime, duration) => {
  if (duration === 0 || !duration) {
    return Date.now() - new Date(startTime)
  } else {
    return duration
  }
}

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor(duration / (1000 * 60 * 60 * 24))

  days = days >= 1 ? days + 'days ' : ''
  hours = hours >= 1 ? +hours + 'hrs ' : ''
  minutes = minutes >= 1 ? minutes + 'min ' : ''
  seconds = seconds >= 1 ? seconds + 'sec.' : ''

  if (duration === 0 || (!days && !hours && !minutes)) return '...'
  else return days + hours + minutes
}

const getShiftLabel = (shift) => {
  if (shift === 'dayShift') return 'D'
  else if (shift === 'nightShift') return 'N'
  else return ''
}

const getTotalRevenue = (dailyWork) => {
  let totalRevenue = 0
  dailyWork?.map((s) => {
    s?.uom === 'hour' || s?.duration > 16
      ? (totalRevenue +=
          s?.rate * _.round(s?.duration / (1000 * 60 * 60), 2) || 0)
      : (totalRevenue += s?.totalRevenue || 0)
  })

  return totalRevenue && totalRevenue !== 0
    ? 'RWF ' + _.round(totalRevenue, 2).toLocaleString()
    : '...'
}

const getTotalDuration = (dailyWork, uom) => {
  let duration = 0
  dailyWork?.map((s) => {
    uom === 'hour'
      ? (duration += _.round(s?.duration / (1000 * 60 * 60), 2) || 0)
      : (duration += s?.duration || 0)
  })

  if (!duration) return '...'

  if (duration)
    return uom === 'hour'
      ? _.round(duration) + 'h'
      : Math.round(duration * 100) / 100 + 'd'
}

export default function WorkListTable({
  data,
  handelApprove,
  handelExpandSw,
  handelReject,
  handelRecall,
  handleOrder,
  handleSelect,
  handleDeselect,
  loading,
  handelStop,
  handelStart,
  handelEnd,
  handleSetDataSize,
  handlePageChange,
  dataCount,
  pageNumber,
  handleEdit,
  handleOpenDrawer,
  handleViewRow,
}) {
  const [pageSize, setPageSize] = useState(15)
  const { user, setUser } = useContext(UserContext)
  console.log('Data ', data)

  //Authorization
  let canDispatch = user?.permissions?.canDispatch
  let canStartAndStopJob = user?.permissions?.canStartAndStopJob
  let canViewRenues = user?.permissions?.canViewRenues
  let isVendor = user.userType === 'vendor'

  if (!data) data = []

  let pagesObj = paginate(data, pageNumber, pageSize)
  let pData = data
  // let pData = pagesObj.pagedData
  let pageStartIndex = 0
  // let pageStartIndex = pagesObj.startIndex

  if (user.userType === 'customer-admin') {
    let _pData = data.filter((p) => {
      return p.project?.customer === user.company?.name
    })
    data = _pData
    // pData = data
    // pData = paginate(_pData, pageNumber, pageSize).pagedData
    // pageStartIndex = paginate(_pData, pageNumber, pageSize).startIndex
  } else if (
    user.userType === 'customer-site-manager' ||
    user.userType === 'customer-project-manager'
  ) {
    let _pData = data.filter((p) => {
      // console.log(p.project, user.assignedProject?._id)
      return p.project?.prjDescription === user.assignedProject?.prjDescription
    })
    data = _pData
    // pData = data
    // pData = paginate(_pData, pageNumber, pageSize).pagedData
    // pageStartIndex = paginate(_pData, pageNumber, pageSize).startIndex
  } else if (user.userType === 'driver') {
    let _pData = data.filter((p) => {
      return p.driver?._id === user._id
    })
    data = _pData
    // pData = data
    // pData = paginate(_pData, pageNumber, pageSize).pagedData
    // pageStartIndex = paginate(_pData, pageNumber, pageSize).startIndex
  } else if (user.userType === 'vendor') {
    let _pData = data.filter((p) => {
      return p.equipment?.eqOwner === user.firstName
    })
    data = _pData
    // pData = data
    // pData = paginate(_pData, pageNumber, pageSize).pagedData
    // pageStartIndex = paginate(_pData, pageNumber, pageSize).startIndex
  }

  handleSetDataSize(dataCount)

  return (
    <div className="block">
      {dataCount > 0 && (
        <>
          <Table size="small" compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <div
                    className="flex cursor-pointer flex-row items-center space-x-1"
                    onClick={() => handleOrder('byDate')}
                  >
                    <div>Date</div>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </div>
                </Table.HeaderCell>

                <Table.HeaderCell singleLine>
                  <div>Start Date</div>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <div>End Date</div>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <div
                    className="flex cursor-pointer flex-row items-center space-x-1"
                    onClick={() => handleOrder('by project')}
                  >
                    <div>Project Name</div>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </div>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <div className="w-30 truncate">Plate number</div>
                </Table.HeaderCell>
                <Table.HeaderCell singleLine>
                  <div className="">Equipment type</div>
                </Table.HeaderCell>

                <Table.HeaderCell>Duration</Table.HeaderCell>

                {canViewRenues && (
                  <Table.HeaderCell singleLine>
                    <div
                      className="flex cursor-pointer flex-row items-center space-x-1"
                      onClick={() => handleOrder('byTotalAmount')}
                    >
                      <div>Actual revenue</div>
                      <ArrowsUpDownIcon className="h-4 w-4" />
                    </div>
                  </Table.HeaderCell>
                )}

                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
                <Table.HeaderCell>
                  <div
                    className="flex cursor-pointer flex-row items-center space-x-1"
                    onClick={() => handleOrder('byDriver')}
                  >
                    {isVendor ? 'Vendor Name' : ' Driver'}
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </div>
                </Table.HeaderCell>
                <Table.HeaderCell singleLine>
                  {isVendor ? "Vendor's Contact" : " Driver's contact"}
                </Table.HeaderCell>

                <Table.HeaderCell singleLine>
                  <div
                    className="flex cursor-pointer flex-row items-center space-x-1"
                    onClick={() => handleOrder('byTripsDone')}
                  >
                    <div>Trips Done</div>
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </div>
                </Table.HeaderCell>
                <Table.HeaderCell>Customer</Table.HeaderCell>

                {/* <Table.HeaderCell>Created on</Table.HeaderCell>
            <Table.HeaderCell>Created by</Table.HeaderCell>
            <Table.HeaderCell>Permit</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell> */}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {pData.map((row, index) => {
                let dailWorks = row.siteWork ? row.dailyWork : []
                let siteWorkPostedToday = false

                // let siteWorkPostedToday = _.find(dailWorks, {
                //   date: moment().format('DD-MMM-YYYY'),
                // })

                return (
                  <Table.Row key={row._id}>
                    <Table.Cell singleLine>
                      <div
                        className="flex cursor-pointer flex-row space-x-1 hover:underline"
                        onClick={() => {
                          handleOpenDrawer(true)
                          handleViewRow(row._id)
                        }}
                      >
                        <MTextView
                          content={
                            new Date(row?.dispatch?.date).toLocaleDateString() +
                            '-' +
                            getShiftLabel(row?.dispatch?.shift)
                          }
                        />
                        {row?.siteWork && (
                          <Tooltip
                            title={
                              <>
                                <div>Date(s) posted</div>
                                {row?.dailyWork.map((d, index) => {
                                  if (index <= 31)
                                    return (
                                      <div>
                                        {moment(d.date).format('DD-MMM-YYYY')}
                                      </div>
                                    )
                                })}
                                {row?.dailyWork?.length > 31 && <div>...</div>}
                              </>
                            }
                          >
                            <div className="rounded text-xs font-bold text-red-600">
                              sw
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {row.siteWork ? (
                        <MTextView
                          content={new Date(
                            row?.workStartDate
                          ).toLocaleDateString()}
                        />
                      ) : (
                        ''
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {row.siteWork ? (
                        <MTextView
                          content={new Date(
                            row?.workEndDate
                          ).toLocaleDateString()}
                        />
                      ) : (
                        ''
                      )}
                    </Table.Cell>
                    <Table.Cell singleLine>
                      <MTextView content={row.project?.prjDescription} />
                    </Table.Cell>

                    <Table.Cell singleLine>
                      <Tooltip
                        title={
                          isVendor
                            ? 'RWF ' +
                              row.equipment?.supplierRate?.toLocaleString() +
                              ' per ' +
                              row?.equipment?.uom
                            : 'RWF ' +
                              row.equipment?.rate?.toLocaleString() +
                              ' per ' +
                              row?.equipment?.uom
                        }
                      >
                        <div>
                          <MTextView content={row.equipment?.plateNumber} />
                        </div>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell singleLine>
                      <MTextView content={row.equipment?.eqDescription} />
                    </Table.Cell>

                    <Table.Cell>
                      <MTextView
                        content={
                          row.status === 'stopped' ||
                          row.status === 'in progress' ||
                          row.status === 'on going' ||
                          row.status === 'approved' ||
                          row.status === 'rejected'
                            ? !row?.siteWork
                              ? row?.equipment?.uom === 'hour'
                                ? _.round(row?.duration / (1000 * 60 * 60), 2) +
                                  'h'
                                : Math.round(row?.duration * 100) / 100 + 'd'
                              : getTotalDuration(
                                  row?.dailyWork,
                                  row?.equipment?.uom
                                )
                            : '...'
                        }
                      />
                    </Table.Cell>

                    {canViewRenues && (
                      <Table.Cell>
                        <Tooltip
                          title={
                            'Projected Revenue: RWF ' +
                            row.projectedRevenue.toLocaleString()
                          }
                        >
                          <div>
                            <MTextView
                              selected={row?.selected}
                              content={
                                !row?.siteWork
                                  ? row.totalRevenue
                                    ? 'RWF ' +
                                      _.round(
                                        row?.totalRevenue,
                                        2
                                      ).toLocaleString()
                                    : '...'
                                  : getTotalRevenue(row?.dailyWork)
                              }
                            />
                          </div>
                        </Tooltip>
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <MStatusIndicator status={row.status} />
                    </Table.Cell>

                    <Table.Cell>
                      <div className="mr-2 flex flex-row">
                        {user.userType === 'customer-site-manager' &&
                          row.status === 'stopped' &&
                          !row.siteWork && (
                            <>
                              <div
                                onClick={() =>
                                  handelApprove(row, index, pageStartIndex)
                                }
                                className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                              >
                                <CheckIcon className="h-5 w-5 text-green-400" />
                              </div>
                              <div
                                onClick={() =>
                                  handelReject(row, index, pageStartIndex)
                                }
                                className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                              >
                                <XMarkIcon className="h-5 w-5 text-red-400" />
                              </div>

                              {row.selected && (
                                <div
                                  onClick={() => handleDeselect(row)}
                                  className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                                >
                                  <ClipboardIcon className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                              {!row.selected && (
                                <div
                                  onClick={() => handleSelect(row)}
                                  className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                                >
                                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-400" />
                                </div>
                              )}
                            </>
                          )}

                        {user.userType === 'customer-site-manager' &&
                          row.siteWork &&
                          row.dailyWork.length >= 1 && (
                            <>
                              <div
                                onClick={() =>
                                  handelExpandSw(row, index, pageStartIndex)
                                }
                                className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                              >
                                <FolderOpenIcon className="h-5 w-5 text-blue-400" />
                              </div>
                            </>
                          )}

                        {user.userType === 'admin' &&
                          row.status === 'approved' && (
                            <>
                              <div
                                // onClick={() => handelApprove(row)}
                                className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                              >
                                <ReceiptRefundIcon className="h-5 w-5 text-green-400" />
                              </div>
                              <div
                                // onClick={() => handelReject(row)}
                                className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                              >
                                <PrinterIcon className="h-5 w-5 text-blue-400" />
                              </div>
                            </>
                          )}

                        {canStartAndStopJob && row.status === 'in progress' && (
                          <>
                            <div
                              onClick={() =>
                                handelStop(row, index, pageStartIndex)
                              }
                              className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                            >
                              <StopIcon className="h-5 w-5 text-red-500" />
                            </div>
                          </>
                        )}

                        {canDispatch && row.status === 'created' && (
                          <>
                            <div
                              onClick={() =>
                                handelRecall(row, index, pageStartIndex)
                              }
                              className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                            >
                              <ReceiptRefundIcon className="h-5 w-5 text-zinc-700" />
                            </div>
                          </>
                        )}

                        {canStartAndStopJob &&
                          !siteWorkPostedToday &&
                          (row.status === 'created' ||
                            row.status === 'on going') && (
                            <div
                              onClick={() =>
                                handelStart(row, index, pageStartIndex)
                              }
                              className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                            >
                              <PlayIcon className="h-5 w-5 text-green-600" />
                            </div>
                          )}

                        {canDispatch &&
                          (row.status === 'created' ||
                            row.status === 'on going') &&
                          row.siteWork &&
                          (row.equipment.eqStatus === 'assigned to job' ||
                            row.equipment.eqStatus === 'dispatched') && (
                            <div
                              onClick={() =>
                                handelEnd(row, index, pageStartIndex)
                              }
                              className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                            >
                              <TrashIcon className="h-5 w-5 text-red-600" />
                            </div>
                          )}

                        {canViewRenues && (
                          <div
                            onClick={() =>
                              handleEdit(row, index, pageStartIndex)
                            }
                            className="mr-4 flex h-8 w-11 cursor-pointer items-center justify-evenly rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                          >
                            <PencilSquareIcon className="h-5 w-5 text-blue-500" />
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell singleLine>
                      <MTextView
                        content={
                          row.driver
                            ? row.driver?.firstName + ' ' + row.driver?.lastName
                            : row.equipment?.eqOwner
                        }
                      />
                    </Table.Cell>

                    <Table.Cell>
                      <MTextView content={row.driver?.phone} />
                    </Table.Cell>

                    <Table.Cell>
                      {row.siteWork ? (
                        <div>
                          <MTextView content="N/A" />
                        </div>
                      ) : (
                        <Tooltip
                          title={
                            row?.dispatch?.targetTrips
                              ? 'Target trips: ' + row?.dispatch?.targetTrips
                              : 'NA'
                          }
                        >
                          <div>
                            <MTextView
                              content={row?.tripsDone ? row?.tripsDone : 0}
                            />
                          </div>
                        </Tooltip>
                      )}
                    </Table.Cell>

                    <Table.Cell singleLine>
                      <MTextView content={row?.project?.customer} />
                    </Table.Cell>

                    {/* <Table.Cell>{row.createdOn}</Table.Cell>
                <Table.Cell>{row.createdBy}</Table.Cell>
                <Table.Cell>{row.permit}</Table.Cell>
                <Table.Cell>{row.duration}</Table.Cell> */}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <MPagination
            count={dataCount}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            activePage={pageNumber}
          />
        </>
      )}

      {dataCount === 0 && (
        <div className="my-2 flex w-full flex-row items-center justify-center">
          No data found!
        </div>
      )}
    </div>
  )
}
