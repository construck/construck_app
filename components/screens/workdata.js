import React, { useContext, useEffect, useState } from 'react'
import WorkListTable from '../common/workListTable'
import MSubmitButton from '../common/mSubmitButton'
import TextInput from '../common/TextIput'
import {
  RefreshIcon,
  PlusIcon,
  ArrowLeftIcon,
  DownloadIcon,
  TrashIcon,
  CheckIcon,
  UploadIcon,
  AdjustmentsIcon,
} from '@heroicons/react/outline'
import MTitle from '../common/mTitle'
import { Dropdown, Loader } from 'semantic-ui-react'
import MTextView from '../common/mTextView'
import { toast, ToastContainer } from 'react-toastify'
import _ from 'lodash'
import { DocumentDuplicateIcon } from '@heroicons/react/solid'
import { UserContext } from '../../contexts/UserContext'
import { DatePicker, Descriptions } from 'antd'
import Modal from '../common/modal'
// import XlsExport from 'xlsexport'
import { saveAs } from 'file-saver'
import DownloadForms from '../common/downloadForms'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import TextInputV from '../common/TextIputV'
import 'datejs'

const { RangePicker } = DatePicker

export default function Workdata() {
  let { user, setUser } = useContext(UserContext)
  let [workList, setWorkList] = useState([])
  let [ogWorkList, setOgWorkList] = useState([])
  let [projectList, setProjectList] = useState([])
  let [equipmentList, setEquipmentList] = useState([])
  let [jobTypeList, setJobTypeList] = useState([])
  let [driverList, setDriverList] = useState([])
  let [reasonList, setReasonList] = useState([])
  let [viewPort, setViewPort] = useState('list')
  let [nJobs, setNJobs] = useState(1)
  let [nAstDrivers, setNAstDrivers] = useState(1)
  let [jobList, setJobList] = useState([])
  let [eqType, setEqType] = useState('')
  let [dayShift, setDayShift] = useState(true)
  let [search, setSearch] = useState('')
  let [dispatchDate, setDispatchDate] = useState(Date.now())

  let [projects, setProjects] = useState([])

  let [project, setProject] = useState('')
  let [fromSite, setFromSite] = useState('')
  let [toSite, setToSite] = useState('')
  let [jobType, setJobType] = useState('')
  let [otherJobType, setOtherJobType] = useState('')
  let [targetTrips, setTargetTrips] = useState(0)
  let [equipments, setEquipments] = useState([])
  let [selEquipments, setSelEquipments] = useState([])
  let [equipmentsOg, setEquipmentsOg] = useState([])
  let [drivers, setDrivers] = useState([])
  let [astDrivers, setAstDrivers] = useState([])
  let [reasonForRejection, setReasonForRejection] = useState('')

  let [selectedWorks, setSelectedWorks] = useState([])

  let [orderAsc, setOrderAsc] = useState(true)

  let [recallModalIsShown, setRecallModalIsShown] = useState(false)
  let [stopModalIsShown, setStopModalIsShown] = useState(false)
  let [approveModalIsShown, setApproveModalIsShown] = useState(false)
  let [rejectModalIsShown, setRejectModalIsShown] = useState(false)
  let [orderModalIsShown, setOrderModalIsShown] = useState(false)
  let [showReasonField, setShowReasonField] = useState(false)

  let [row, setRow] = useState()
  let [rowIndex, setRowIndex] = useState()

  let [submitting, setSubmitting] = useState(false)
  let [loadingData, setLoadingData] = useState(true)

  let [startDate, setStartDate] = useState(
    Date.today().clearTime().moveToFirstDayOfMonth()
  )
  let [endDate, setEndDate] = useState(
    Date.today().clearTime().moveToLastDayOfMonth().addHours(23).addMinutes(59)
  )
  let [customer, setCustomer] = useState()
  let [searchProject, setSearchProject] = useState('')
  let [searchDriver, setSearchDriver] = useState('')
  let [owner, setOwner] = useState('')

  // duration, endIndex, tripsDone, comment

  let [duration, setDuration] = useState(0)
  let [endIndex, setEndIndex] = useState(0)
  let [tripsDone, setTripsDone] = useState(0)
  let [comment, setComment] = useState(0)

  useEffect(() => {
    setLoadingData(true)
    fetch('https://construck-backend.herokuapp.com/works/')
      .then((resp) => resp.json())
      .then((resp) => {
        setWorkList(resp)
        setOgWorkList(resp)
        setLoadingData(false)
      })
      .catch((err) => {
        setLoadingData(false)
        toast.error('Connection issue!!!')
      })
    fetch('https://construck-backend.herokuapp.com/projects/v2')
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp
        let projectOptions = list.map((p) => {
          return {
            key: p._id,
            value: p._id,
            text: p.prjDescription,
            customer: p.customer,
          }
        })
        setProjectList(projectOptions)
        setProjects(list)
      })
      .catch((err) => {})

    fetch('https://construck-backend.herokuapp.com/reasons')
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
      .catch((err) => {})

    fetch('https://construck-backend.herokuapp.com/employees/')
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp
        let userOptions = list
          .filter((l) => l.type === 'driver' || l.type === 'operator')
          .map((l) => {
            return {
              key: l._id,
              value: l._id,
              text: l.firstName + ' ' + l.lastName,
            }
          })
        setDriverList(userOptions)
      })
      .catch((err) => {})
  }, [])

  useEffect(() => {
    console.log(workList[rowIndex])
    let targetTrips = parseInt(workList[rowIndex]?.dispatch?.targetTrips)

    if (targetTrips > tripsDone) setShowReasonField(true)
    else setShowReasonField(false)
  }, [tripsDone])

  useEffect(() => {
    setLoadingData(true)
    fetch('https://construck-backend.herokuapp.com/works/')
      .then((resp) => resp.json())
      .then((resp) => {
        setWorkList(resp)
        setOgWorkList(resp)
        setLoadingData(false)
      })

    fetch('https://construck-backend.herokuapp.com/projects/v2')
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp
        let projectOptions = list.map((p) => {
          return {
            key: p._id,
            value: p._id,
            text: p.prjDescription,
            customer: p.customer,
          }
        })
        setProjectList(projectOptions)
        setProjects(list)
      })

    fetch('https://construck-backend.herokuapp.com/employees/')
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp
        let userOptions = list
          .filter((l) => l.type === 'driver' || l.type === 'operator')
          .map((l) => {
            return {
              key: l._id,
              value: l._id,
              text: l.firstName + ' ' + l.lastName,
            }
          })
        setDriverList(userOptions)
      })
  }, [viewPort])

  useEffect(() => {
    fetch(
      `https://construck-backend.herokuapp.com/equipments/type/${eqType}/${dispatchDate}/${
        dayShift ? 'dayShift' : 'nightShift'
      }`
    )
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp

        if (resp && list.length > 0) {
          let equipmentsOptions = list.map((l) => {
            return {
              key: l._id,
              value: l._id,
              text: l.plateNumber,
            }
          })
          setEquipmentList(equipmentsOptions)
          setEquipmentsOg(list)
        } else {
          setEquipmentList([])
        }
      })
      .catch((err) => {})

    fetch('https://construck-backend.herokuapp.com/jobtypes/eqType/' + eqType)
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp) {
          let list = resp
          if (list.length > 0) {
            let jobTypeOptions = list.map((jT) => {
              return {
                key: jT._id,
                value: jT._id,
                text: jT.jobDescription,
              }
            })
            setJobTypeList(jobTypeOptions)
          }
        }
      })
      .catch((err) => {})
  }, [eqType, dispatchDate, dayShift])

  useEffect(() => {
    if (
      viewPort === 'new' &&
      (targetTrips == 0 || (!targetTrips && eqType === 'Truck'))
    ) {
      toast.warning('Target trips are mandatory for this entry!')
    }
  }, [targetTrips])

  useEffect(() => {
    if (search.length >= 3) {
      console.log(search)
      setLoadingData(true)
      let _workList = ogWorkList.filter((w) => {
        let _search = search?.toLocaleLowerCase()
        let desc = w?.project?.prjDescription?.toLocaleLowerCase()
        let plateNumber = w?.equipment?.plateNumber?.toLocaleLowerCase()
        let customer = w?.project?.customer?.toLocaleLowerCase()
        let driver =
          w?.driver?.firstName?.toLocaleLowerCase() +
          w?.driver?.lastName?.toLocaleLowerCase()
        return (
          desc.includes(_search) ||
          plateNumber.includes(_search) ||
          customer.includes(_search) ||
          driver.includes(_search)
        )
      })
      setWorkList(_workList)
      setLoadingData(false)
    }

    if (searchDriver.length >= 3) {
      let _searchDriver = searchDriver?.toLocaleLowerCase()
      let _workList = workList.filter((w) => {
        let driver =
          w?.driver?.firstName?.toLocaleLowerCase() +
          w?.driver?.lastName?.toLocaleLowerCase()
        return driver.includes(_searchDriver)
      })
      setWorkList(_workList)
      setLoadingData(false)
    }

    if (search.length < 3 && searchDriver.length < 3) {
      setWorkList(ogWorkList)
      setLoadingData(false)
    }
  }, [search, owner, searchDriver])

  useEffect(() => {
    if (startDate && endDate) {
      let _workList = workList.filter((w) => {
        return (
          Date.parse(startDate) <= Date.parse(w?.dispatch?.date) &&
          Date.parse(endDate).addHours(23).addMinutes(59) >=
            Date.parse(w?.dispatch?.date)
        )
      })
      console.log(_workList)
      setWorkList(_workList)
      setLoadingData(false)
    } else {
      setWorkList(ogWorkList)
    }
  }, [startDate, endDate])

  function refresh() {
    setLoadingData(true)
    setSearch('')
    fetch('https://construck-backend.herokuapp.com/works/')
      .then((resp) => resp.json())
      .then((resp) => {
        setWorkList(resp)
        setOgWorkList(resp)

        setEquipments(resp)
        setEquipmentList([])
        setDrivers([])
        setNJobs(1)
        setTargetTrips(0)
        setEqType('')
        setLoadingData(false)
      })
  }

  function approve() {
    let _workList = [...workList]
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    fetch(`https://construck-backend.herokuapp.com/works/approve/${row._id}`, {
      method: 'PUT',
    })
      .then((resp) => resp.json())
      .then((resp) => {
        refresh()
      })
  }

  function bulkApprove() {
    setLoadingData(true)
    let promises = []
    selectedWorks.forEach((s) => {
      let p = fetch(
        `https://construck-backend.herokuapp.com/works/approve/${s}`,
        {
          method: 'PUT',
        }
      )
      promises.push(p)
    })

    Promise.all(promises)
      .then((r) => {
        refresh()
      })
      .catch((err) => console.error(err))
  }

  function _setRecallRow(row, index) {
    setRow(row)
    setRowIndex(index)
    setRecallModalIsShown(true)
  }
  function _setStopRow(row, index) {
    setRow(row)
    setRowIndex(index)
    setStopModalIsShown(true)
  }

  function _setApproveRow(row, index) {
    setRow(row)
    setRowIndex(index)
    setApproveModalIsShown(true)
  }

  function _setRejectRow(row, index) {
    setRow(row)
    setRowIndex(index)
    setRejectModalIsShown(true)
  }

  function _setOrderRow(row) {
    setRow(row)
    setOrderModalIsShown(true)
  }

  function recall() {
    let _workList = [...workList]
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    fetch(`https://construck-backend.herokuapp.com/works/recall/${row._id}`, {
      method: 'PUT',
    })
      .then((resp) => resp.json())
      .then((resp) => {
        refresh()
      })
  }

  function stop() {
    let _workList = [...workList]
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)

    // duration, endIndex, tripsDone, comment
    fetch(`https://construck-backend.herokuapp.com/works/stop/${row._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duration,
        endIndex,
        tripsDone,
        comment,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        refresh()
      })
  }

  function reject() {
    let _workList = [...workList]
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    fetch(`https://construck-backend.herokuapp.com/works/reject/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reasonForRejection,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        refresh()
      })
  }

  function select(row) {
    let _workList = [...workList]
    let _r = _workList.filter((r) => r._id === row._id)[0]
    _r.selected = true

    let _selectedWorks = [...selectedWorks]
    _selectedWorks.push(row._id)
    setSelectedWorks(_selectedWorks)

    setWorkList(_workList)
  }

  function deselect(row) {
    let _workList = [...workList]
    let _r = _workList.filter((r) => r._id === row._id)[0]
    _r.selected = false

    let _selectedWorks = selectedWorks
    let _newSelected = _selectedWorks.filter((s) => s !== row._id)
    console.log(_newSelected)
    setSelectedWorks(_newSelected)

    setWorkList(_workList)
  }

  function _setReason(value) {
    console.log(value)
    setComment(value)
  }

  function order(param) {
    if (param === 'byDate') {
      let ordered = _.orderBy(
        workList,
        ['dispatch.date'],
        [orderAsc ? 'asc' : 'desc']
      )
      setWorkList(ordered)
      setOrderAsc(!orderAsc)
    }

    if (param === 'byDriver') {
      let ordered = _.orderBy(
        workList,
        ['driver.lastName', 'driver.firstName'],
        [orderAsc ? 'asc' : 'desc']
      )
      setWorkList(ordered)
      setOrderAsc(!orderAsc)
    }

    if (param === 'byTotalAmount') {
      let ordered = _.orderBy(
        workList,
        ['totalRevenue'],
        [orderAsc ? 'asc' : 'desc']
      )
      setWorkList(ordered)
      setOrderAsc(!orderAsc)
    }

    if (param === 'byTripsDone') {
      let ordered = _.orderBy(
        workList,
        ['tripsDone'],
        [orderAsc ? 'asc' : 'desc']
      )
      setWorkList(ordered)
      setOrderAsc(!orderAsc)
    }
  }

  async function submit() {
    if (eqType === 'Truck' && (targetTrips == 0 || !targetTrips)) {
      toast.error('Target trips are mandatory for this entry!')
    } else {
      if (selEquipments.length === drivers.length) {
        let posted = 0
        let promises = []
        for (let i = 0; i < selEquipments.length; i++) {
          setSubmitting(true)
          await fetch('https://construck-backend.herokuapp.com/works', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project,
              equipment: selEquipments[i],
              workDone: jobType,
              driver: drivers[i],
              startTime: Date.now(),
              status: 'created',
              createdOn: Date.now(),
              dispatch: {
                otherJobType: otherJobType ? otherJobType : '',
                project,
                fromSite,
                toSite,
                targetTrips,
                equipments: selEquipments,
                drivers,
                astDrivers,
                jobType,
                shift: dayShift ? 'dayShift' : 'nightShift',
                createdOn: new Date().toISOString(),
                date: new Date(dispatchDate),
              },
            }),
          }).then((res) => {
            setSubmitting(false)
            if (i == selEquipments.length - 1) {
              setViewPort('list')
              refresh()
            }
          })
        }
      } else {
        setSubmitting(false)
        console.table(drivers)
        console.log(selEquipments)
      }
    }
  }

  function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.round((duration / (1000 * 60 * 60)) * 100) / 100,
      days = Math.floor(duration / (1000 * 60 * 60 * 24))

    // days = days >= 1 ? days + 'days ' : ''
    // hours = hours >= 1 ? +hours + 'hrs ' : ''
    // minutes = minutes >= 1 ? minutes + 'min ' : ''
    // seconds = seconds >= 1 ? seconds + 'sec.' : ''

    // if (duration === 0 || (!days && !hours && !minutes)) return '...'
    // else return days + hours + minutes
    return hours
  }

  function download() {
    let _workList = workList.map((w) => {
      return {
        'Dispatch date': Date.parse(w.dispatch.date).toString('d-MMM-yyyy'),
        'Dispatch Shift': w.dispatch.shift,
        'Project Description': w.project.prjDescription,
        'Equipment-PlateNumber': w.equipment.plateNumber,
        'Equipment Type': w.equipment.eqDescription,
        Rate: w.equipment.rate,
        'Unit of measurement': w.equipment.uom,
        'Duration (HRS)': w.equipment.uom === 'hour' ? msToTime(w.duration) : 0,
        'Duration (DAYS)':
          w.equipment.uom === 'day' ? Math.round(w.duration * 100) / 100 : 0,
        'Work done': w.workDone.jobDescription,
        'Other work description': w.dispatch.otherJobType,
        'Projected Revenue': w.projectedRevenue,
        'Actual Revenue': w.totalRevenue,
        'Driver Names': w.driver.firstName + ' ' + w.driver.lastName,
        'Driver contacts': w.driver.phone,
        'Target trips': w.dispatch.targetTrips,
        'Trips done': w.tripsDone,
        "Driver's/Operator's Comment": w.comment,
        Customer: w.project.customer,
        Status: w.status,
      }
    })

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

    exportToCSV(_workList, `Dispatch report ${Date.now()}`)
  }

  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      <div className="text-2xl font-semibold">Forms ({workList.length})</div>
      <div className="flex w-full flex-row items-center justify-between space-x-10">
        {viewPort === 'list' && user.userType === 'admin' && (
          <MSubmitButton
            submit={() => setViewPort('new')}
            intent="primary"
            icon={<PlusIcon className="h-5 w-5 text-zinc-800" />}
            label="New"
          />
        )}

        {viewPort === 'list' && (
          <div className="flex flex-1 flex-row items-center space-x-5 py-5">
            <TextInput placeholder="Search..." setValue={setSearch} />
            {/* <TextInputV placeholder="Customer Name" setValue={setCustomer} />
            <TextInputV placeholder="Project" setValue={setSearchProject} />*/}

            <TextInputV placeholder="Driver" setValue={setSearchDriver} />
            <div className="w-4/5">
              <Dropdown
                options={[
                  {
                    key: '0',
                    value: 'All',
                    text: 'All equipment',
                  },
                  {
                    key: '1',
                    value: 'Hired',
                    text: 'Hired equipment',
                  },
                  {
                    key: '2',
                    value: 'Construck',
                    text: 'Construck equipment',
                  },
                ]}
                placeholder="Select equipment owner"
                fluid
                search
                selection
                onChange={(e, data) => {
                  setOwner(data.value)
                }}
              />
            </div>

            <div className="w-3/5">
              <RangePicker
                onChange={(values, dateStrings) => {
                  setStartDate(dateStrings[0])
                  setEndDate(dateStrings[1])
                }}
              />
            </div>
          </div>
        )}

        {viewPort === 'new' && (
          <MSubmitButton
            submit={() => {
              setViewPort('list')
              refresh()
            }}
            intent="primary"
            icon={<ArrowLeftIcon className="h-5 w-5 text-zinc-800" />}
            label="Back"
          />
        )}

        {viewPort === 'list' && (
          <div className="flex flex-row items-center space-x-5">
            {selectedWorks.length >= 1 && (
              <div
                className="cursor-pointer rounded-lg p-1 font-normal"
                onClick={() => bulkApprove('available')}
              >
                Approve selected
              </div>
            )}
            <AdjustmentsIcon className="h-5 w-5 cursor-pointer text-red-500" />
            <DownloadIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => download()}
            />
            <DocumentDuplicateIcon className="h-5 w-5 cursor-pointer" />

            <MSubmitButton
              submit={refresh}
              intent="neutral"
              icon={<RefreshIcon className="h-5 w-5 text-zinc-800" />}
              label="Refresh"
            />
          </div>
        )}
      </div>
      {/* recall modal */}
      {recallModalIsShown && (
        <Modal
          title="Recall of a job"
          body="Are you sure you want to recall this job?"
          isShown={recallModalIsShown}
          setIsShown={setRecallModalIsShown}
          handleConfirm={recall}
        />
      )}

      {stopModalIsShown && (
        <Modal
          title="End job"
          body="Are you sure you want to end this job?"
          isShown={stopModalIsShown}
          setIsShown={setStopModalIsShown}
          handleConfirm={stop}
          handleSetEndIndex={setEndIndex}
          handleSetDuration={setDuration}
          handleSetTripsDone={setTripsDone}
          handleSetComment={setComment}
          handleSetReason={_setReason}
          reasons={reasonList}
          rowData={workList[rowIndex]}
          showReasonField={showReasonField}
          type="stop"
        />
      )}

      {approveModalIsShown && (
        <Modal
          title="Approval of a job"
          body="Are you sure you want to approve this job?"
          isShown={approveModalIsShown}
          setIsShown={setApproveModalIsShown}
          handleConfirm={approve}
        />
      )}
      {rejectModalIsShown && (
        <Modal
          title="Rejection of a job"
          body="Are you sure you want to reject this job?"
          isShown={rejectModalIsShown}
          setIsShown={setRejectModalIsShown}
          handleConfirm={reject}
          type="reject"
          handleReasonChange={setReasonForRejection}
        />
      )}
      {orderModalIsShown && (
        <Modal
          title="Order of a job"
          body="Are you sure you want to order this job?"
          isShown={orderModalIsShown}
          setIsShown={setOrderModalIsShown}
          handleConfirm={order}
        />
      )}
      {viewPort === 'list' && (
        <>
          {!loadingData ? (
            <WorkListTable
              data={workList}
              handelApprove={_setApproveRow}
              handelReject={_setRejectRow}
              handelRecall={_setRecallRow}
              handelStop={_setStopRow}
              handleOrder={order}
              handleSelect={select}
              handleDeselect={deselect}
              loading
            />
          ) : (
            <Loader active />
          )}
        </>
      )}

      {viewPort === 'new' && (
        <div className="flex flex-col">
          <div className="mt-5 flex flex-row items-center space-x-5">
            <div class="form-check">
              <input
                class="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none focus:ring-0"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={dayShift}
                onChange={() => {
                  setDayShift(!dayShift)
                }}
              />
              <label
                class="form-check-label inline-block text-zinc-800"
                for="flexRadioDefault1"
              >
                Day Shift
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none focus:ring-0"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                checked={!dayShift}
                onChange={() => {
                  setDayShift(!dayShift)
                }}
              />
              <label
                class="form-check-label inline-block text-zinc-800"
                for="flexRadioDefault2"
              >
                Night shift
              </label>
            </div>
          </div>

          <div class="form-check mt-5">
            <input
              class="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none focus:ring-0"
              type="checkbox"
              name="check"
              id="check1"
              onChange={() => {
                // setDayShift(!dayShift)
              }}
            />
            <label
              class="form-check-label inline-block text-zinc-800"
              for="check1"
            >
              Site work
            </label>
          </div>

          <div className="mt-5 flex flex-row space-x-10">
            <div className="mt-5 flex w-2/5 flex-col space-y-5">
              <MTitle content="Dispatch data" />

              {/* <label class="mt-3 inline-flex items-center">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5 rounded-sm text-blue-600 focus:ring-0 active:outline-none"
                />
                <span class="ml-2 text-zinc-700">label</span>
              </label> */}

              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <MTextView content="Project" />
                  {<div className="text-sm text-red-600">*</div>}
                </div>
                <div className="w-4/5">
                  <Dropdown
                    options={projectList}
                    placeholder="Project"
                    fluid
                    search
                    selection
                    onChange={(e, data) => {
                      setProject(
                        projects.filter((p) => p._id === data.value)[0]
                      )
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <MTextView content="Equipment Type" />
                  {<div className="text-sm text-red-600">*</div>}
                </div>
                <div className="w-4/5">
                  <Dropdown
                    options={[
                      {
                        key: '1',
                        value: 'Truck',
                        text: 'Trucks',
                      },
                      {
                        key: '2',
                        value: 'Machine',
                        text: 'Machines',
                      },
                    ]}
                    placeholder="Equipment Type"
                    fluid
                    search
                    selection
                    onChange={(e, data) => setEqType(data.value)}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <MTextView content="Job Type" />
                  {<div className="text-sm text-red-600">*</div>}
                </div>
                <div className="w-4/5">
                  <Dropdown
                    options={jobTypeList}
                    placeholder="Select Job type"
                    fluid
                    search
                    selection
                    onChange={(e, data) => setJobType(data.value)}
                  />
                </div>
              </div>

              {(jobType === '62690bbacf45ad62aa6144e6' ||
                jobType === '62690b67cf45ad62aa6144d8') && (
                <TextInput
                  label="Specify Job Type"
                  placeholder="Job type..."
                  setValue={setOtherJobType}
                  type="text"
                  isRequired
                />
              )}

              {eqType === 'Truck' && (
                <>
                  <TextInput
                    label="Site origin"
                    placeholder="From which site?"
                    setValue={setFromSite}
                    type="text"
                  />
                  <TextInput
                    label="Site Destination"
                    placeholder="To which site?"
                    setValue={setToSite}
                    type="text"
                  />
                </>
              )}

              {/* <TextInput isRequired={true} label="Date" placeholder="Day" /> */}

              <TextInput
                label="Target Trips"
                placeholder="8"
                type="number"
                setValue={setTargetTrips}
              />

              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <MTextView content="Date" />
                  <div className="text-sm text-red-600">*</div>
                </div>
                <div className="w-4/5">
                  <DatePicker
                    size={20}
                    onChange={(date, dateString) => {
                      setDispatchDate(dateString)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex w-2/5 flex-col space-y-5">
              <MTitle content="Equipment & Driver data" />
              {[...Array(nJobs)].map((e, i) => (
                <div className="mb-5 flex flex-row space-x-7">
                  <div className="flex w-1/2 flex-row items-center space-x-5">
                    <div className="items-cente flex flex-row">
                      <MTextView content="Equipment" />
                      {<div className="text-sm text-red-600">*</div>}
                    </div>
                    <Dropdown
                      options={equipmentList}
                      placeholder="Select Equipment"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        let selecteObj = _.find(equipments, (e) => {
                          return e._id === data.value
                        })
                        if (!selecteObj) {
                          let _eq = [...selEquipments]
                          _eq[i] = equipmentsOg.filter(
                            (e) => e._id === data.value
                          )[0]

                          setSelEquipments(_eq)
                        } else {
                          toast.error('Already selected!')
                          if (nJobs === 1) {
                          } else {
                            setNJobs(nJobs - 1)
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="flex w-1/2 flex-row items-center space-x-5">
                    <div className="items-cente flex flex-1 flex-row">
                      <MTextView content="Driver" />
                      {<div className="text-sm text-red-600">*</div>}
                    </div>
                    <Dropdown
                      options={driverList}
                      placeholder="Select Driver      "
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        let selectedDr = _.find(drivers, (d) => {
                          return d === data.value
                        })

                        if (!selectedDr) {
                          let _dr = [...drivers]
                          _dr[i] = data.value
                          setDrivers(_dr)
                        } else {
                          toast.error('Already selected!')
                          if (nJobs === 1) {
                          } else {
                            let _e = [...selEquipments]
                            _e.pop()
                            setSelEquipments(_e)
                            setNJobs(nJobs - 1)
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="rounded bg-slate-200 p-5">
                <MTitle content="Assistant Drivers / Turn boys" />
                <div className="flex w-full flex-row justify-between">
                  <div className="flex w-1/2 flex-col space-y-5">
                    {[...Array(nAstDrivers)].map((e, i) => (
                      <div className="flex flex-row items-center space-x-5">
                        <Dropdown
                          options={driverList}
                          placeholder="Select Driver"
                          fluid
                          search
                          selection
                          onChange={(e, data) => {
                            let selectedDr = _.find(astDrivers, (d) => {
                              return d === data.value
                            })

                            if (!selectedDr) {
                              let _dr = [...astDrivers]
                              _dr[i] = data.value
                              setAstDrivers(_dr)
                            } else {
                              toast.error('Already selected!')
                              if (nAstDrivers === 1) {
                              } else {
                                let _astDrivers = [...astDrivers]
                                _astDrivers.pop()
                                setNAstDrivers(nAstDrivers - 1)
                              }
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-row space-x-10">
                    <PlusIcon
                      className="h-5 w-5 cursor-pointer text-teal-600"
                      onClick={() => setNAstDrivers(nAstDrivers + 1)}
                    />
                    <TrashIcon
                      className="h-5 w-5 cursor-pointer text-red-500"
                      onClick={() => {
                        if (nAstDrivers === 1) {
                        } else {
                          setNAstDrivers(nAstDrivers - 1)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row space-x-10">
              <PlusIcon
                className="mt-5 h-5 w-5 cursor-pointer text-teal-600"
                onClick={() => setNJobs(nJobs + 1)}
              />
              <TrashIcon
                className="mt-5 h-5 w-5 cursor-pointer text-red-500"
                onClick={() => {
                  if (nJobs === 1) {
                  } else {
                    setNJobs(nJobs - 1)
                  }
                }}
              />
            </div>
          </div>
          {dispatchDate &&
            project &&
            eqType &&
            jobType &&
            selEquipments.length > 0 &&
            drivers.length > 0 && (
              <div className="mt-5 w-24">
                <MSubmitButton
                  icon={
                    !submitting && (
                      <CheckIcon className="h-5 w-5 text-zinc-800" />
                    )
                  }
                  intent={submitting ? 'disabled' : 'primary'}
                  label={
                    submitting ? <Loader active inline size="tiny" /> : 'Create'
                  }
                  submit={() => submit()}
                  disabled={submitting}
                />
              </div>
            )}
        </div>
      )}

      <ToastContainer />
    </div>
  )
}