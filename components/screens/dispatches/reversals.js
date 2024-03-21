import {
  ArrowRightIcon,
  ArrowPathIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import React, { useContext, useEffect, useState } from 'react'
import TextInput from '../../common/TextIput'
import { DatePicker, Descriptions } from 'antd'
import moment from 'moment'
import MTextView from '../../common/mTextView'
import MTitle from '../../common/mTitle'
import { UserContext } from '../../../contexts/UserContext'
import { Loader } from 'semantic-ui-react'
import Modal from '../../common/modal'
import Menu from './menu'
import Image from 'next/image'

const { RangePicker } = DatePicker

export default function Reversals() {
  let [plateNumber, setPlateNumber] = useState('')
  let [startDate, setStartDate] = useState(null)
  let [endDate, setEndDate] = useState(null)
  let [transactions, setTransactions] = useState(null)
  let url = process.env.NEXT_PUBLIC_BKEND_URL
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

  let [loading, setLoading] = useState(false)
  let [reverseTransaction, setReverseTransaction] = useState(false)
  let [params, setParams] = useState({})
  let [amendModalIsShown, setAmenModalIsShown] = useState(false)
  let [row, setRow] = useState(null)
  let [duration, setDuration] = useState(0)
  let [tripsDone, setTripsDone] = useState(0)
  let [comment, setComment] = useState('')
  let [moreComment, setMoreComment] = useState('')
  let [reasonList, setReasonList] = useState([])
  let [postingDate, setPostingDate] = useState('')

  let { user, setUser } = useContext(UserContext)

  useEffect(() => {
    fetch(`${url}/reasons`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp
        let reasonOptions = list.map((p) => {
          return {
            key: p._id,
            value: p.descriptionRw,
            text: p.description,
          }
        })
        setReasonList(reasonOptions)
      })
      .catch((err) => {
        toast.error(err)
      })
  }, [])

  const getTotalRevenue = (duration, rate) => {
    return duration && duration !== 0
      ? 'RWF ' + _.round(duration * rate, 2).toLocaleString()
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

  function getTransactions() {
    setLoading(true)
    fetch(
      `${url}/works/v3/toreverse/${plateNumber}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          setTransactions(res)
          setLoading(false)

          console.log(res[0])
        }
      })
      .catch((err) => setLoading(false))
  }

  function refresh() {
    setLoading(true)
    fetch(
      `${url}/works/v3/toreverse/${plateNumber}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          setTransactions(res)
          setLoading(false)
        }
      })
      .catch((err) => setLoading(false))
  }

  function _reverse(
    siteWork,
    id,
    dispatchDate,
    duration = 0,
    totalRevenue = 0,
    totalExpenditure = 0
  ) {
    setParams({
      siteWork,
      id,
      dispatchDate,
      duration,
      totalRevenue,
      totalExpenditure,
    })
    setReverseTransaction(true)
  }

  function confirmReverse() {
    if (params.siteWork) {
      fetch(
        `${url}/works/swreverse/${params.id}?date=${params.dispatchDate}&totalRevenue=${params.totalRevenue}&totalExpenditure=${params.totalExpenditure}&duration=${params.duration}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
          },
          body: JSON.stringify({
            reversedBy: user._id,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          refresh()
        })
        .catch((err) => setLoading(false))
    } else {
      fetch(`${url}/works/reverse/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          reversedBy: user._id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          refresh()
        })
        .catch((err) => setLoading(false))
    }
  }

  function _setReason(value) {
    setComment(value)
  }

  function _amend(
    siteWork,
    id,
    dispatchDate,
    duration = 0,
    totalRevenue = 0,
    totalExpenditure = 0
  ) {
    setParams({
      siteWork,
      id,
      dispatchDate,
      duration,
      totalRevenue,
      totalExpenditure,
    })
    setAmenModalIsShown(true)
  }

  function _swamend(
    siteWork,
    id,
    dispatchDate,
    duration = 0,
    totalRevenue = 0,
    totalExpenditure = 0
  ) {
    setParams({
      siteWork,
      id,
      dispatchDate,
      duration,
      totalRevenue,
      totalExpenditure,
    })
    setAmenModalIsShown(true)
  }

  function confirmAmend() {
    if (!row.siteWork) {
      fetch(`${url}/works/amend/${row._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          tripsDone,
          comment,
          moreComment,
          amendedBy: user._id,
          duration,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          refresh()
        })
        .catch((err) => {
          console.log(err)
          refresh()
        })
    } else {
      fetch(`${url}/works/swamend/${row._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          tripsDone,
          comment,
          moreComment,
          amendedBy: user._id,
          duration,
          prevDuration: row.duration,
          prevTotalRevenue: row.totalRevenue,
          prevTotalExpenditure: row.totalExpenditure,
          postingDate: moment(params.dispatchDate).format('DD-MMM-YYYY'),
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          refresh()
        })
        .catch((err) => {
          console.log(err)
          refresh()
        })
    }
  }

  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      {/* <div className="text-2xl font-semibold">Reversals</div> */}
      <div className="flex h-12 items-start justify-end">
        <h2 className="flex-1">
          <span>Dispatches</span>
        </h2>
      </div>
      <Menu current="reversals" />

      {/* Plate number search */}
      <div className="flex items-center gap-x-2">
        <div className="w-3/12">
          <TextInput
            placeholder="Search Plate number..."
            setValue={setPlateNumber}
            isRequired
          />
        </div>

        <div className="w-auto">
          <RangePicker
            onChange={(values, dateStrings) => {
              setStartDate(dateStrings[0])
              setEndDate(dateStrings[1])
            }}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '0px',
              cursor: 'pointer',
              fontSize: '17px',
              margin: '0px',
              padding: '8px 12px',
            }}
          />
        </div>

        {plateNumber.length >= 3 && startDate && endDate && (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 p-0 text-gray-400 hover:text-gray-500 focus:relative md:hover:bg-gray-50"
            onClick={() => getTransactions()}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
          // <div
          //   onClick={() => getTransactions()}
          //   className="w-cursor-pointer flex items-center justify-center rounded-full bg-white p-2 text-red-500 shadow-lg active:shadow-none"
          // >
          //   <ArrowRightIcon className="h-5 w-5" />
          // </div>
        )}
      </div>

      {/* List of posted records */}
      <div className="flex flex-col space-y-1">
        {loading ? (
          <div className="mx-auto">
            <Loader active />
          </div>
        ) : (
          transactions && (
            <>
              <div className="grid grid-cols-11 overflow-y-auto px-2">
                {/* Plate NUmber */}
                <MTitle content="Plate Number" />
                <MTitle content="Driver" />
                <MTitle content="Owner" />
                <MTitle content="Dispatch date" />
                <MTitle content="Project" />
                <MTitle content="Customer" />
                <MTitle content="Site Work" />
                <MTitle content="Duration" />
                <MTitle content="Revenue" />
                <MTitle content="Status" />
                <MTitle content="Actions" />
              </div>

              {transactions?.map((t) => {
                return (
                  <div className="round-sm grid grid-cols-11 items-center bg-white p-2 shadow-sm">
                    {/* Plate NUmber */}
                    <MTextView content={t?.equipment?.plateNumber} />
                    <MTextView content={t?.driverName ? t?.driverName : '-'} />
                    <MTextView content={t?.owner} />
                    <MTextView
                      content={
                        moment(t?.dispatchDate).format('DD-MMM-YYYY') +
                        ' ' +
                        t?.shift
                      }
                    />

                    <MTextView content={t?.project?.prjDescription} />
                    <MTextView content={t?.project?.customer} />
                    <MTextView content={t?.siteWork ? 'Yes' : 'No'} />
                    <MTextView
                      content={
                        t?.duration?.toFixed(2) + ' ' + t?.equipment?.uom + 's'
                      }
                    />
                    <MTextView
                      // content={
                      //   parseFloat(t?.totalRevenue).toLocaleString() + ' RWF'
                      // }

                      content={
                        !t?.siteWork
                          ? t?.totalRevenue
                            ? 'RWF ' +
                              _.round(t?.totalRevenue, 2).toLocaleString()
                            : '...'
                          : getTotalRevenue(t?.duration, t?.equipment?.rate)
                      }
                    />
                    <MTextView content={t?.status} />

                    {(t.status === 'stopped' ||
                      t.status === 'approved' ||
                      t.status === 'validated') && (
                      <div className="flex flex-row items-center space-x-2">
                        {(user?.userType === 'admin' ||
                          t.status === 'stopped' ||
                          t.status === 'approved') && (
                          <div
                            onClick={() => {
                              setRow(t)
                              _swamend(
                                t?.siteWork,
                                t?._id,
                                t?.dispatchDate,
                                t?.equipment?.uom === 'day'
                                  ? t?.duration
                                  : t?.duration * (1000 * 60 * 60),
                                t?.totalRevenue,
                                t?.totalExpenditure
                              )
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-500 flex h-6 w-6 cursor-pointer items-center justify-center rounded p-1 text-white shadow-sm"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </div>
                        )}

                        {(user?.userType === 'admin' ||
                          t.status === 'stopped' ||
                          t.status === 'approved') && (
                          <div
                            onClick={() =>
                              _reverse(
                                t?.siteWork,
                                t?._id,
                                t?.dispatchDate,
                                t?.equipment?.uom === 'day'
                                  ? t?.duration
                                  : t?.duration * (1000 * 60 * 60),
                                t?.totalRevenue,
                                t?.totalExpenditure
                              )
                            }
                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-red-500 p-1 text-white shadow-sm hover:bg-red-600 active:bg-red-500"
                          >
                            <ArrowPathIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    )}

                    {t.status === 'rejected' && (
                      <div
                        onClick={() => {
                          setRow(t)
                          _amend(
                            t?.siteWork,
                            t?._id,
                            t?.dispatchDate,
                            t?.equipment?.uom === 'day'
                              ? t?.duration
                              : t?.duration * (1000 * 60 * 60),
                            t?.totalRevenue,
                            t?.totalExpenditure
                          )
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-500 flex h-6 w-6 cursor-pointer items-center justify-center rounded p-1 text-white shadow-sm"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )
        )}
      </div>
      {reverseTransaction && (
        <Modal
          title="Reverse transaction"
          body="Are you sure you want to reverse this transaction? Please note that this is IRREVERSIBLE!"
          isShown={reverseTransaction}
          setIsShown={setReverseTransaction}
          handleConfirm={confirmReverse}
        />
      )}

      {amendModalIsShown && (
        <Modal
          title="Amend job"
          body="Are you sure you want to amend this job?"
          isShown={amendModalIsShown}
          setIsShown={setAmenModalIsShown}
          handleConfirm={confirmAmend}
          handleSetDuration={setDuration}
          handleSetTripsDone={setTripsDone}
          handleSetComment={setComment}
          handleSetMoreComment={setMoreComment}
          handleSetReason={_setReason}
          reasons={reasonList}
          rowData={row}
          showReasonField={tripsDone < row?.targetTrips || duration < 5}
          type="amend"
          reasonSelected={(duration < 5 && comment) || duration >= 5}
          isSiteWork={row?.siteWork}
          handleSetPostingDate={setPostingDate}
          dailyWorks={row?.dailyWork}
        />
      )}
    </div>
  )
}
