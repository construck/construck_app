import React, { useEffect, useState } from 'react'
import MSubmitButton from '../common/mSubmitButton'
import { PlusIcon } from '@heroicons/react/24/solid'
import TextInput from '../common/TextIput'
import {
  AdjustmentsVerticalIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  CheckIcon,
  ClockIcon,
  FolderPlusIcon,
  ListBulletIcon,
  QueueListIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { toast, ToastContainer } from 'react-toastify'
import JobCard from '../common/jobCard'
import JobCards from '../stages/jobCard'
import PartsRequisitions from '../stages/partsRequisition'
import InspectionDiagnosis from '../stages/inspectionDiagnosis'
import Repair from '../stages/repair'
import Testing from '../stages/testing'
import GatePass from '../stages/gatePass'
import MainStatusCard from '../common/mainStatusCard'
import { Modal, Button, Dropdown, Popconfirm } from 'antd'
import moment from 'moment'
import MTextView from '../common/mTextView'
import PrintableItems from '../stages/printableItems'
import OperatorCard from '../common/operatorCard'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import { Pagination } from 'semantic-ui-react'
import MPagination from '../common/pagination'
import * as _ from 'lodash'
import { Loader } from 'semantic-ui-react'
import { DatePicker, Descriptions } from 'antd'

const { RangePicker } = DatePicker
const Maintenance = () => {
  const canCreateData = true
  const role = JSON.parse(localStorage.getItem('user')).userType
  const text = 'Are you sure to approve the request of parts?'
  const textConfirm = 'Are you sure you want to save this action and proceed?'

  const [filterBy, setFilterBy] = useState('all')
  const [nAvailable, setNAvailable] = useState(0)
  const [nApproved, setNApproved] = useState(0)
  const [nCanceled, setNCanceled] = useState(0)
  const [nEntry, setNEntry] = useState(0)
  const [nDiagnosis, setNDiagnosis] = useState(0)
  const [nParts, setNParts] = useState(0)
  const [nRepair, setNRepair] = useState(0)
  const [nTesting, setNTesting] = useState(0)
  const [nClosed, setNClosed] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previousMode, setPreviousMode] = useState(false)
  const [status, setStatus] = useState('open')

  const [viewPort, setViewPort] = useState('list')
  const [search, setSearch] = useState('')
  const [projectList, setProjectList] = useState([])
  const [eqList, setEqList] = useState([])
  const [usersList, setUsers] = useState([])
  const [jobCards, setJobCards] = useState([])
  const [jobLogCards, setJobLogCards] = useState([])
  const [row, setRow] = useState('')
  const [existingRow, setExistingRow] = useState('')
  const [page, setPage] = useState(0)
  const [isReason, setIsReason] = useState(false)
  const [checkReason, setCheckReason] = useState(false)
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingJobCards, setLoadingJobCards] = useState(false)

  // Form States
  const [entryDate, setEntryDate] = useState('')
  const [driver, setDriver] = useState('')
  const [carPlate, setCarPlate] = useState('')
  const [mileages, setMileages] = useState('')
  const [currentMileages, setCurrentMileages] = useState('')
  const [location, setLocation] = useState('')
  const [startRepair, setStartRepair] = useState('')
  const [endRepair, setEndRepair] = useState('')
  const [inspectionTools, setInspectionTools] = useState([])
  const [mechanicalInspections, setMechanicalInspections] = useState([])
  const [startIndexNotApplicable, setStartIndxNotApp] = useState(false)
  const [sourceItem, setSourceItem] = useState('')
  const [operator, setOperator] = useState('')
  const [assignIssue, setAssignIssue] = useState([])
  const [itemsRequest, setItemsRequest] = useState([])
  const [transferParts, setTransferParts] = useState([])
  const [transferData, setTransferData] = useState([])
  const [inventoryItems, setInventoryItems] = useState([
    { value: '', index: 0 },
  ])
  const [inventoryData, setInventoryData] = useState([
    [{ issue: '', item: '', qty: '', recQty: '' }],
  ])
  const [reason, setReason] = useState('')
  const [isViewed, setIsViewed] = useState('not viewed')
  const [operatorApproval, setOperatorApproval] = useState([])
  const [teamApproval, setTeamApproval] = useState(false)
  const [supervisorApproval, setSupervisorApproval] = useState(false)
  const [operatorNotApplicable, setOperatorNotApp] = useState(false)
  const [mileagesNotApplicable, setMileagesNotApplicable] = useState(false)
  const [nextMileages, setNextMileages] = useState('')
  const [receivedParts, setReceivedParts] = useState('')
  const [requestParts, setRequestParts] = useState('')
  const [jobCardsPage, setJobCardsPage] = useState(1)
  const [cardCount, setCardCount] = useState(0)
  const [jobCardPageCount, setJobCardsPageCount] = useState(0)

  let [startDate, setStartDate] = useState(moment().format('YYYY-MM-01'))
  let [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))

  const url = process.env.NEXT_PUBLIC_BKEND_URL
  // const url = process.env.NEXT_PUBLIC_BKEND_URL
  const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD
  let foundItem = ''

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

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsViewed(isViewed == 'new request' ? 'approved new request' : 'approved')
    setIsReason(false)
    setCheckReason(false)
    setReason('')
    setIsModalOpen(false)
    setPage(4)
    handleUpdate()
    // role != 'workshop-support' && handleLogsUpdate()
  }

  const handleApproveReject = () => {
    setCheckReason(false)
    setPage(4)
    setIsModalOpen(false)
    handleUpdate()
    // role != 'workshop-support' && handleLogsUpdate()
  }

  const handleCancel = () => {
    setIsReason(false)
    setIsModalOpen(false)
  }

  const handleReject = () => {
    setIsReason(true)
    setCheckReason(false)
    setCheckReason(true)
  }

  const emptyState = () => {
    setPage(0)
    setEntryDate('')
    setMileages('')
    setDriver('')
    setCarPlate('')
    setLocation('')
    setInspectionTools([])
    setMechanicalInspections([])
    setStartIndxNotApp(false)
    setSourceItem('')
    setAssignIssue([])
    setItemsRequest([])
    setTransferParts([])
    setTransferData([])
    setInventoryItems([{ value: '', index: 0 }])
    setInventoryData([[{ issue: '', item: '', qty: '', recQty: '' }]])
    setIsReason(false)
    setReason('')
    setIsViewed('not viewed')
    setOperatorApproval([])
    setOperator('')
    setTeamApproval(false)
    setSupervisorApproval(false)
    setStartRepair('')
    setEndRepair('')
    setOperatorNotApp(false)
    setReceivedParts('')
    setRequestParts('')
  }

  const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  const disableDate = (current) => {
    return current && current > dayjs().endOf('day')
  }

  const disableCustomTime = (current) => ({
    disabledHours: () =>
      new Date().getFullYear() == new Date(current).getFullYear() &&
      new Date().getMonth() == new Date(current).getMonth() &&
      new Date().getDate() == new Date(current).getDate()
        ? range(new Date().getHours() + 1, 24)
        : range(0, 0),
    disabledMinutes: () =>
      new Date().getFullYear() == new Date(current).getFullYear() &&
      new Date().getMonth() == new Date(current).getMonth() &&
      new Date().getDate() == new Date(current).getDate() &&
      new Date().getHours() == new Date(current).getHours()
        ? range(new Date(current).getMinutes() + 2, 60)
        : range(0, 0),
    disabledSeconds: () => [55, 56],
  })

  const disabledTime = (current) => ({
    disabledHours: () => range(new Date().getHours() + 1, 24),
    disabledMinutes: () => range(new Date().getMinutes() + 2, 60),
    disabledSeconds: () => [55, 56],
  })

  const setJobCardsToUpdate = (data, shouldPrint) => {
    console.log('Data ', data)
    console.log('Data Should ', shouldPrint)
    populateJobLogsCard()
    refreshData()
    setRow(data)
    setExistingRow((prevState) => (prevState != '' ? data : prevState))
    setEntryDate(data.entryDate)
    setCarPlate(data.plate)
    setDriver(data.driver)
    setLocation(data.location)
    setStartRepair(data.startTime)
    setOperator(data.operator)
    setEndRepair(data.finishTime)
    setMileages(data.mileages)
    setCurrentMileages(data.mileages)
    setInspectionTools(data.inspectionTools)
    setMechanicalInspections(data.mechanicalInspections)
    setAssignIssue(data.assignIssue)
    setTeamApproval(data.teamApproval)
    setInventoryData(data.inventoryData)
    setInventoryItems(
      data.inventoryItems.length < 1
        ? [{ value: '', index: 0 }]
        : data.inventoryItems
    )
    setTransferData(data.transferData)
    setSourceItem(data.sourceItem)
    setTransferParts(data.transferParts)
    setReason(data.reason)
    setIsViewed(data.isViewed)
    setOperatorApproval(data.operatorApproval)
    setSupervisorApproval(data.supervisorApproval)
    setUpdatedAt(data.updated_At)
    setOperatorNotApp(data.operatorNotApplicable)
    setRequestParts(data.requestParts)
    setReceivedParts(data.receivedParts)
    if (
      shouldPrint &&
      (data.isViewed == 'approved' || data.isViewed == 'approved new request')
    ) {
      setPage(3)
    } else if (
      role == 'recording-officer' &&
      (data && data.status) == 'requisition' &&
      (data.isViewed == 'approved new request' ||
        data.isViewed == 'new request')
    ) {
      return
    } else {
      setPage(
        role != 'workshop-manager' &&
          role == 'workshop-support' &&
          data.status != 'pass' &&
          data.status != 'requisition'
          ? 1
          : (data && data.status) == 'entry'
          ? 1
          : (data && data.status) == 'diagnosis'
          ? 2
          : role == 'workshop-support' &&
            (data && data.status) == 'requisition' &&
            (data.isViewed == 'approved' ||
              data.isViewed == 'approved new request')
          ? 3
          : role != 'workshop-support' &&
            (data && data.status) == 'requisition' &&
            data.isViewed == 'approved'
          ? 3
          : role != 'workshop-support' &&
            (data && data.status) == 'requisition' &&
            data.sourceItem == 'Transfer' &&
            data.isViewed == 'approved'
          ? 3
          : (data && data.status) == 'requisition'
          ? 2
          : (data && data.status) == 'repair' &&
            data.finishTime &&
            data.finishTime.length > 1
          ? 6
          : (data && data.status) == 'repair'
          ? 5
          : (data && data.jobCard_status) == 'closed'
          ? 7
          : (data && data.status) == 'testing'
          ? 6
          : (data && data.status) == 'pass'
          ? 7
          : 0
      )
    }
    setMileagesNotApplicable(data.mileagesNotApplicable)
    setNextMileages(data.nextMileages)

    if (role == 'workshop-manager' && data && data.status == 'requisition') {
      showModal()
    } else if (
      (!shouldPrint &&
        role == 'recording-officer' &&
        data.status == 'testing') ||
      (role == 'workshop-manager' && data.status != 'requisition') ||
      role == 'workshop-team-leader' ||
      (role == 'workshop-supervisor' && data.jobCard_status == 'opened')
    ) {
      setViewPort('operatorView')
    } else {
      setViewPort(data && data.status && 'change')
    }
  }

  const download = (query) => {
    fetch(
      `${url}/api/maintenance?limit=-1&page=${0}&status=${'all'}&search=${search}&download=1&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((res) => res.json())
      .then((response) => {
        let data = []
        let res = response.jobCards
        if (query == 'general') {
          data = res.flatMap((obj) => {
            if (obj.sourceItem == 'Inventory') {
              return obj.inventoryData
                .filter((array) => array.some((obj) => obj.issue !== ''))
                .map((subObj) => {
                  return subObj
                    .filter((value) => value.issue !== '')
                    .map((anotherSub) => {
                      return {
                        'jobCard-Id': obj.jobCard_Id,
                        'entry Date': moment(obj.entryDate).format(
                          'DD-MMMM-YYYY LT'
                        ),
                        'driver / Operator': obj.operator,
                        location: obj.location,
                        mileages: obj.mileage,
                        'mechanical Issue': anotherSub.issue,
                        'plate number': obj.plate.text,
                        'source of parts': obj.sourceItem,
                        'parts requested': anotherSub.item,
                        'quantity requested': anotherSub.qty,
                        'quantity received': anotherSub.recQty,
                        'parts transfered': null,
                        'parts taken from': null,
                        status: obj.status,
                        'end repair':
                          obj.endRepair &&
                          moment(obj.endRepair).format('DD-MMMM-YYYY LT'),
                        mechanics: obj.assignIssue
                          .map((item) => item.mech)
                          .join(', '),
                      }
                    })
                })
            } else if (obj.sourceItem == 'Transfer') {
              return obj.transferData.map((subObj) => {
                return {
                  'jobCard-Id': obj.jobCard_Id,
                  'entry Date': moment(obj.entryDate).format('DD-MMMM-YYYY LT'),
                  'driver / Operator': obj.operator,
                  location: obj.location,
                  mileages: obj.mileage,
                  'mechanical Issue': obj.mechanicalInspections.join(', '),
                  'plate number': obj.plate.text,
                  'source of parts': obj.sourceItem,
                  'parts requested': null,
                  'quantity requested': null,
                  'quantity received': null,
                  'parts transfered': subObj.parts,
                  'parts taken from': subObj.from,
                  status: obj.status,
                  'end repair':
                    obj.endRepair &&
                    moment(obj.endRepair).format('DD-MMMM-YYYY LT'),
                  mechanics: obj.assignIssue
                    .map((item) => item.mech)
                    .join(', '),
                }
              })
            } else {
              return {
                'jobCard-Id': obj.jobCard_Id,
                'entry Date': moment(obj.entryDate).format('DD-MMMM-YYYY LT'),
                'driver / Operator': obj.operator,
                location: obj.location,
                mileages: obj.mileage,
                'mechanical Issue': obj.mechanicalInspections.join(', '),
                'plate number': obj.plate.text,
                'source of parts': obj.sourceItem,
                'parts requested': null,
                'quantity requested': null,
                'quantity received': null,
                'parts transfered': null,
                'parts taken from': null,
                status: obj.status,
                'end repair':
                  obj.endRepair &&
                  moment(obj.endRepair).format('DD-MMMM-YYYY LT'),
                mechanics: obj.assignIssue.map((item) => item.mech).join(', '),
              }
            }
          })
        } else if (query == 'mechanic') {
          data = res.flatMap((obj) => {
            if (obj.assignIssue.length > 0) {
              return obj.assignIssue.map((subObj) => {
                return {
                  'jobCard-Id': obj.jobCard_Id,
                  'mechanical Issue': subObj.issue,
                  'plate number': obj.plate.text,
                  mechanics: subObj.mech.join(', '),
                  'start date & time': moment(subObj.startRepair).format(
                    'DD-MMMM-YYYY LT'
                  ),
                  'end date & time': moment(subObj.endRepair).format(
                    'DD-MMMM-YYYY LT'
                  ),
                }
              })
            }
          })
        } else {
          data = res.flatMap((obj) => {
            // return {
            //   'jobCard-Id': obj.jobCard_Id,
            //   'plate number': obj.plate.text,
            //   'mechanical Issue': obj.mechanicalInspections.join(', '),
            //   'Requisition date': moment(obj.requestParts).format(
            //     'DD-MMMM-YYYY LT'
            //   ),
            //   'Reception date': moment(obj.receivedParts).format(
            //     'DD-MMMM-YYYY LT'
            //   ),
            //   'source of parts': obj.sourceItem,
            //   'parts requested': anotherSub.item,
            //   'quantity requested': anotherSub.qty,
            //   'quantity received': anotherSub.recQty,
            //   'parts transfered': null,
            //   'parts taken from': null,
            // }

            if (obj.sourceItem == 'Inventory') {
              return obj.inventoryData
                .filter((array) => array.some((obj) => obj.issue !== ''))
                .map((subObj) => {
                  return subObj
                    .filter((value) => value.issue !== '')
                    .map((anotherSub) => {
                      return {
                        'jobCard-Id': obj.jobCard_Id,
                        'plate number': obj.plate.text,
                        'mechanical Issue':
                          obj.mechanicalInspections.join(', '),
                        'Requisition date':
                          obj.requestParts &&
                          moment(obj.requestParts).format('DD-MMMM-YYYY LT'),
                        'Reception date':
                          obj.receivedParts &&
                          moment(obj.receivedParts).format('DD-MMMM-YYYY LT'),
                        'source of parts': obj.sourceItem,
                        'parts requested': anotherSub.item,
                        'quantity requested': parseInt(anotherSub.qty || '0'),
                        'quantity received': parseInt(anotherSub.recQty || '0'),
                        'parts transfered': null,
                        'parts taken from': null,
                      }
                    })
                })
            } else if (obj.sourceItem == 'Transfer') {
              return obj.transferData.map((subObj) => {
                return {
                  'jobCard-Id': obj.jobCard_Id,
                  'plate number': obj.plate.text,
                  'mechanical Issue': obj.mechanicalInspections.join(', '),
                  'Requisition date':
                    obj.requestParts &&
                    moment(obj.requestParts).format('DD-MMMM-YYYY LT'),
                  'Reception date':
                    obj.receivedParts &&
                    moment(obj.receivedParts).format('DD-MMMM-YYYY LT'),
                  'source of parts': obj.sourceItem,
                  'parts requested': subObj.item,
                  'quantity requested': 0,
                  'quantity received': 0,
                  'parts transfered': subObj.parts,
                  'parts taken from': subObj.from,
                }
              })
            } else {
              return {
                'jobCard-Id': obj.jobCard_Id,
                'plate number': obj.plate.text,
                'mechanical Issue': obj.mechanicalInspections.join(', '),
                'Requisition date':
                  obj.requestParts &&
                  moment(obj.requestParts).format('DD-MMMM-YYYY LT'),
                'Reception date':
                  obj.receivedParts &&
                  moment(obj.receivedParts).format('DD-MMMM-YYYY LT'),
                'source of parts': obj.sourceItem,
                'parts requested': null,
                'quantity requested': null,
                'quantity received': null,
                'parts transfered': null,
                'parts taken from': null,
              }
            }
          })
        }

        const flattenMap = data
          .flatMap((item) => {
            if (Array.isArray(item)) {
              return item.map((subObj) => ({ ...subObj }))
            }
            return [item]
          })
          .filter((item) => item !== undefined)

        exportToCSV(
          flattenMap,
          `Detailed Workshop ${moment().format('DD-MMM-YYYY HH-mm-ss')}`
        )
      })
      .catch((err) => {
        console.log('Error ', err)
      })
  }

  const refreshData = () => {
    setLoading(true)
    populateJobCards()
    populateJobLogsCard()
    setLoading(false)
  }

  const populateJobLogsCard = () => {
    fetch(`${url}/api/maintenance/logs`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => setJobLogCards(res))
      .catch((err) => {})
  }

  const populateJobCards = () => {
    setLoadingJobCards(true)
    setJobCards([])
    // setNAvailable(0)
    // setNApproved(0)
    // setNCanceled(0)
    // // setNEntry(EntryCards.length)
    // setNEntry(0)
    // // setNDiagnosis(diagnosisCards.length)
    // setNDiagnosis(0)
    // // setNParts(requisitionCards.length)
    // setNParts(0)
    // // setNRepair(repairCards.length)
    // setNRepair(0)
    // setNTesting(0)
    // // setNClosed(closedCards.length)
    // setNClosed(0)

    fetch(
      `${url}/api/maintenance?limit=9&page=${jobCardsPage}&status=${status}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((res) => res.json())
      .then((response) => {
        let res = response?.jobCards
        console.log(response)
        setCardCount(response.dataCount)
        setJobCardsPageCount(_.round(response.dataCount / 9, 0) + 1)
        let availableCards = res.filter(
          (result) =>
            (result.status == 'requisition' && !result.isViewed) ||
            result.isViewed == 'not viewed' ||
            result.isViewed == 'new request'
        )
        let approvedCards = res.filter(
          (result) =>
            (result.status == 'requisition' && !result.isViewed) ||
            result.isViewed == 'approved' ||
            result.isViewed == 'approved new request'
        )
        let canceledCards = res.filter(
          (result) =>
            (result.status == 'requisition' && !result.isViewed) ||
            result.isViewed == 'denied'
        )
        let EntryCards = res.filter((result) => result.status == 'entry')
        let diagnosisCards = res.filter(
          (result) => result.status == 'diagnosis'
        )
        let requisitionCards = res.filter(
          (result) => result.status == 'requisition'
        )
        let repairCards = res.filter((result) => result.status == 'repair')
        let testingCards = res.filter((result) => result.status == 'testing')

        let closedCards = res.filter((result) => result.status == 'pass')
        setNAvailable(availableCards.length)
        setNApproved(approvedCards.length)
        setNCanceled(canceledCards.length)
        // setNEntry(EntryCards.length)
        setNEntry(response?.entryDataCount)
        // setNDiagnosis(diagnosisCards.length)
        setNDiagnosis(response?.diagnosisDataCount)
        // setNParts(requisitionCards.length)
        setNParts(response?.requisitionDataCount)
        // setNRepair(repairCards.length)
        setNRepair(response?.repairDataCount)
        setNTesting(response?.testingDataCount)
        // setNClosed(closedCards.length)
        setNClosed(response?.closedDataCount)
        setJobCards(res)
      })
      .catch((err) => {
        toast.error(err)
      })
      .finally(() => {
        setLoadingJobCards(false)
      })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    setFilterBy('all')
  }, [])

  useEffect(() => {
    fetch(`${url}/projects/v2`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let list = res
        let projectOptions = list.map((p) => {
          return {
            key: p._id,
            value: p._id,
            text: p.prjDescription,
            customer: p.customer,
          }
        })
        setProjectList(projectOptions)
      })
      .catch((err) => {
        toast.error(err)
      })
  }, [])

  useEffect(() => {
    fetch(`${url}/equipments`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let list = res.equipments
        let eqOptions = list
          .filter((l) => l.status !== 'workshop')
          .map((p) => {
            return {
              key: p._id,
              value: p._id,
              text: p.plateNumber,
              status: p.eqStatus,
              eqDescription: p.eqDescription,
              mileages: p.millage,
              eqStatus: p.eqStatus,
            }
          })
        setEqList(eqOptions)
      })
      .catch((err) => {
        toast.error(err)
        // setLoadingData(false)
      })
  }, [])

  useEffect(() => {
    fetch(`${url}/employees`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let list = res
        let userOptions = list.map((p) => ({
          key: p._id,
          value: p._id,
          text: p.firstName + ' ' + p.lastName,
          email: p.email,
          username: p.username,
          title: p.title,
          assignedShift: p.assignedShift,
          phone: p.phone,
          userType: p.type,
        }))
        setUsers(userOptions)
      })
      .catch((err) => {
        toast.error(err)
        // setLoadingData(false)
      })
  }, [])

  useEffect(() => {
    populateJobCards()
    populateJobLogsCard()
  }, [])

  useEffect(() => {
    setJobCardsPage(1)
    setLoadingJobCards(true)
    // setJobCardsPage(1)
    populateJobCards()
    populateJobLogsCard()
  }, [status])

  // useEffect(() => {
  //   if (search?.length > 3) {
  //     setJobCardsPage(1)
  //     setLoadingJobCards(true)
  //     // setJobCardsPage(1)
  //     populateJobCards()
  //     populateJobLogsCard()
  //   }
  // }, [search])

  useEffect(() => {
    setLoadingJobCards(true)
    // setJobCardsPage(1)
    populateJobCards()
    populateJobLogsCard()
  }, [jobCardsPage])

  const handleSubmit = () => {
    const payload = {
      entryDate,
      carPlate,
      mileages,
      driver,
      location,
      status: 'entry',
    }

    if (parseInt(mileages) < currentMileages && !startIndexNotApplicable) {
      // console.log(currentMileages, mileages)
      alert('Invalid Index')
    } else {
      fetch(`${url}/api/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          payload,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setRow(res)
          setExistingRow(res)
          fetch(`${url}/equipments/sendToWorkshop/${res.plate.key}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
          })
            .then((res) => res.json())
            .then((res) => {})
            .catch((err) => toast.error('Error Occured!'))

          fetch(`${url}/equipments/${res.plate.key}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
            body: JSON.stringify({
              millage: mileages,
            }),
          })
            .then((res) => res.json())
            .then((res) => {})
        })
        .catch((err) => toast.error('Error Occured!'))
        .finally(() => {
          setPage(1)
          setLoading(false)
        })
    }
  }

  const handleLogsSubmit = () => {
    setLoading(true)
    const payload = {
      entryDate,
      carPlate,
      mileages,
      driver,
      location,
      status: 'entry',
    }
    if (parseInt(mileages) < currentMileages && !startIndexNotApplicable) {
      setLoading(false)
    } else {
      fetch(`${url}/api/maintenance/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          payload,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          fetch(`${url}/equipments/sendToWorkshop/${res.plate.key}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
          })
            .then((res) => res.json())
            .then((res) => {
              setPage(1)
              setLoading(false)
            })
            .catch((err) => toast.error('Error Occured!'))
        })
        .catch((err) => toast.error('Error Occured!'))
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleUpdate = () => {
    setLoading(true)
    const payload = {
      entryDate,
      carPlate,
      mileages,
      driver,
      location,
      inspectionTools,
      startRepair,
      endRepair,
      mechanicalInspections,
      assignIssue,
      transferData,
      inventoryData,
      inventoryItems,
      operatorApproval,
      operator,
      sourceItem,
      transferParts,
      operatorNotApplicable,
      mileagesNotApplicable,
      nextMileages,
      teamApproval: role === 'workshop-team-leader' ? true : teamApproval,
      supervisorApproval:
        role === 'workshop-supervisor' ? true : row.supervisorApproval,
      isViewed:
        role == 'workshop-support' && page < 4
          ? 'new request'
          : role == 'workshop-support' && page >= 4
          ? 'approved new request'
          : role === 'workshop-manager' && row.status == 'requisition'
          ? isReason && isViewed == 'new request'
            ? 'denied'
            : !isReason && isViewed == 'new request'
            ? 'approved new request'
            : isReason
            ? 'denied'
            : 'approved'
          : isViewed,
      status:
        role == 'workshop-support' && page > 3
          ? 'repair'
          : role != 'workshop-manager'
          ? page == 1
            ? 'diagnosis'
            : page == 2 || page == 4
            ? 'requisition'
            : page == 5
            ? 'repair'
            : page == 6
            ? 'testing'
            : page == 7 && 'pass'
          : 'requisition',
      reason: role == 'workshop-manager' && !checkReason ? '' : reason,
      requestParts:
        role == 'recording-officer' &&
        row.status == 'requisition' &&
        row.isViewed == 'not viewed'
          ? moment()
          : requestParts,
      receivedParts:
        role == 'recording-officer' &&
        row.status == 'requisition' &&
        (row.isViewed == 'denied' || row.isViewed == 'approved')
          ? moment()
          : receivedParts,
    }
    console.log(payload)

    fetch(`${url}/api/maintenance/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({ payload }),
    })
      .then((res) => res.json())
      .then((result) => {
        populateJobCards()
        let endWork =
          result.assignIssue &&
          result.assignIssue.filter(
            (item) =>
              item.endRepair == '' ||
              item.hasOwnProperty('endRepair') == false ||
              item.endRepair == null
          )
        setLoading(false)
        if (
          page == 2 &&
          result.status == 'requisition' &&
          (result.sourceItem == 'Inventory' ||
            result.sourceItem == 'Transfer') &&
          (role == 'recording-officer' || role == 'workshop-support')
        ) {
          if (
            result.isViewed == 'not viewed' ||
            result.isViewed == 'new request'
          )
            setRequestParts(result.requestParts)
          setReceivedParts(result.receivedParts)
          fetch(`${url}/email/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
            body: JSON.stringify({
              workPayload: {
                jobCard_Id: result.jobCard_Id,
                plate: result.plate,
                postingDate: moment().format('DD-MMMM-YYYY LT'),
              },
              from: 'appinfo@construck.rw',
              to: 'amushimiyimana@construck.rw',
              subject: 'Work Notification',
              messageType: 'notification',
            }),
          })
            .then((res) => res.json())
            .then((res) => {})
            .catch((err) => console.log(err))

          setViewPort('list')
        } else if (
          role == 'workshop-supervisor' &&
          result.jobCard_status == 'closed'
        ) {
          fetch(`${url}/equipments/makeAvailable/${result.plate.key}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
          })
            .then((res) => res.json())
            .then((r) => {
              setPage(7)
              populateJobCards()
            })
        } else if (result.status == 'testing' && role == 'recording-officer') {
          populateJobCards()
          setViewPort('list')
        } else if (
          result.status !== 'repair' &&
          result.sourceItem == 'No Parts Required' &&
          role == 'recording-officer'
        ) {
          setPage(5)
        } else if (
          role != 'workshop-support' &&
          result.status == 'requisition' &&
          result.sourceItem == 'Transfer' &&
          role == 'recording-officer'
        ) {
          setRow(result)
          setPage(3)
        } else if (result.status == 'repair' && endWork.length > 0) {
          populateJobCards()
          setViewPort('list')
        } else if (role == 'recording-officer' && result.status == 'testing') {
          populateJobCards()
          setViewPort('list')
        } else setPage(page + 1)
      })
      .catch((err) => toast.error(err))
  }

  const handleLogsUpdate = () => {
    setLoading(true)
    const payload = {
      entryDate,
      carPlate,
      mileages,
      driver,
      location,
      inspectionTools,
      startRepair,
      endRepair,
      mechanicalInspections,
      assignIssue,
      transferData,
      inventoryData,
      inventoryItems,
      operatorApproval,
      operator,
      sourceItem,
      transferParts,
      operatorNotApplicable,
      mileagesNotApplicable,
      nextMileages,
      teamApproval: role === 'workshop-team-leader' ? true : teamApproval,
      supervisorApproval:
        role === 'workshop-supervisor' ? true : row.supervisorApproval,
      isViewed:
        role === 'workshop-manager' && row.status == 'requisition'
          ? isReason
            ? 'denied'
            : 'approved'
          : isViewed,
      status:
        role != 'workshop-manager'
          ? page == 1
            ? 'diagnosis'
            : page == 2 || page == 4
            ? 'requisition'
            : page == 5
            ? 'repair'
            : page == 6
            ? 'testing'
            : page == 7 && 'pass'
          : 'requisition',
      reason: role == 'workshop-manager' && !checkReason ? '' : reason,
      requestParts:
        role == 'recording-officer' &&
        row.status == 'requisition' &&
        (row.isViewed == 'denied' || row.isViewed == 'not viewed')
          ? moment()
          : '',
      receivedParts:
        role == 'recording-officer' &&
        row.status == 'requisition' &&
        (row.isViewed != 'denied' || row.isViewed != 'not viewed')
          ? moment()
          : '',
    }

    fetch(
      `${url}/api/maintenance/logs/${row.jobCard_Id || row.jobCard_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({ payload }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setLoading(false)
        populateJobCards()
      })
      .catch((err) => toast.error(err))
  }

  const getData = () => {
    let filtered = jobCards
    if (search) {
      filtered = jobCards.filter(
        (jobCard) =>
          (jobCard.plate &&
            jobCard.plate.text &&
            jobCard.plate.text.toLowerCase().includes(search.toLowerCase())) ||
          jobCard.jobCard_Id.toLowerCase().includes(search.toLowerCase()) ||
          (jobCard.driver &&
            jobCard.driver.text &&
            jobCard.driver.text.toLowerCase().includes(search.toLowerCase())) ||
          (jobCard.plate &&
            jobCard.plate.eqDescription &&
            jobCard.plate.eqDescription
              .toLowerCase()
              .includes(search.toLowerCase()))
      )
    } else if (filterBy !== 'all') {
      filtered = jobCards.filter(
        (jobCard) => jobCard.status == filterBy || jobCard.isViewed == filterBy
      )
    }
    return { totalCount: filtered.length, data: filtered }
  }

  // Multi steps
  const componentList = [
    <JobCards
      entryDate={entryDate}
      setEntryDate={setEntryDate}
      driver={driver}
      setDriver={setDriver}
      carPlate={carPlate}
      setCarPlate={setCarPlate}
      mileages={mileages}
      setMileages={setMileages}
      setCurrentMileages={setCurrentMileages}
      location={location}
      setLocation={setLocation}
      startIndexNotApplicable={startIndexNotApplicable}
      setStartIndxNotApp={setStartIndxNotApp}
      disableDate={disableDate}
      disabledTime={disableCustomTime}
      usersList={usersList}
      eqList={eqList}
      projectList={projectList}
      viewPort={viewPort}
    />,
    <InspectionDiagnosis
      inspectionTools={inspectionTools}
      setInspectionTools={setInspectionTools}
      mechanicalInspections={mechanicalInspections}
      setMechanicalInspections={setMechanicalInspections}
      role={role}
      previousMode={previousMode}
      row={row}
    />,
    <PartsRequisitions
      sourceItem={sourceItem}
      setSourceItem={setSourceItem}
      itemsRequest={itemsRequest}
      setItemsRequest={setItemsRequest}
      mechanicalInspections={mechanicalInspections}
      setPage={setPage}
      eqList={eqList}
      mileages={mileages}
      setTransferParts={setTransferParts}
      transferParts={transferParts}
      transferData={transferData}
      setTransferData={setTransferData}
      inventoryItems={inventoryItems}
      inventoryData={inventoryData}
      setInventoryItems={setInventoryItems}
      setInventoryData={setInventoryData}
      reason={reason}
      role={role}
      previousMode={previousMode}
      setAssignIssue={setAssignIssue}
      row={row}
    />,
    <PrintableItems
      row={row}
      jobLogCards={jobLogCards}
      setPage={setPage}
      role={role}
      setViewPort={setViewPort}
    />,
    <PartsRequisitions
      sourceItem={sourceItem}
      setSourceItem={setSourceItem}
      itemsRequest={itemsRequest}
      setItemsRequest={setItemsRequest}
      mechanicalInspections={mechanicalInspections}
      page={page}
      setPage={setPage}
      mileages={mileages}
      setTransferParts={setTransferParts}
      transferParts={transferParts}
      transferData={transferData}
      setTransferData={setTransferData}
      inventoryItems={inventoryItems}
      inventoryData={inventoryData}
      setInventoryItems={setInventoryItems}
      setInventoryData={setInventoryData}
      reason={reason}
      role={role}
      previousMode={previousMode}
      setAssignIssue={setAssignIssue}
      row={row}
    />,
    <Repair
      mechanicalInspections={mechanicalInspections}
      row={row}
      setAssignIssue={setAssignIssue}
      assignIssue={assignIssue}
      entryDate={entryDate}
      role={role}
      previousMode={previousMode}
    />,
    <Testing
      userList={usersList}
      operator={operator}
      setOperator={setOperator}
      operatorNotApplicable={operatorNotApplicable}
      setOperatorNotApp={setOperatorNotApp}
      role={role}
      previousMode={previousMode}
      row={row}
    />,
    <GatePass row={row} />,
  ]

  const items = [
    {
      key: '1',
      label: (
        <a className="flex items-center" onClick={() => download('general')}>
          <ListBulletIcon className="mr-3 h-6 w-6" />
          General Report
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a className="flex items-center" onClick={() => download('mechanic')}>
          <UsersIcon className="mr-3 h-5 w-5" />
          Mechanic Productivity Report
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a className="flex items-center" onClick={() => download('items')}>
          <WrenchScrewdriverIcon className="mr-3 h-5 w-5" />
          Items Requisition Report
        </a>
      ),
    },
  ]

  return (
    <div className="m-5 flex flex-col space-y-5 pl-10">
      <div className="text-2xl font-semibold">
        {viewPort == 'list'
          ? 'Maintenance Centre'
          : page == 0
          ? 'Job Card'
          : page == 1
          ? 'Diagnosis & Inspection'
          : page == 2 || page == 4
          ? 'Parts Requisition'
          : page == 3
          ? 'Print Requisition'
          : page == 5
          ? 'Repair'
          : page == 6
          ? 'Testing Equipment'
          : 'Gate Pass'}
      </div>
      <div className="flex w-full flex-row items-center space-x-4">
        {viewPort === 'list' && canCreateData && (
          <MSubmitButton
            submit={() => {
              emptyState()
              refreshData()
              setViewPort('new')
            }}
            intent="primary"
            icon={<PlusIcon className="h-5 w-5 text-zinc-800" />}
            label="New"
          />
        )}
        {viewPort === 'list' && (
          <>
            <div className="mx-auto flex-1">
              <TextInput placeholder="Search by Plate number, Equipment type" setValue={setSearch} />
            </div>

            <div className="mx-auto flex-1">
              <RangePicker
                onChange={(values, dateStrings) => {
                  setStartDate(dateStrings[0])
                  setEndDate(dateStrings[1])
                }}
              />
            </div>
          </>
        )}
        {viewPort === 'list' && (
          <>
            {/* {role == 'workshop-manager' ? (
                            <div className="flex flex-row items-center space-x-5">
                                <MainStatusCard
                                    data={{ title: 'Available', content: nAvailable }}
                                    intent={
                                        filterBy === 'not viewed' || filterBy === 'all' || filterBy === 'new request'
                                            ? 'not viewed'
                                            : ''
                                    }
                                    icon={<FolderPlusIcon className="h-5 w-5" />}
                                    onClick={() =>
                                    filterBy === 'not viewed' || filterBy === 'new request'
                                        ? setFilterBy('all')
                                        : setFilterBy('not viewed')
                                    }
                                />
                                <MainStatusCard
                                    data={{ title: 'Approved', content: nApproved }}
                                    intent={
                                    filterBy === 'approved' || filterBy === 'all'
                                        ? 'approved'
                                        : ''
                                    }
                                    icon={<CheckIcon className="h-5 w-5" />}
                                    onClick={() =>
                                    filterBy === 'approved'
                                        ? setFilterBy('all')
                                        : setFilterBy('approved')
                                    }
                                />
                                <MainStatusCard
                                    data={{ title: 'Canceled', content: nCanceled }}
                                    intent={
                                    filterBy === 'canceled' || filterBy === 'all'
                                        ? 'canceled'
                                        : ''
                                    }
                                    icon={<XCircleIcon className="h-5 w-5" />}
                                    onClick={() =>
                                    filterBy === 'Canceled'
                                        ? setFilterBy('all')
                                        : setFilterBy('Canceled')
                                    }
                                />
                            </div>
                        ) : ( */}
            <div className="flex flex-row items-center space-x-5">
              <MainStatusCard
                data={{ title: 'Entry', content: nEntry }}
                intent={status === 'entry' || status === 'open' ? 'entry' : ''}
                icon={<FolderPlusIcon className="h-5 w-5" />}
                onClick={() =>
                  status === 'entry' ? setStatus('open') : setStatus('entry')
                }
              />
              <MainStatusCard
                data={{ title: 'Diagnosis', content: nDiagnosis }}
                intent={
                  status === 'diagnosis' || status === 'open' ? 'diagnosis' : ''
                }
                icon={<CheckIcon className="h-5 w-5" />}
                onClick={() =>
                  status === 'diagnosis'
                    ? setStatus('open')
                    : setStatus('diagnosis')
                }
              />
              <MainStatusCard
                data={{ title: 'Requisition', content: nParts }}
                intent={
                  status === 'requisition' || status === 'open'
                    ? 'requisition'
                    : ''
                }
                icon={<ArrowPathRoundedSquareIcon className="h-5 w-5" />}
                onClick={() =>
                  status === 'requisition'
                    ? setStatus('open')
                    : setStatus('requisition')
                }
              />
              <MainStatusCard
                data={{ title: 'Repair', content: nRepair }}
                intent={
                  status === 'repair' || status === 'open' ? 'repair' : ''
                }
                icon={<AdjustmentsVerticalIcon className="h-5 w-5" />}
                onClick={() =>
                  status === 'repair' ? setStatus('open') : setStatus('repair')
                }
              />
              <MainStatusCard
                data={{ title: 'Testing', content: nTesting }}
                intent={
                  status === 'testing' || status === 'open' ? 'testing' : ''
                }
                icon={<WrenchScrewdriverIcon className="h-5 w-5" />}
                onClick={() =>
                  status === 'testing'
                    ? setStatus('open')
                    : setStatus('testing')
                }
              />
              <MainStatusCard
                data={{ title: 'Closed', content: nClosed }}
                intent={status === 'pass' || status === 'open' ? 'closed' : ''}
                icon={<XCircleIcon className="h-5 w-5" />}
                onClick={() =>
                  status === 'pass' ? setStatus('open') : setStatus('pass')
                }
              />
            </div>
            {/* )} */}
          </>
        )}
        {viewPort === 'list' && (
          <div className="flex items-center space-x-5">
            <Dropdown menu={{ items }} placement="bottomRight">
              <QueueListIcon
                className="h-10 w-10 cursor-pointer"
                // onClick={() => download()}
              />
            </Dropdown>
            <MSubmitButton
              submit={refreshData}
              intent="neutral"
              icon={<MagnifyingGlassIcon className="h-5 w-5 text-zinc-800" />}
              label="Search"
            />
          </div>
        )}

        {(viewPort === 'new' ||
          viewPort === 'change' ||
          viewPort === 'operatorView') && (
          <MSubmitButton
            submit={() => {
              setPreviousMode(false)
              setPage(0)
              populateJobCards()
              setViewPort('list')
            }}
            intent="primary"
            icon={<ArrowLeftIcon className="h-5 w-5 text-zinc-800" />}
            label="Back"
          />
        )}
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        on
        width={800}
        footer={
          row.isViewed != 'approved' &&
          row.isViewed != 'approved new request' &&
          (row.sourceItem == 'Inventory' || row.sourceItem == 'Transfer') &&
          (!checkReason
            ? [
                <Button className="pt-0 pb-2" key="back" onClick={handleReject}>
                  Reject Request
                </Button>,
                isViewed == 'denied' ? (
                  <Popconfirm
                    placement="topLeft"
                    title={text}
                    onConfirm={handleOk}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button className="pt-0 pb-2" type="primary">
                      Approve
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    className="pt-0 pb-2"
                    key="submit"
                    type="primary"
                    onClick={handleOk}
                  >
                    Approve
                  </Button>
                ),
              ]
            : [
                <Button
                  disabled={reason.length < 1}
                  className="pt-0 pb-2"
                  key="submit"
                  type="primary"
                  onClick={handleApproveReject}
                >
                  Apply Denial
                </Button>,
              ])
        }
      >
        {row.sourceItem != 'No Parts Required' ? (
          <div className="py-10">
            <div className="flex justify-between">
              <h5 className="text-sm text-gray-400">
                Job Card: <b className="text-gray-600">{row.jobCard_id}</b>
              </h5>
              <div className="flex space-x-2 text-lg text-gray-400">
                <ClockIcon width={15} />
                <small className="font-bold text-gray-600">
                  {moment(row.entryDate).format('DD-MMMM-YYYY LT')}
                </small>
              </div>
            </div>
            <h5 className="mt-5 text-sm text-gray-400">
              Eq. Plate:{' '}
              <b className="text-gray-600">{row.plate && row.plate.text}</b>
            </h5>
            <h5 className="mt-7 text-sm text-gray-400">Mech. Issues: </h5>
            <div className="flex items-start space-x-3">
              {row.sourceItem == 'Inventory' ? (
                row.inventoryData &&
                row.inventoryData
                  .filter((array) => array.some((obj) => obj.issue !== ''))
                  .map((item) => (
                    <div className="mt-2 bg-gray-100 px-5 py-2">
                      {item
                        .filter((value) => value.issue !== '')
                        .map((value, i) => {
                          if (foundItem != value.issue) {
                            foundItem = value.issue
                            return (
                              <>
                                <h6 className="m-0 p-0">{value.issue}</h6>
                                <small>
                                  {value.item}: <b>{value.qty}</b>
                                </small>
                                <br />
                              </>
                            )
                          } else {
                            return (
                              <>
                                <small>
                                  {value.item}: <b>{value.qty}</b>
                                </small>
                                <br />
                              </>
                            )
                          }
                        })}
                    </div>
                  ))
              ) : (
                <>
                  {row.transferData &&
                    row.transferData.map((item) => (
                      <div className="mt-2 bg-gray-100 px-5 py-2">
                        <small>
                          <b>{item.qty && item.qty}</b> {item.parts}:{' '}
                          <b>{item.from}</b>
                        </small>
                      </div>
                    ))}
                </>
              )}
            </div>
            {(isReason || reason) && (
              <div className="mt-5 flex w-full flex-col space-y-1">
                <div className="flex flex-row items-center">
                  <MTextView content={'Denial Reason'} />
                  <div className="text-sm text-red-600">*</div>
                </div>
                <input
                  type={'text'}
                  name="reason"
                  value={reason}
                  onChange={({ target }) => setReason(target.value)}
                  className="w-full flex-grow rounded-sm border-gray-100 py-2.5 px-3 text-sm font-medium shadow-none ring-1 ring-gray-200 transition duration-200 ease-in-out hover:ring-1 hover:ring-gray-400 focus:outline-none focus:ring-blue-300"
                  placeholder={'Specify your reason'}
                />
              </div>
            )}
          </div>
        ) : (
          <h5 className="mt-5 text-center text-lg font-semibold">
            Not Part of Inventory
          </h5>
        )}
      </Modal>
      {/* Displaying Job Cards List */}
      {viewPort === 'list' && (
        <div className="flex flex-col justify-end">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobCards?.length > 0 && !loadingJobCards ? (
              jobCards?.map((c) => {
                return (
                  <JobCard
                    key={c._id}
                    data={{
                      _id: c._id,
                      status: c.status,
                      jobCard_id: c.jobCard_Id,
                      finishTime: c.endRepair,
                      startTime: c.startRepair,
                      plate: c.plate,
                      driver: c.driver,
                      operator: c.operator,
                      location: c.location,
                      operatorApproval: c.operatorApproval,
                      teamApproval: c.teamApproval,
                      supervisorApproval: c.supervisorApproval,
                      entryDate: c.entryDate,
                      mileages: c.mileage,
                      inspectionTools: c.inspectionTools,
                      mechanicalInspections: c.mechanicalInspections,
                      assignIssue: c.assignIssue,
                      inventoryData: c.inventoryData,
                      inventoryItems: c.inventoryItems,
                      sourceItem: c.sourceItem,
                      transferData: c.transferData,
                      transferParts: c.transferParts,
                      isViewed: c.isViewed,
                      reason: c.reason,
                      jobCard_status: c.jobCard_status,
                      updated_At: c.updated_At,
                      operatorNotApplicable: c.operatorNotApplicable,
                      mileagesNotApplicable: c.mileagesNotApplicable,
                      nextMileages: c.nextMileages,
                      requestParts: c.requestParts,
                      receivedParts: c.receivedParts,
                    }}
                    role={role}
                    canCreateData={canCreateData}
                    updateMe={setJobCardsToUpdate}
                  />
                )
              })
            ) : loadingJobCards ? (
              <div>
                <Loader active />
              </div>
            ) : (
              <h5 className="text-center">No Data ...</h5>
            )}
          </div>
          {/* <Pagination
            activePage={jobCardsPage}
            boundaryRange={1}
            onPageChange={(e, data) => {
              setJobCardsPage(data?.activePage)
              populateJobCards()
            }}
            size="mini"
            siblingRange={3}
            totalPages={jobCardPageCount}
            // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
          /> */}
          <div className="mt-5 self-end">
            {!loadingJobCards && (
              <MPagination
                activePage={jobCardsPage}
                count={cardCount}
                onPageChange={(e, data) => {
                  console.log(data)
                  setJobCardsPage(data?.activePage)
                }}
                pageSize={9}
              />
            )}
          </div>
        </div>
      )}

      {/* Creating Job Cards Forms*/}
      {viewPort === 'new' && (
        <div className="mt-5 w-1/2">
          {role == 'recording-officer' ? (
            componentList[page]
          ) : (
            <h5 className="mt-5 text-center text-lg font-medium">
              Logged in user is not authorized for job card creation
            </h5>
          )}
          <div className="mt-10 flex space-x-5">
            {page != 0 && page != 1 && (
              <MSubmitButton
                submit={() => {
                  setPage(page - 1)
                  setPreviousMode(true)
                }}
                label={`Go to Previous`}
                intent={'primary'}
              />
            )}
            {role == 'recording-officer' && !loading && (
              <Popconfirm
                placement="topLeft"
                title={textConfirm}
                disabled={loading}
                onConfirm={() => {
                  if (loading) return
                  previousMode && setViewPort('list')
                  if (page == 0) {
                    handleSubmit()
                    role == 'recording-officer' && handleLogsSubmit()
                  } else {
                    handleUpdate()
                    role == 'recording-officer' && handleLogsUpdate()
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <button
                  disabled={loading}
                  className="flex cursor-pointer items-center justify-center space-x-1 rounded bg-blue-400 px-3 py-2 text-white shadow-sm ring-1 ring-zinc-300 hover:bg-blue-500 active:scale-95"
                >
                  <div className="font-bold">{`${
                    page == 2
                      ? `Submit Request`
                      : page == 0
                      ? `Create Job Card`
                      : `Save & Continue`
                  }`}</div>
                </button>
              </Popconfirm>
            )}
          </div>
        </div>
      )}

      {viewPort === 'change' && (
        <div
          className={`mt-5 ${
            row &&
            (row.isViewed == 'approved' ||
              row.isViewed == 'approved new request')
              ? 'w-3/4'
              : 'w-1/2'
          }`}
        >
          {componentList[page]}
          {row && page != 3 && page != 7 && (
            <div className="mt-10 flex space-x-5">
              {((page != 0 && page != 1) ||
                (page != 1 && role !== 'workshop-support')) && (
                <MSubmitButton
                  intent="primary"
                  submit={() => {
                    setPage(page - 1)
                    setPreviousMode(true)
                  }}
                  label={`Go to Previous`}
                />
              )}
              {
                <Popconfirm
                  placement="topLeft"
                  title={textConfirm}
                  disabled={loading}
                  onConfirm={() => {
                    if (loading) return
                    if (row) {
                      previousMode && setViewPort('list')
                      handleUpdate()
                      role == 'recording-officer' && handleLogsUpdate()
                    }
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <button
                    disabled={loading}
                    className="flex cursor-pointer items-center justify-center space-x-1 rounded bg-blue-400 px-3 py-2 text-white shadow-sm ring-1 ring-zinc-300 hover:bg-blue-500 active:scale-95"
                  >
                    <div>{`${
                      page == 2 ? `Submit Request` : `Save & Continue`
                    }`}</div>
                  </button>
                </Popconfirm>
              }
            </div>
          )}
        </div>
      )}

      {viewPort == 'operatorView' && (
        <div className="mt-5 w-3/4">
          <OperatorCard
            row={row}
            role={role}
            teamApproval={teamApproval}
            operatorApproval={operatorApproval}
            setOperatorApproval={setOperatorApproval}
            setNextMileages={setNextMileages}
            nextMileages={nextMileages}
            mileagesNotApplicable={mileagesNotApplicable}
            setMileagesNotApplicable={setMileagesNotApplicable}
          />
          {row.status == 'testing' && (
            <div className="mt-10 flex space-x-5">
              {((role == 'workshop-team-leader' && row.teamApproval == false) ||
                role == 'workshop-supervisor') && (
                <MSubmitButton
                  intent="danger"
                  submit={() => {
                    if (role == 'workshop-team-leader') {
                      setTeamApproval(false)
                      setViewPort('list')
                    } else {
                      setSupervisorApproval(false)
                      setViewPort('list')
                    }
                  }}
                  intentColor={'danger'}
                  label={`Denie Approval`}
                />
              )}

              {((role == 'workshop-team-leader' && row.teamApproval == false) ||
                (role == 'workshop-supervisor' &&
                  row.teamApproval == true &&
                  row.supervisorApproval == false)) && (
                <MSubmitButton
                  submit={() => {
                    role == 'workshop-supervisor' && setPage(7)
                    handleUpdate()
                    role == 'recording-officer' && handleLogsUpdate()
                    setViewPort('list')
                  }}
                  intent={'success'}
                  intentColor={'success'}
                  label={`${
                    role == 'workshop-supervisor'
                      ? 'Authorise Gate Pass'
                      : role == 'workshop-team-leader'
                      ? 'Validate Repairs'
                      : 'Save & Continue'
                  }`}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Maintenance
