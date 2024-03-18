import { DatePicker, Tooltip } from 'antd'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { Dropdown, Loader } from 'semantic-ui-react'
import MTextView from './mTextView'
import TextInput from './TextIput'
import TextInputLogin from './TextIputLogin'
import TextInputV from './TextIputV'
import SmallTextInput from './mSmallTextIput'
import * as _ from 'lodash'

import { toast, ToastContainer } from 'react-toastify'
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  PlayIcon,
  ReceiptRefundIcon,
  StopIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import MSmallSubmitButton from './mSmallSubmitButton'
import { UserContext } from '../../contexts/UserContext'

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
  } else {
    return (
      <div className="flex flex-row items-center justify-center">
        <Loader active size="tiny" inline />
        {/* <MTextView content={status} /> */}
      </div>
    )
  }
}
export default function Modal({
  isShown,
  setIsShown,
  title,
  body,
  handleConfirm,
  type,
  handleReasonChange,
  handleSetEndIndex,
  handleSetStartIndex,
  handleSetDuration,
  handleSetTripsDone,
  handleSetComment,
  handleSetMoreComment,
  handleSetReason,
  handleSetPostingDate,
  handleApproveDailyWork,
  handleRejectDailyWork,
  handleDiscardDailyWork,
  reasons,
  rowData,
  showReasonField = false,
  startIndexInvalid = false,
  endIndexInvalid = false,
  startIndexErrorMessage = 'Invalid value!',
  endIndexErrorMessage = 'Invalid value!',
  reasonSelected = false,
  isSiteWork,
  dailyWorks,
  handleConfirmApproval,
  handleConfirmRejection,
}) {
  let [lEndIndex, setLEndIndex] = useState(0)
  let uom = rowData?.equipment?.uom
  let [startIndexNotApplicable, setStartIndxNotApp] = useState(false)
  let [pDate, setPDate] = useState(moment().format('DD-MMM-YYYY'))
  let [siteWorkPosted, setSiteWPosted] = useState(false)
  let [pendingRecord, setPedingRecord] = useState(null)
  let [postLive, setPostLive] = useState(false)
  let { user, setUser } = useContext(UserContext)

  useEffect(() => {
    let _d = dailyWorks?.map((d) => {
      d.date = moment(d?.date).format('DD-MMM-YYYY')
      return d
    })
    let _siteWorkPosted = _.find(_d, {
      date: moment(pDate).format('DD-MMM-YYYY'),
      pending: false,
    })

    setSiteWPosted(_siteWorkPosted)

    if (_siteWorkPosted && type === 'start') {
      toast.error('Already posted for the selected date!')
    }
    if (
      moment(pDate).diff(moment('01-07-2022', 'DD-MM-YYYY')) < 0 &&
      type === 'start'
    ) {
      setPostLive(true)
      toast.error("Date can't be before 01 JUL 2022!")
    } else {
      setPostLive(false)
    }
  }, [pDate])

  useEffect(() => {
    let _pendingRecord = _.find(dailyWorks, {
      pending: true,
    })
    setPedingRecord(_pendingRecord)
    setPDate(moment(_pendingRecord?.date).format('DD-MMM-YYYY'))
  }, [])

  return (
    <div>
      <div
        x-show={isShown}
        className="fixed inset-0 mx-auto h-screen overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex min-h-screen items-end justify-center px-4 text-center sm:block sm:p-0 md:items-center">
          <div
            x-cloak
            onClick={() => {
              setIsShown(false)
            }}
            x-show={isShown}
            x-transitionEnter="transition ease-out duration-300 transform"
            x-transitionEnter-start="opacity-0"
            x-transitionEnter-end="opacity-100"
            x-transitionLeave="transition ease-in duration-200 transform"
            x-transitionLeave-start="opacity-100"
            x-transitionLeave-end="opacity-0"
            className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity"
            aria-hidden="true"
          ></div>

          <div
            x-cloak
            x-show={isShown}
            x-transitionEnter="transition ease-out duration-300 transform"
            x-transitionEnter-start="opacity-0 trangray-y-4 sm:trangray-y-0 sm:scale-95"
            x-transitionEnter-end="opacity-100 trangray-y-0 sm:scale-100"
            x-transitionLeave="transition ease-in duration-200 transform"
            x-transitionLeave-start="opacity-100 trangray-y-0 sm:scale-100"
            x-transitionLeave-end="opacity-0 trangray-y-4 sm:trangray-y-0 sm:scale-95"
            className="my-20 inline-block w-full max-w-xl transform overflow-auto rounded-lg bg-white p-8 text-left shadow-xl transition-all 2xl:max-w-2xl"
          >
            <div className="flex items-center justify-between space-x-4">
              <div className="text-2xl font-semibold">{title}</div>
              <button
                onClick={() => setIsShown(false)}
                className="text-gray-600 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            <p className="mt-10 text-sm text-gray-500">{body}</p>

            {type === 'reject' && (
              <div className="mb-3 xl:w-96">
                <label
                  for="exampleFormControlTextarea1"
                  className="form-label mb-2 inline-block text-gray-700"
                >
                  Reason of rejection
                </label>
                <textarea
                  onChange={(e) => handleReasonChange(e.target.value)}
                  className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition
        ease-in-out
        focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder="Your message"
                ></textarea>
              </div>
            )}

            {type === 'stop' && (
              <div className="grid grid-cols-2 gap-x-2">
                <div className="mb-3 flex flex-col space-y-4">
                  {isSiteWork && (
                    <div className="flex w-1/2 flex-col space-y-4">
                      <MTextView content="Posting date" />
                      <DatePicker
                        defaultValue={moment(pendingRecord?.date)}
                        value={moment(pendingRecord?.date)}
                        disabled
                        // onChange={(d, dateString) => {
                        //   setPDate(moment(dateString).format('DD-MMM-YYYY'))
                        //   handleSetPostingDate(dateString)
                        // }}
                      />
                    </div>
                  )}

                  {parseInt(rowData?.startIndex) > 0 && (
                    <TextInputLogin
                      label={`End Index [from ${rowData?.startIndex}]`}
                      placeholder="0"
                      setValue={handleSetEndIndex}
                      type="number"
                      isRequired
                      error={endIndexInvalid}
                      errorMessage={endIndexErrorMessage}
                    />
                  )}

                  <TextInputLogin
                    label="Duration (Hrs)"
                    placeholder="0"
                    setValue={handleSetDuration}
                    type="number"
                    isRequired
                  />

                  {parseInt(rowData.dispatch?.targetTrips) > 0 && (
                    <TextInputLogin
                      label={
                        `Trips done out of ` + rowData.dispatch?.targetTrips
                      }
                      placeholder="0"
                      setValue={handleSetTripsDone}
                      type="number"
                    />
                  )}

                  {/* <TextInputLogin
                  label="Comment"
                  placeholder="0"
                  setValue={handleSetComment}
                  type="text"
                /> */}
                </div>

                {showReasonField && (
                  <div className="flex flex-col space-y-3">
                    <div>
                      <div className="mb-1 flex flex-row items-center">
                        <MTextView content="Reason" />
                      </div>
                      <Dropdown
                        options={reasons}
                        placeholder="Select reason"
                        search
                        compact
                        selection
                        onChange={(e, data) => {
                          handleSetReason(data.value)
                        }}
                      />
                    </div>
                    <div>
                      <div className="mb-1 flex flex-row items-center">
                        <MTextView content="Comment" />
                      </div>
                      <textarea
                        onChange={(e) => handleSetMoreComment(e.target.value)}
                        className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition
                                      ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        placeholder="Your comment"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            )}

            {type === 'amend' && (
              <div className="grid grid-cols-2 gap-x-2">
                <div className="mb-3 flex flex-col space-y-4">
                  {isSiteWork && (
                    <div className="flex w-1/2 flex-col space-y-4">
                      <MTextView content="Posting date" />
                      <DatePicker
                        defaultValue={moment(rowData?.dispatchDate)}
                        value={moment(rowData?.dispatchDate)}
                        disabled
                        // onChange={(d, dateString) => {
                        //   setPDate(moment(dateString).format('DD-MMM-YYYY'))
                        //   handleSetPostingDate(dateString)
                        // }}
                      />
                    </div>
                  )}

                  <TextInputLogin
                    label="Duration (Hrs)"
                    placeholder="0"
                    setValue={handleSetDuration}
                    type="number"
                    isRequired
                  />

                  {parseInt(rowData.targetTrips) > 0 && (
                    <TextInputLogin
                      label={`Trips done out of ` + rowData.targetTrips}
                      placeholder="0"
                      setValue={handleSetTripsDone}
                      type="number"
                    />
                  )}

                  {/* <TextInputLogin
                  label="Comment"
                  placeholder="0"
                  setValue={handleSetComment}
                  type="text"
                /> */}
                </div>

                {showReasonField && (
                  <div className="flex flex-col space-y-3">
                    <div>
                      <div className="mb-1 flex flex-row items-center">
                        <MTextView content="Reason" />
                      </div>
                      <Dropdown
                        options={reasons}
                        placeholder="Select reason"
                        search
                        compact
                        selection
                        onChange={(e, data) => {
                          handleSetReason(data.value)
                        }}
                      />
                    </div>
                    <div>
                      <div className="mb-1 flex flex-row items-center">
                        <MTextView content="Comment" />
                      </div>
                      <textarea
                        onChange={(e) => handleSetMoreComment(e.target.value)}
                        className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition
                                      ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        placeholder="Your comment"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            )}

            {type === 'start' && (
              <div className="flex flex-col space-y-3">
                {isSiteWork && (
                  <div className="flex w-1/2 flex-col space-y-4">
                    <MTextView content="Posting date" />
                    <DatePicker
                      defaultValue={moment()}
                      disabledDate={(current) => {
                        if (user?.userType !== 'admin')
                          return (
                            current.isAfter(moment()) ||
                            current <
                              moment().subtract(2, 'months').endOf('month')
                          )
                        else {
                          return current.isAfter(moment())
                        }
                      }}
                      onChange={(d, dateString) => {
                        let day = moment(dateString)
                        day.set('hours', 0)
                        day.set('minutes', 0)
                        day.set('seconds', 0)
                        day.set('milliseconds', 0)

                        setPDate(day.toISOString())
                        handleSetPostingDate(dateString)
                      }}
                    />
                  </div>
                )}

                <div class="form-check">
                  <input
                    class="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none focus:ring-0"
                    type="checkbox"
                    name="check"
                    id="checkNoIndex"
                    onChange={() => {
                      setStartIndxNotApp(!startIndexNotApplicable)
                    }}
                  />
                  <label
                    class="form-check-label inline-block text-zinc-800"
                    for="checkNoIndex"
                  >
                    Start Index not applicable
                  </label>
                </div>

                {!startIndexNotApplicable && (
                  <div className="flex w-1/2 flex-col space-y-4">
                    <TextInputLogin
                      label={`Start Index `}
                      placeholder={
                        rowData.equipment?.millage
                          ? rowData.equipment?.millage
                          : 0
                      }
                      setValue={handleSetStartIndex}
                      type="number"
                      isRequired
                      error={startIndexInvalid}
                      errorMessage={startIndexErrorMessage}
                    />
                  </div>
                )}
              </div>
            )}

            {type === 'expand' && (
              <div className="flex flex-col space-y-5">
                {rowData?.dailyWork
                  ?.filter((d) => {
                    return d.pending === false
                  })
                  .map((d, index) => {
                    return (
                      <div
                        className="flex flex-row items-center space-x-3"
                        key={index}
                      >
                        <MTextView
                          content={moment(d?.date).format('DD-MMM-YYYY')}
                        />
                        <MTextView
                          content={
                            d?.uom === 'hour'
                              ? _.round(d?.duration / (1000 * 60 * 60), 1) +
                                ' ' +
                                d?.uom +
                                's'
                              : _.round(d?.duration, 1) + ' ' + d?.uom + 's'
                          }
                        />
                        {!d.toConfirm && !d.status && (
                          <>
                            <div
                              // onClick={() => handleApproveDailyWork(d, index)}
                              className="flex cursor-pointer items-center justify-evenly rounded-full"
                            >
                              <MSmallSubmitButton
                                label="approve"
                                intent="success"
                                submit={() => handleApproveDailyWork(d, index)}
                              />
                            </div>

                            <div className="flex cursor-pointer items-center justify-evenly rounded-full">
                              <MSmallSubmitButton
                                label="reject"
                                intent="danger"
                                submit={() => handleRejectDailyWork(d, index)}
                              />
                            </div>
                          </>
                        )}

                        {d.toConfirm && !d.status && (
                          <>
                            <div
                              // onClick={() => {}}
                              className="flex cursor-pointer items-center justify-evenly rounded-full"
                            >
                              <MSmallSubmitButton
                                label="confirm"
                                submit={() => {
                                  d.toBeApproved &&
                                    handleConfirmApproval(d, index)
                                  d.toBeRejected &&
                                    handleConfirmRejection(d, index)
                                }}
                              />
                            </div>

                            <div
                              // onClick={() => {}}
                              className="flex cursor-pointer items-center justify-evenly rounded-full"
                            >
                              <MSmallSubmitButton
                                label="discard"
                                intent="danger"
                                submit={() => handleDiscardDailyWork(d, index)}
                              />
                            </div>
                          </>
                        )}

                        {d.toBeRejected && (
                          <SmallTextInput
                            isRequired={true}
                            placeholder="Reason"
                            setValue={handleSetReason}
                          />
                        )}

                        {d.status && (
                          <>
                            <MStatusIndicator status={d.status} />
                          </>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}

            {type === 'edit' && (
              <div className="grid grid-cols-2 gap-3">
                <div>Grid1</div>
                <div>Grid2</div>
              </div>
            )}

            {type !== 'expand' && (
              <div className="mt-6 flex flex-row justify-end space-x-5">
                <button
                  onClick={() => {
                    setIsShown(false)
                    showReasonField && handleSetReason('NA')
                  }}
                  type="button"
                  className="transform rounded-md bg-white px-3 py-2 text-sm capitalize tracking-wide text-zinc-800 ring-1 ring-gray-200 transition-colors duration-200 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring focus:ring-zinc-300 focus:ring-opacity-50"
                >
                  Cancel
                </button>

                {((reasonSelected && type === 'stop') ||
                  type === 'reject' ||
                  !type ||
                  type === 'end' ||
                  type === 'edit' ||
                  (reasonSelected && type === 'amend') ||
                  ((startIndexNotApplicable || !startIndexInvalid) &&
                    !siteWorkPosted &&
                    !postLive &&
                    type === 'start')) && (
                  <button
                    onClick={() => {
                      handleConfirm()
                      setIsShown(false)
                    }}
                    type="button"
                    className="transform rounded-md bg-red-400 px-3 py-2 text-sm capitalize tracking-wide text-white transition-colors duration-200 hover:bg-red-600 focus:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700"
                  >
                    Ok
                  </button>
                )}
              </div>
            )}

            {type === 'expand' && (
              <div className="mt-6 flex flex-row justify-end space-x-5">
                <button
                  onClick={() => {
                    setIsShown(false)
                  }}
                  type="button"
                  className="transform rounded-md bg-white px-3 py-2 text-sm capitalize tracking-wide text-zinc-800 ring-1 ring-gray-200 transition-colors duration-200 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring focus:ring-zinc-300 focus:ring-opacity-50"
                >
                  Done
                </button>
              </div>
            )}

            {/* <ToastContainer /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
