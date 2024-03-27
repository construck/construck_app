import React, { useContext, useEffect, useState } from 'react'
import WorkListTable from '../../common/workListTable'
import MSubmitButton from '../../common/mSubmitButton'
import TextInput from '../../common/TextIput'
import MTitle from '../../common/mTitle'
import { Dimmer, Dropdown, Loader } from 'semantic-ui-react'
import MTextView from '../../common/mTextView'
import { toast, ToastContainer } from 'react-toastify'
import _ from 'lodash'
import { UserContext } from '../../../contexts/UserContext'
import { DatePicker, Descriptions, Drawer, Skeleton } from 'antd'
import Modal from '../../common/modal'
// import XlsExport from 'xlsexport'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import TextInputV from '../../common/TextIputV'
import 'datejs'
import moment from 'moment'
import { Card } from '@/components/atoms'
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import Menu from './menu'

const { RangePicker } = DatePicker

export default function Workdata() {
  let { user, setUser } = useContext(UserContext)
  //AUTORIZATION
  let canDispatch = user.userType === 'dispatch' || user.userType === 'admin' || user?.permissions?.canDispatch
  let canStartAndStopJob = user.userType === 'revenue' || user.userType === 'admin' || user?.permissions?.canStartAndStopJob
  let canViewRenues = user.userType === 'revenue' ||
  user.userType === 'admin' ||
  user.userType === 'revenue-admin' || user?.permissions?.canViewRenues
  let canDownloadDispatches =user.userType === 'revenue' ||
  user.userType === 'admin' ||
  user.userType === 'revenue-admin' ||
  user.userType === 'dispatch' ||
  user.userType === 'customer-site-manager' ||
  user.userType === 'customer-project-manager' || user?.permissions?.canDownloadDispatches
  let isVendor = user.userType === 'vendor'

  let [dataSize, setDataSize] = useState(0)

  let [workList, setWorkList] = useState(null)
  let [ogWorkList, setOgWorkList] = useState(null)
  let [projectList, setProjectList] = useState(null)
  let [equipmentList, setEquipmentList] = useState(null)
  let [equipmentFullList, setEquipmentFullList] = useState(null)
  let [equipmentFullLists, setEquipmentFullLists] = useState([])
  let [jobTypeList, setJobTypeList] = useState(null)
  let [jobTypeListTrucks, setJobTypeListTrucks] = useState(null)
  let [jobTypeListMachines, setJobTypeListMachines] = useState(null)
  let [jobTypeListsbyRow, setJobTypeListsbyRow] = useState([])
  let [driverList, setDriverList] = useState([])
  let [lowBedDriverList, seLowBedDriverList] = useState([])
  let [driverLists, setDriverLists] = useState([])
  let [reasonList, setReasonList] = useState(null)
  let [viewPort, setViewPort] = useState('list')
  let [nJobs, setNJobs] = useState(1)
  let [nAstDrivers, setNAstDrivers] = useState(1)
  let [jobList, setJobList] = useState(null)
  let [eqType, setEqType] = useState('')
  let [dayShift, setDayShift] = useState(true)
  let [search, setSearch] = useState('')
  let [dispatchDate, setDispatchDate] = useState(
    moment()
      .utcOffset(0)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toDate()
  )
  let [driver, setDriver] = useState('')
  let [dispatchDates, setDispatchDates] = useState(null)
  let [siteWork, setSiteWork] = useState(false)
  let [lowbedWork, setLowbedWork] = useState(false)
  let [loadingEquipments, setLoadingEquipments] = useState(false)
  let [downloadingData, setDownloadingData] = useState(false)
  let [dailyWork, setDailyWork] = useState([])

  const [openDrawer, setOpenDrawer] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [activityLog, setActivityLog] = useState(null)

  let [projects, setProjects] = useState(null)

  let [project, setProject] = useState('')
  let [fromSite, setFromSite] = useState('')
  let [toSite, setToSite] = useState('')
  let [jobType, setJobType] = useState('')
  let [otherJobType, setOtherJobType] = useState('')
  let [targetTrips, setTargetTrips] = useState(0)
  let [equipments, setEquipments] = useState(null)
  let [selEquipments, setSelEquipments] = useState([])
  let [equipmentsOg, setEquipmentsOg] = useState(null)
  let [equipmentsOgFull, setEquipmentsOgFull] = useState(null)
  let [drivers, setDrivers] = useState([])
  let [astDrivers, setAstDrivers] = useState([[]])
  let [reasonForRejection, setReasonForRejection] = useState('')
  let [moreComment, setMoreComment] = useState('')

  let [fromProjects, setFromProjects] = useState(null)
  let [toProjects, settoProjects] = useState(null)
  let [movementDate, setMovementDate] = useState(Date.now())
  let [lowbedOperator, setLowbedOperator] = useState('')
  let [lowbed, setLowbed] = useState('')
  let [lowbedList, setLowbedList] = useState(null)
  let [ogLowbedList, setOgLowbedList] = useState(null)
  let [nMachinesToMove, setNMachinesToMove] = useState(1)
  let [selJobTypes, setSelJobTypes] = useState([])
  let [selJobTypesOthers, setSelJobTypesOthers] = useState([])
  let [selFromSite, setSelFromSite] = useState([])
  let [selToSite, setSelToSite] = useState([])
  let [selTargetTrips, setSelTargetTrips] = useState([])

  let [selectedWorks, setSelectedWorks] = useState(null)

  let [orderAsc, setOrderAsc] = useState(true)

  let [recallModalIsShown, setRecallModalIsShown] = useState(false)
  let [stopModalIsShown, setStopModalIsShown] = useState(false)
  let [startModalIsShown, setStartModalIsShown] = useState(false)
  let [approveModalIsShown, setApproveModalIsShown] = useState(false)
  let [expandSwModalIsShown, setExpandSwModalIsShown] = useState(false)
  let [rejectModalIsShown, setRejectModalIsShown] = useState(false)
  let [orderModalIsShown, setOrderModalIsShown] = useState(false)
  let [endModalIsShown, setEndModalIsShown] = useState(false)
  let [showReasonField, setShowReasonField] = useState(false)
  let [editModalIsShown, setEditModalIsShown] = useState(false)

  let [row, setRow] = useState()
  let [rowIndex, setRowIndex] = useState()

  let [submitting, setSubmitting] = useState(false)
  let [loadingData, setLoadingData] = useState(false)
  let [startDate, setStartDate] = useState(moment().format('YYYY-MM-01'))
  let [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))

  let [workStartDate, setWorkStartDate] = useState(
    Date.today().clearTime().moveToFirstDayOfMonth()
  )
  let [workEndDate, setWorkEndDate] = useState(
    Date.today().clearTime().moveToFirstDayOfMonth().addHours(23).addMinutes(59)
  )
  let [customer, setCustomer] = useState()
  let [searchProject, setSearchProject] = useState('')
  let [searchDriver, setSearchDriver] = useState('')
  let [owner, setOwner] = useState('All')

  // duration, endIndex, tripsDone, comment

  let [duration, setDuration] = useState(0)
  let [endIndex, setEndIndex] = useState(0)
  let [startIndex, setStartIndex] = useState(0)
  let [tripsDone, setTripsDone] = useState(0)
  let [comment, setComment] = useState(null)

  let [postingDate, setPostingDate] = useState(moment())

  let [pageNumber, setPageNumber] = useState(1)

  let [dataCount, setDataCount] = useState(0)

  const disabledDate = (current) => {
    // Can not select days before today and today
    return (
      current &&
      current < moment().subtract(2, 'months').endOf('month') &&
      user.userType !== 'admin'
    )
  }

  let url = process.env.NEXT_PUBLIC_BKEND_URL
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

  useEffect(() => {
    // refresh()
  }, [])

  useEffect(() => {
    if (duration < 5) setComment(null)
  }, [duration])

  useEffect(() => {
    let targetTrips = parseInt(workList?.rowIndex?.dispatch?.targetTrips)

    if (targetTrips > tripsDone) setShowReasonField(true)
    else setShowReasonField(false)
  }, [tripsDone])

  useEffect(() => {
    setLoadingEquipments(true)
    let dispDate =
      siteWork === true
        ? moment(workStartDate).format('YYYY-MM-DD')
        : dispatchDate

    fetch(`${url}/projects/v2`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
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
      .catch((err) => {
        toast.error(err)
        setLoadingData(false)
      })

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
        setLoadingData(false)
      })

    fetch(
      `${url}/employees/${dispatchDate}/${
        dayShift ? 'dayShift' : 'nightShift'
      }`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp
        let userOptions = list.map((l) => {
          return {
            key: l._id,
            value: l._id,
            text: l.firstName + ' ' + l.lastName,
          }
        })
        setDriverList(userOptions)
        seLowBedDriverList(userOptions)
        let _drLists = [userOptions]
        setDriverLists(_drLists)
      })
      .catch((err) => {})

    fetch(
      `${url}/equipments/${dispatchDate}/${
        dayShift ? 'dayShift' : 'nightShift'
      }`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        setLoadingEquipments(false)
        let list = resp
        // ?.filter((r) => r.eqDescription !== 'LOWBED')
        let listLowbeds = resp?.filter((r) => r.eqDescription === 'LOWBED')

        let equipmentsFullOptions = list
          // .filter((r) => r.eqDescription !== 'LOWBED')
          .map((l) => {
            return {
              key: l._id,
              value: l._id,
              text:
                l.eqOwner === 'Construck'
                  ? l.plateNumber
                  : l.plateNumber + ' - ' + l.eqOwner,
            }
          })

        if (resp && list.length > 0) {
          let equipmentsOptions = listLowbeds.map((l) => {
            return {
              key: l._id,
              value: l._id,
              text: l.plateNumber,
            }
          })

          let lowbedsOptions = listLowbeds
            .filter((r) => r.eqDescription === 'LOWBED')
            .map((l) => {
              return {
                key: l._id,
                value: l._id,
                text: l.plateNumber,
              }
            })
          setLowbedList(lowbedsOptions)
          setOgLowbedList(listLowbeds)
          setEquipmentsOgFull(list)
          setEquipmentFullList(equipmentsFullOptions)
          let _eqLists = [equipmentsFullOptions]
          setEquipmentFullLists(_eqLists)
        } else {
          setLowbedList([])
        }
      })
      .catch((err) => {
        setLoadingEquipments(false)
      })

    fetch(`${url}/jobTypes/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let jobsForTrucks = resp.filter(
          (eq) =>
            eq.eqType === 'Truck' &&
            eq._id !== '62690b97cf45ad62aa6144e2' &&
            eq._id !== '62a70a7197ee8984c1be6c9f'
        )
        let jobsForMachines = resp.filter(
          (eq) =>
            eq.eqType === 'Machine' &&
            eq._id !== '62690b97cf45ad62aa6144e2' &&
            eq._id !== '62a70a7197ee8984c1be6c9f'
        )
        setJobTypeListTrucks(
          jobsForTrucks.map((j) => {
            return {
              key: j._id,
              value: j._id,
              text: j.jobDescription,
            }
          })
        )
        setJobTypeListMachines(
          jobsForMachines.map((j) => {
            return {
              key: j._id,
              value: j._id,
              text: j.jobDescription,
            }
          })
        )
      })
      .catch((err) => {})
    fetch(
      `${url}/equipments/${dispDate}/${dayShift ? 'dayShift' : 'nightShift'}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        setLoadingEquipments(false)
        let list = resp
        // ?.filter((r) => r.eqDescription !== 'LOWBED')
        let listLowbeds = resp?.filter((r) => r.eqDescription === 'LOWBED')

        let equipmentsFullOptions = list
          // .filter((r) => r.eqDescription !== 'LOWBED')
          .map((l) => {
            return {
              key: l._id,
              value: l._id,
              text:
                l.eqOwner === 'Construck'
                  ? l.plateNumber
                  : l.plateNumber + ' - ' + l.eqOwner,
            }
          })

        if (resp && list.length > 0) {
          let equipmentsOptions = listLowbeds.map((l) => {
            return {
              key: l._id,
              value: l._id,
              text: l.plateNumber,
            }
          })

          let lowbedsOptions = listLowbeds
            .filter((r) => r.eqDescription === 'LOWBED')
            .map((l) => {
              return {
                key: l._id,
                value: l._id,
                text: l.plateNumber,
              }
            })
          setLowbedList(lowbedsOptions)
          setOgLowbedList(listLowbeds)
          setEquipmentsOgFull(list)
          setEquipmentFullList(equipmentsFullOptions)
          let _eqLists = [equipmentsFullOptions]
          setEquipmentFullLists(_eqLists)
        } else {
          setLowbedList([])
        }
      })
      .catch((err) => {
        setLoadingEquipments(false)
      })
  }, [viewPort])

  useEffect(() => {
    setLoadingEquipments(true)
    let dispDate = siteWork === true ? workStartDate : dispatchDate
    fetch(
      `${url}/employees/${dispDate}/${dayShift ? 'dayShift' : 'nightShift'}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp
        let userOptions = list.map((l) => {
          return {
            key: l._id,
            value: l._id,
            text: l.firstName + ' ' + l.lastName,
          }
        })
        // userOptions.push({
        //   key: 'NA',
        //   value: 'NA',
        //   text: 'Not applicable',
        // })
        setDriverList(userOptions)
        seLowBedDriverList(userOptions)
        let _drLists = [userOptions]
        setDriverLists(_drLists)
      })
      .catch((err) => {})

    fetch(
      `${url}/equipments/type/${eqType}/${dispDate}/${
        dayShift ? 'dayShift' : 'nightShift'
      }`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp

        if (resp && list.length > 0) {
          let equipmentsOptions = list.map((l) => {
            return {
              key: l._id,
              value: l._id,
              text:
                l.eqOwner === 'Construck'
                  ? l.plateNumber
                  : l.plateNumber + '-' + l.eqOwner,
            }
          })
          setEquipmentList(equipmentsOptions)
          setEquipmentsOg(list)
        } else {
          setEquipmentList([])
        }
      })
      .catch((err) => {})

    fetch(
      `${url}/equipments/${dispDate}/${
        dayShift ? 'dayShift' : 'nightShift'
      }?workStartDate=${workStartDate}&workEndDate=${workEndDate}&siteWork=${siteWork}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        setLoadingEquipments(false)
        let list = resp
        // ?.filter((r) => r.eqDescription !== 'LOWBED')
        let listLowbeds = resp?.filter((r) => r.eqDescription === 'LOWBED')

        let equipmentsFullOptions = list
          // .filter((r) => r.eqDescription !== 'LOWBED')
          .map((l) => {
            return {
              key: l._id,
              value: l._id,
              text:
                l.eqOwner === 'Construck'
                  ? l.plateNumber
                  : l.plateNumber + ' - ' + l.eqOwner,
            }
          })

        if (resp && list.length > 0) {
          let equipmentsOptions = listLowbeds.map((l) => {
            return {
              key: l._id,
              value: l._id,
              text: l.plateNumber,
            }
          })

          let lowbedsOptions = listLowbeds
            .filter((r) => r.eqDescription === 'LOWBED')
            .map((l) => {
              return {
                key: l._id,
                value: l._id,
                text: l.plateNumber,
              }
            })
          setLowbedList(lowbedsOptions)
          setOgLowbedList(listLowbeds)
          setEquipmentsOgFull(list)
          setEquipmentFullList(equipmentsFullOptions)
          let _eqLists = [equipmentsFullOptions]
          setEquipmentFullLists(_eqLists)
        } else {
          setLowbedList([])
        }
      })
      .catch((err) => {
        setLoadingEquipments(false)
      })

    fetch(`${url}/jobtypes/eqType/` + eqType, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
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
            setJobTypeList(
              jobTypeOptions.filter(
                (j) =>
                  j.value !== '62a70a7197ee8984c1be6c9f' &&
                  j.value !== '62690b97cf45ad62aa6144e2'
              )
            )
          }
        }
      })
      .catch((err) => {})
  }, [eqType, dispatchDate, dayShift, workStartDate, siteWork, workEndDate])

  // useEffect(() => {
  //   if (workList && workList?.length >= 1) {
  //     if (search.length >= 3) {
  //       setLoadingData(true)

  //       let _workList = ogWorkList.filter((w) => {
  //         let _search = search?.toLocaleLowerCase()
  //         let desc = w?.project?.prjDescription?.toLocaleLowerCase()
  //         let plateNumber = w?.equipment?.plateNumber?.toLocaleLowerCase()
  //         let customer = w?.project?.customer?.toLocaleLowerCase()
  //         let equipmentType = w?.equipment?.eqDescription?.toLocaleLowerCase()
  //         let driver =
  //           w?.driver?.firstName?.toLocaleLowerCase() +
  //           w?.driver?.lastName?.toLocaleLowerCase()
  //         let _owner = w?.equipment?.eqOwner.toLocaleLowerCase()

  //         if (!driver) driver = _owner
  //         return (
  //           desc?.includes(_search) ||
  //           plateNumber?.includes(_search) ||
  //           customer?.includes(_search) ||
  //           equipmentType?.includes(_search) ||
  //           driver?.includes(_search)
  //         )
  //       })

  //       if (owner === 'All') {
  //         setWorkList(_workList)
  //         setLoadingData(false)
  //       } else {
  //         let _wList = _workList.filter((w) => {
  //           return owner === 'Construck'
  //             ? w?.equipment.eqOwner === 'Construck'
  //             : w?.equipment.eqOwner !== 'Construck'
  //         })
  //         _workList = _wList
  //       }

  //       if (startDate && endDate && workList && ogWorkList) {
  //         _workList = _workList?.filter((w) => {

  //           if (w?.siteWork === false) {
  //             return (
  //               moment(Date.parse(w?.dispatch?.date)).isSameOrAfter(
  //                 moment(Date.parse(startDate))
  //               ) &&
  //               moment(Date.parse(w?.dispatch?.date)).isSameOrBefore(
  //                 moment(Date.parse(endDate))
  //               )
  //             )
  //           } else {
  //             return (
  //               moment(Date.parse(w?.workStartDate)).isSameOrBefore(
  //                 moment(Date.parse(endDate))
  //               ) &&
  //               moment(Date.parse(w?.workEndDate)).isSameOrAfter(
  //                 moment(Date.parse(startDate))
  //               )
  //             )
  //           }
  //         })
  //       } else {
  //       }

  //       setWorkList(_workList)
  //       setLoadingData(false)
  //     } else {
  //       let _wList = []
  //       if (owner === 'All') {
  //         _wList = ogWorkList
  //         setLoadingData(false)
  //       } else {
  //         _wList = ogWorkList.filter((w) => {
  //           return owner === 'Construck'
  //             ? w?.equipment.eqOwner === 'Construck'
  //             : w?.equipment.eqOwner !== 'Construck'
  //         })
  //       }

  //       if (startDate && endDate) {
  //         _wList = _wList?.filter((w) => {

  //           if (w?.siteWork === false) {
  //             return (
  //               moment(Date.parse(w?.dispatch?.date)).isSameOrAfter(
  //                 moment(Date.parse(startDate))
  //               ) &&
  //               moment(Date.parse(w?.dispatch?.date)).isSameOrBefore(
  //                 moment(Date.parse(endDate))
  //               )
  //             )
  //           } else {
  //             return (
  //               moment(Date.parse(w?.workStartDate)).isSameOrBefore(
  //                 moment(Date.parse(endDate))
  //               ) &&
  //               moment(Date.parse(w?.workEndDate)).isSameOrAfter(
  //                 moment(Date.parse(startDate))
  //               )
  //             )
  //           }
  //         })
  //       } else {
  //       }

  //       setWorkList(_wList)
  //     }
  //   }

  //   // if (search.length < 3 && searchDriver.length < 3 && owner !== 'All') {
  //   //   setWorkList(ogWorkList)
  //   //   setLoadingData(false)
  //   // }
  // }, [search, owner, startDate, endDate])

  // useEffect(() => {
  //   let list = []
  //   if (startDate && endDate) {
  //     if (search.length >= 1) {
  //       list = workList
  //     } else {
  //       list = ogWorkList
  //     }
  //     let _workList = list?.filter((w) => {
  //       // return (
  //       //   Date.parse(startDate) >= Date.parse(w?.workStartDate) &&
  //       //   Date.parse(endDate).addHours(23).addMinutes(59) <=
  //       //     Date.parse(w?.workEndDate)
  //       // )

  //       return (
  //         moment(Date.parse(w?.workStartDate)).isSameOrAfter(
  //           moment(Date.parse(startDate))
  //         ) &&
  //         moment(Date.parse(w?.workEndDate)).isSameOrBefore(
  //           moment(Date.parse(endDate))
  //         )
  //       )
  //     })
  //     setWorkList(_workList)
  //     setLoadingData(false)
  //   } else {
  //     if (search.length >= 1) {
  //       list = workList
  //     } else {
  //       list = ogWorkList
  //     }
  //     setWorkList(list)
  //   }
  // }, [startDate, endDate])

  useEffect(() => {
    workList &&
      setShowReasonField(
        tripsDone < workList[rowIndex]?.dispatch?.targetTrips ||
          (workList[rowIndex]?.equipment?.uom === 'hour' && duration < 5)
      )
  }, [duration])

  useEffect(() => {
    getData(false)
  }, [pageNumber])

  useEffect(() => {
    setLoadingActivity(true)
    if (viewRow?.length > 12)
      fetch(`${url}/logs/filtered?workId=${viewRow}`, {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setActivityLog(res)
        })
        .finally(() => {
          setLoadingActivity(false)
        })
  }, [viewRow])

  function refresh() {
    setSearch('')
    setSiteWork(false)
    setLowbedWork(false)
    setLoadingData(true)
    setDispatchDate(
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toDate()
    )
    setWorkStartDate(Date.today().clearTime().moveToFirstDayOfMonth())
    setWorkEndDate(Date.today().clearTime().moveToLastDayOfMonth())
    // !isVendor &&
    fetch(
      `${url}/works/filtered/${pageNumber}?userProject=${
        user?.assignedProjects[0] && user?.assignedProjects[0]?.prjDescription
      }&userType=${user.userType}&companyName=${
        user?.company?.name
      }&&startDate=${startDate}&endDate=${endDate}&project=${encodeURIComponent(
        searchProject
      )}&isVendor=${isVendor}&vendorName=${encodeURIComponent(
        user?.firstName
      )}&userProjects=${JSON.stringify(user?.assignedProjects)}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        let dataList = resp.workList
        setDataCount(resp.dataCount)
        let data = !isVendor
          ? dataList
          : dataList.filter((p) => p.equipment?.eqOwner === user.firstName)

        let _workList = data

        // ?.filter((w) => {
        //   return (
        //     Date.parse(startDate) <= Date.parse(w?.dispatch?.date) &&
        //     Date.parse(endDate).addHours(23).addMinutes(59) >=
        //       Date.parse(w?.dispatch?.date)
        //   )
        // })
        setWorkList(_workList)
        setOgWorkList(data)

        setEquipments([])
        setEquipmentList([])
        setDrivers([])
        setNJobs(1)
        setNMachinesToMove(1)
        setSelEquipments([])
        setSelJobTypes([])
        setFromProjects([])
        settoProjects([])
        setTargetTrips(0)
        setEqType('')
        setLoadingData(false)
        setSubmitting(false)
        setComment(null)
        setPostingDate(moment())
        setAstDrivers([])
      })
      .catch((err) => {
        toast.error(err)
        setLoadingData(false)
        setSubmitting(false)
      })
  }

  function approve() {
    let _workList = workList ? [...workList] : []
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    setSubmitting(true)
    fetch(`${url}/works/approve/${row._id}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        approvedBy: user._id,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        refresh()
      })
      .catch((err) => setSubmitting(false))
  }

  function approveDailyWork(dailyWork, index) {
    dailyWork.toConfirm = true
    dailyWork.toBeApproved = true
    let _row = { ...row }
    _row.dailyWork.filter((d) => {
      return d.pending === false
    })[index] = dailyWork
    setRow(_row)
    setRowIndex(parseInt(index))
    // setExpandSwModalIsShown(false)
  }

  function confirmApproveDailyWork(dailyWork, index) {
    // approveDailyWork/:id

    dailyWork.status = 'confirming'
    dailyWork.toConfirm = null
    dailyWork.toBeApproved = null
    dailyWork.toBeRejected = null
    let _row = { ...row }

    _row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex] = dailyWork
    setRow(_row)

    let pDate = row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex]['date']

    let approvedRevenue = row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex]['totalRevenue']

    let approvedExpenditure = row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex]['totalRevenue']

    let approvedDuration = row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex]['duration']

    fetch(`${url}/works/approveDailyWork/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        postingDate: pDate,
        approvedBy: user._id,
        approvedRevenue,
        approvedDuration,
        approvedExpenditure,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        dailyWork.status = 'approved'

        let _row = { ...row }

        _row.dailyWork.filter((d) => {
          return d.pending === false
        })[rowIndex] = dailyWork
        setRow(_row)
      })
      .catch((err) => {})
  }

  function rejectDailyWork(dailyWork, index) {
    dailyWork.toConfirm = true
    dailyWork.toBeRejected = true
    let _row = { ...row }

    setReasonForRejection('')

    _row.dailyWork.filter((d) => {
      return d.pending === false
    })[index] = dailyWork
    setRow(_row)
    setRowIndex(parseInt(index))
    // setExpandSwModalIsShown(false)
  }

  function confirmRejectDailyWork(dailyWork, index) {
    // approveDailyWork/:id

    dailyWork.status = 'confirming'
    dailyWork.toConfirm = null
    dailyWork.toBeApproved = null
    dailyWork.toBeRejected = null
    let _row = { ...row }

    _row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex] = dailyWork
    setRow(_row)

    let pDate = row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex]['date']

    let rejectedRevenue = row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex]['totalRevenue']

    let rejectedExpenditure = row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex]['totalRevenue']

    let rejectedDuration = row.dailyWork.filter((d) => {
      return d.pending === false
    })[rowIndex]['duration']

    fetch(`${url}/works/rejectDailyWork/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        postingDate: pDate,
        rejectedBy: user._id,
        rejectedRevenue,
        rejectedDuration,
        rejectedExpenditure,
        reason: reasonForRejection,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        dailyWork.status = 'rejected'

        let _row = { ...row }

        _row.dailyWork.filter((d) => {
          return d.pending === false
        })[rowIndex] = dailyWork
        setRow(_row)

        //Send email
        fetch(`${url}/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
          },
          body: JSON.stringify({
            workPayload: {
              equipment: row.equipment,
              project: row.project,
              postingDate: dailyWork.date,
              reasonForRejection,
            },
            from: 'appinfo@construck.rw',
            to: 'bhigiro@cvl.co.rw',
            subject: 'Work rejected',
            messageType: 'workRejected',
          }),
        })
          .then((res) => res.json())
          .then((res) => {})
          .catch((err) => console.log(err))
      })
      .catch((err) => {})
  }

  function discardDailyWork(dailyWork, index) {
    dailyWork.toConfirm = null
    dailyWork.toBeApproved = null
    dailyWork.toBeRejected = null
    let _row = { ...row }

    _row.dailyWork.filter((d) => {
      return d.pending === false
    })[index] = dailyWork
    setRow(_row)
    setRowIndex(parseInt(index))
    // setExpandSwModalIsShown(false)
  }
  // useEffect(() => {
  //   setExpandSwModalIsShown(true)
  //   setRow(row)
  // }, [row])

  function bulkApprove() {
    setLoadingData(true)
    let promises = []
    selectedWorks.forEach((s) => {
      let p = fetch(`${url}/works/approve/${s}`, {
        method: 'PUT',
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          approvedBy: user._id,
        }),
      })
      promises.push(p)
    })

    Promise.all(promises)
      .then((r) => {
        refresh()
      })
      .catch((err) => {})
  }

  function bulkApproveDailyWorks() {
    setLoadingData(true)
    let promises = []
  }

  function _setRecallRow(row, index, pageStartIndex) {
    setRow(row)
    setRowIndex(parseInt(index) + parseInt(pageStartIndex))
    setRecallModalIsShown(true)
  }

  function _setStopRow(row, index, pageStartIndex) {
    setRow(row)
    setRowIndex(parseInt(index) + parseInt(pageStartIndex))
    setStopModalIsShown(true)
  }

  function _setEndRow(row, index, pageStartIndex) {
    setRow(row)
    setRowIndex(parseInt(index) + parseInt(pageStartIndex))
    setEndModalIsShown(true)
  }

  function _setEditRow(row, index, pageStartIndex) {
    setRow(row)
    setRowIndex(parseInt(index) + parseInt(pageStartIndex))
    setViewPort('edit')
    setSiteWork(row?.siteWork)
    setDayShift(row?.dispatch?.shift === 'dayShift')
    setWorkStartDate(moment(row?.workStartDate))
    setWorkEndDate(moment(row?.workEndDate))
    setDriver(row?.driver?._id)
    setJobType(row?.workDone?._id)
    setDrivers(row?.dispatch?.drivers)
    setAstDrivers(row?.dispatch?.astDriver)
    setSelEquipments([row?.equipment])
    setDuration(row?.duration)
    setDailyWork(row?.dailyWork)
    setTripsDone(row?.tripsDone)
    setProject(row?.project)
    setEquipments([
      {
        key: row?.equipment?._id,
        value: row?.equipment?._id,
        text: row?.equipment?.plateNumber,
      },
    ])

    // if(row?.eqType === 'Truck') setJobTypeListsbyRow(jobTypeListTrucks)
    // else setJobTypeListsbyRow(jobTypeListMachines)
  }

  function _setStartRow(row, index, pageStartIndex) {
    setRow(row)
    setRowIndex(parseInt(index) + parseInt(pageStartIndex))
    setStartModalIsShown(true)
  }

  function _setApproveRow(row, index, pageStartIndex) {
    setRow(row)
    setRowIndex(parseInt(index) + parseInt(pageStartIndex))
    setApproveModalIsShown(true)
  }

  function _setExpandSWRow(row, index, pageStartIndex) {
    setRow(row)
    setRowIndex(parseInt(index) + parseInt(pageStartIndex))
    setExpandSwModalIsShown(true)
  }

  function _setRejectRow(row, index, pageStartIndex) {
    setRow(row)
    setRowIndex(parseInt(index) + parseInt(pageStartIndex))
    setRejectModalIsShown(true)
  }

  function _setOrderRow(row) {
    setRow(row)
    setOrderModalIsShown(true)
  }

  function _setSelTargetTrips(value) {}

  function recall() {
    let _workList = workList ? [...workList] : []
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    setSubmitting(true)
    fetch(`${url}/works/recall/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        recalledBy: user._id,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        getData(false)
      })
      .catch((err) => setSubmitting(false))
  }

  function stop() {
    let _workList = workList ? [...workList] : []
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    setSubmitting(true)

    // duration, endIndex, tripsDone, comment
    fetch(`${url}/works/stop/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        duration,
        endIndex,
        tripsDone,
        comment,
        moreComment,
        stoppedBy: user._id,
        postingDate,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        getData(false)
      })
      .catch((err) => setSubmitting(false))
  }

  function end() {
    let _workList = workList ? [...workList] : []
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    setSubmitting(true)

    // duration, endIndex, tripsDone, comment
    fetch(`${url}/works/end/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        duration,
        endIndex,
        tripsDone,
        comment,
        stoppedBy: user._id,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        getData(false)
      })
      .catch((err) => setSubmitting(false))
  }

  function start() {
    let _workList = workList ? [...workList] : []
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    setSubmitting(true)

    // duration, endIndex, tripsDone, comment
    fetch(`${url}/works/start/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startIndex,
        startedBy: user._id,
        postingDate,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        getData(false)
      })
      .catch((err) => setSubmitting(false))
  }

  function reject() {
    let _workList = workList ? [...workList] : []
    _workList[rowIndex].status = 'updating'
    setWorkList(_workList)
    setSubmitting(true)
    fetch(`${url}/works/reject/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        reasonForRejection,
        rejectedBy: user._id,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        getData(false)
      })
      .catch((err) => setSubmitting(false))
  }

  function select(row) {
    let _workList = workList ? [...workList] : []
    let _r = _workList.filter((r) => r._id === row._id)[0]
    _r.selected = true

    let _selectedWorks = selectedWorks ? [...selectedWorks] : []
    _selectedWorks.push(row._id)
    setSelectedWorks(_selectedWorks)

    setWorkList(_workList)
  }

  function deselect(row) {
    let _workList = workList ? [...workList] : []
    let _r = _workList.filter((r) => r._id === row._id)[0]
    _r.selected = false

    let _selectedWorks = selectedWorks
    let _newSelected = _selectedWorks.filter((s) => s !== row._id)
    setSelectedWorks(_newSelected)

    setWorkList(_workList)
  }

  function _setReason(value) {
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
        setSubmitting(true)
        let posted = 0
        let promises = []
        for (let i = 0; i < selEquipments.length; i++) {
          if (lowbedWork) {
            promises.push(
              fetch(`${url}/works`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
                },
                body: JSON.stringify({
                  project: toProjects[i],
                  equipment: selEquipments[i],
                  workDone: selJobTypes[i],
                  driver: drivers[i],
                  startTime: Date.now(),
                  status: 'created',
                  createdOn: Date.now(),
                  siteWork:
                    moment(dispatchDates[i][1]).diff(
                      moment(dispatchDates[i][0])
                    ) > 1
                      ? true
                      : false,
                  workStartDate: new Date(dispatchDates[i][0]),
                  workEndDate: new Date(dispatchDates[i][1]),
                  workDurationDays:
                    moment(dispatchDates[i][1]).diff(
                      moment(dispatchDates[i][0]),
                      'days'
                    ) + 1,
                  dispatch: {
                    otherJobType: otherJobType ? otherJobType : '',
                    project: toProjects[i],
                    fromSite,
                    toSite,
                    targetTrips: selTargetTrips[i],
                    equipments: selEquipments,
                    drivers,
                    astDrivers: astDrivers ? astDrivers : [],
                    jobType: selJobTypes[i],
                    shift: dayShift ? 'dayShift' : 'nightShift',
                    createdOn: new Date().toISOString(),
                    date: dispatchDates
                      ? new Date(dispatchDates[i][0])
                      : new Date().toISOString(),
                  },
                  createdBy: user._id,
                }),
              })
            )
          }

          if (!lowbedWork) {
            promises.push(
              fetch(`${url}/works`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
                },
                body: JSON.stringify({
                  project,
                  equipment: selEquipments[i],
                  workDone: selJobTypes[i],
                  driver: drivers[i],
                  startTime: Date.now(),
                  status: 'created',
                  createdOn: Date.now(),
                  siteWork,
                  workStartDate: siteWork
                    ? workStartDate
                    : dispatchDates
                    ? new Date(dispatchDates[i][0])
                    : dispatchDate,
                  workEndDate: siteWork
                    ? workEndDate
                    : dispatchDates
                    ? new Date(dispatchDates[i][0])
                    : dispatchDate,
                  workDurationDays: siteWork
                    ? moment(workEndDate).diff(moment(workStartDate), 'days') +
                      1
                    : 1,
                  dispatch: {
                    otherJobType: selJobTypesOthers[i]
                      ? selJobTypesOthers[i]
                      : '',
                    project,
                    fromSite: selFromSite[i],
                    toSite: selToSite[i],
                    targetTrips: selTargetTrips[i],
                    equipments: selEquipments[i],
                    drivers,
                    astDriver: astDrivers[i],
                    jobType: selJobTypes[i],
                    shift: dayShift ? 'dayShift' : 'nightShift',
                    createdOn: new Date().toISOString(),
                    date: new Date(dispatchDate),
                  },
                  createdBy: user._id,
                }),
              })
            )
          }
        }

        if (lowbedWork) {
          await fetch(`${url}/works`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
            body: JSON.stringify({
              project: toProjects[0],
              equipment: lowbed[0],
              workDone: '62690b97cf45ad62aa6144e2',
              driver:
                lowbed[0]?.eqOwner === 'Construck' ? lowbedOperator : null,
              startTime: Date.now(),
              status: 'created',
              createdOn: Date.now(),
              siteWork,
              workStartDate: dispatchDate,
              workEndDate: dispatchDate,
              workDurationDays:
                moment(workEndDate).diff(moment(workStartDate), 'days') + 1,
              dispatch: {
                otherJobType: otherJobType ? otherJobType : '',
                project: toProjects[0],
                fromSite: fromProjects[0],
                toSite: toProjects[0],
                targetTrips,
                equipments: lowbed,
                drivers: [],
                astDrivers: [],
                jobType: '62690b97cf45ad62aa6144e2',
                shift: dayShift ? 'dayShift' : 'nightShift',
                createdOn: new Date().toISOString(),
                date: new Date(movementDate),
              },
              createdBy: user._id,
            }),
          }).then(async (res) => {
            await Promise.all(promises).then(() => {
              setSubmitting(false)
              refresh()
              setViewPort('list')
            })
          })
        } else {
          await Promise.all(promises).then(() => {
            setSubmitting(false)
            refresh()
            setViewPort('list')
          })
        }
      } else {
        refresh()
        setSubmitting(false)
      }
    }
  }

  async function update() {
    if (eqType === 'Truck' && (targetTrips == 0 || !targetTrips)) {
      toast.error('Target trips are mandatory for this entry!')
    } else {
      if (selEquipments.length <= drivers.length) {
        setSubmitting(true)
        let posted = 0
        let promises = []
        for (let i = 0; i < selEquipments.length; i++) {
          if (lowbedWork) {
            promises.push(
              fetch(`${url}/works/${row?._id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
                },
                body: JSON.stringify({
                  project: toProjects[i],
                  equipment: selEquipments[i],
                  workDone: selJobTypes[i],
                  driver: drivers[i],
                  startTime: Date.now(),
                  status: 'created',
                  createdOn: Date.now(),
                  siteWork:
                    moment(dispatchDates[i][1]).diff(
                      moment(dispatchDates[i][0])
                    ) > 1
                      ? true
                      : false,
                  workStartDate:
                    row?.dispatch?.date || new Date(dispatchDates[i][0]),
                  workEndDate: new Date(dispatchDates[i][1]),
                  workDurationDays:
                    moment(dispatchDates[i][1]).diff(
                      moment(dispatchDates[i][0]),
                      'days'
                    ) + 1,
                  dispatch: {
                    otherJobType: otherJobType ? otherJobType : '',
                    project: toProjects[i],
                    fromSite,
                    toSite,
                    targetTrips: selTargetTrips[i],
                    equipments: selEquipments,
                    drivers,
                    astDriver: astDrivers ? astDrivers : [],
                    jobType: selJobTypes[i],
                    shift: dayShift ? 'dayShift' : 'nightShift',
                    createdOn: new Date().toISOString(),
                    date:
                      row?.dispatch?.date ||
                      (dispatchDates
                        ? new Date(dispatchDates[i][0])
                        : new Date().toISOString()),
                  },
                  createdBy: user._id,
                  duration: row?.duration,
                  dailyWork: row?.dailyWork,
                  tripsDone: row?.tripsDone,
                  totalRevenue: row?.totalRevenue,
                  totalExpenditure: row?.totalExpenditure,
                  projectedRevenue: row?.projectedRevenue,
                  startIndex: row?.startIndex,
                  endIndex: row?.endIndex,
                  status: row?.status,
                }),
              })
            )
          }

          if (!lowbedWork) {
            promises.push(
              fetch(`${url}/works/${row?._id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
                },
                body: JSON.stringify({
                  project,
                  equipment: selEquipments[i],
                  workDone: selJobTypes[i],
                  driver: drivers[i] !== 'N/A' ? drivers[i] : driver,
                  startTime: Date.now(),
                  status: 'created',
                  createdOn: Date.now(),
                  siteWork,
                  workStartDate: siteWork
                    ? workStartDate
                    : dispatchDates
                    ? new Date(dispatchDates[i][0])
                    : row?.dispatch?.date || dispatchDate,
                  workEndDate: siteWork
                    ? workEndDate
                    : dispatchDates
                    ? new Date(dispatchDates[i][0])
                    : row?.dispatch?.date || dispatchDate,
                  workDurationDays: siteWork
                    ? moment(workEndDate).diff(moment(workStartDate), 'days') +
                      1
                    : 1,
                  dispatch: {
                    otherJobType: selJobTypesOthers[i]
                      ? selJobTypesOthers[i]
                      : '',
                    project,
                    fromSite: selFromSite[i],
                    toSite: selToSite[i],
                    targetTrips: selTargetTrips[i],
                    equipments: selEquipments[i],
                    drivers,
                    astDriver: astDrivers,
                    jobType: selJobTypes[i],
                    shift: dayShift ? 'dayShift' : 'nightShift',
                    createdOn: new Date().toISOString(),
                    date: row?.dispatch?.date || new Date(dispatchDate),
                  },
                  createdBy: user._id,
                  duration: row?.duration,
                  dailyWork: row?.dailyWork,
                  tripsDone: row?.tripsDone,
                  totalRevenue: row?.totalRevenue,
                  totalExpenditure: row?.totalExpenditure,
                  projectedRevenue: row?.projectedRevenue,
                  startIndex: row?.startIndex,
                  endIndex: row?.endIndex,
                  status: row?.status,
                }),
              })
            )
          }
        }

        if (lowbedWork) {
          await fetch(`${url}/works/${row?._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
            body: JSON.stringify({
              project: toProjects[0],
              equipment: lowbed[0],
              workDone: '62690b97cf45ad62aa6144e2',
              driver:
                lowbed[0]?.eqOwner === 'Construck' ? lowbedOperator : null,
              startTime: Date.now(),
              status: 'created',
              createdOn: Date.now(),
              siteWork,
              workStartDate: dispatchDate,
              workEndDate: dispatchDate,
              workDurationDays:
                moment(workEndDate).diff(moment(workStartDate), 'days') + 1,
              dispatch: {
                otherJobType: otherJobType ? otherJobType : '',
                project: toProjects[0],
                fromSite: fromProjects[0],
                toSite: toProjects[0],
                targetTrips,
                equipments: lowbed,
                drivers: [],
                astDrivers: [],
                jobType: '62690b97cf45ad62aa6144e2',
                shift: dayShift ? 'dayShift' : 'nightShift',
                createdOn: new Date().toISOString(),
                date: new Date(movementDate),
              },
              createdBy: user._id,
            }),
          }).then(async (res) => {
            await Promise.all(promises).then(() => {
              setSubmitting(false)
              refresh()
              setViewPort('list')
            })
          })
        } else {
          await Promise.all(promises).then(() => {
            setSubmitting(false)
            refresh()
            setViewPort('list')
          })
        }
      } else {
        setSubmitting(false)
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

  function __download() {
    let _siteWorkDetails = workList
      .filter((w) => w.siteWork && w.dailyWork?.length >= 1)
      .map((w) => {
        return w?.dailyWork?.map((d) => {
          if (canViewRenues) {
            return {
              'Dispatch date': Date.parse(d.date)?.toString('d-MMM-yyyy'),
              'Dispatch Shift': w.dispatch?.shift?.toLocaleUpperCase(),
              'Site work': w.siteWork ? 'YES' : 'NO',
              'Project Description': w.project.prjDescription,
              'Equipment-PlateNumber': w.equipment?.plateNumber,
              'Equipment Type': w.equipment?.eqDescription,
              Rate: w.equipment?.rate,
              'Unit of measurement': w.equipment?.uom,
              'Duration (HRS)':
                w.equipment?.uom === 'hour' ? msToTime(w.duration) : 0,
              'Duration (DAYS)':
                w.equipment?.uom === 'day'
                  ? Math.round(w.duration * 100) / 100
                  : 0,
              'Work done': w?.workDone?.jobDescription,
              'Other work description': w.dispatch?.otherJobType,
              'Projected Revenue': w?.projectedRevenue,
              'Actual Revenue': d.totalRevenue,
              'Vendor payment': d.totalExpenditure,
              'Driver Names': w.driver
                ? w.driver.firstName + ' ' + w.driver.lastName
                : w.equipment?.eqOwner,
              'Driver contacts': w.driver?.phone,
              'Target trips': w.dispatch?.targetTrips,
              'Trips done': w.tripsDone,
              Reason: d.comment,
              "Driver's/Operator's more Comment": d.moreComment,
              Customer: w.project?.customer,
              Status: w.status,
            }
          } else if (isVendor) {
            return {
              'Dispatch date': Date.parse(d.date)?.toString('d-MMM-yyyy'),
              'Dispatch Shift': w.dispatch?.shift?.toLocaleUpperCase(),
              'Site work': w.siteWork ? 'YES' : 'NO',
              'Project Description': w.project.prjDescription,
              'Equipment-PlateNumber': w.equipment?.plateNumber,
              'Equipment Type': w.equipment?.eqDescription,
              Rate: w.equipment?.supplierRate,
              'Unit of measurement': w.equipment?.uom,
              'Duration (HRS)':
                w.equipment?.uom === 'hour' ? msToTime(w.duration) : 0,
              'Duration (DAYS)':
                w.equipment?.uom === 'day'
                  ? Math.round(w.duration * 100) / 100
                  : 0,
              'Work done': w?.workDone?.jobDescription,
              'Other work description': w.dispatch?.otherJobType,
              'Revenue from CTK': d.totalExpenditure,
              'Driver Names': w.driver
                ? w?.driver?.firstName + ' ' + w?.driver?.lastName
                : w.equipment?.eqOwner,
              'Driver contacts': w.driver?.phone,
              'Target trips': w.dispatch?.targetTrips,
              'Trips done': w?.tripsDone,
              Reason: d.comment,
              "Driver's/Operator's more Comment": d.moreComment,
              Customer: w.project?.customer,
              Status: w.status,
            }
          } else {
            return {
              'Dispatch date': Date.parse(d.date)?.toString('d-MMM-yyyy'),
              'Dispatch Shift': w.dispatch?.shift?.toLocaleUpperCase(),
              'Site work': w.siteWork ? 'YES' : 'NO',
              'Project Description': w.project.prjDescription,
              'Equipment-PlateNumber': w.equipment?.plateNumber,
              'Equipment Type': w.equipment?.eqDescription,
              'Duration (HRS)':
                w.equipment?.uom === 'hour' ? msToTime(w.duration) : 0,
              'Duration (DAYS)':
                w.equipment?.uom === 'day'
                  ? Math.round(w.duration * 100) / 100
                  : 0,
              'Work done': w?.workDone?.jobDescription,
              'Other work description': w.dispatch?.otherJobType,
              'Driver Names': w.driver
                ? w?.driver?.firstName + ' ' + w?.driver?.lastName
                : w.equipment?.eqOwner,
              'Driver contacts': w.driver?.phone,
              'Target trips': w.dispatch?.targetTrips,
              'Trips done': w?.tripsDone,
              Reason: d.comment,
              "Driver's/Operator's more Comment": d.moreComment,
              Customer: w.project?.customer,
              Status: w.status,
            }
          }
        })
      })

    let _workList = workList.map((w) => {
      {
        if (canViewRenues) {
          return {
            'Dispatch date': Date.parse(w.dispatch?.date),
            'Dispatch Shift': w.dispatch?.shift?.toLocaleUpperCase(),
            'Site work': w.siteWork ? 'YES' : 'NO',
            'Project Description': w.project.prjDescription,
            'Equipment-PlateNumber': w.equipment?.plateNumber,
            'Equipment Type': w.equipment?.eqDescription,
            Rate: w.equipment?.rate,
            'Unit of measurement': w.equipment?.uom,
            'Duration (HRS)':
              w.equipment?.uom === 'hour' ? msToTime(w.duration) : 0,
            'Duration (DAYS)':
              w.equipment?.uom === 'day'
                ? Math.round(w.duration * 100) / 100
                : 0,
            'Work done': w?.workDone?.jobDescription,
            'Other work description': w.dispatch?.otherJobType,
            'Projected Revenue': w?.projectedRevenue,
            'Actual Revenue': w.totalRevenue,
            'Vendor payment': w.totalExpenditure,
            'Driver Names': w.driver
              ? w.driver.firstName + ' ' + w.driver.lastName
              : w.equipment?.eqOwner,
            'Driver contacts': w.driver?.phone,
            'Target trips': w.dispatch?.targetTrips,
            'Trips done': w.tripsDone,
            "Driver's/Operator's Comment": w.comment,
            Customer: w.project?.customer,
            Status: w.status,
          }
        } else if (isVendor) {
          return {
            'Dispatch date': Date.parse(w.dispatch?.date),
            'Dispatch Shift': w.dispatch?.shift?.toLocaleUpperCase(),
            'Site work': w.siteWork ? 'YES' : 'NO',
            'Project Description': w.project.prjDescription,
            'Equipment-PlateNumber': w.equipment?.plateNumber,
            'Equipment Type': w.equipment?.eqDescription,
            Rate: w.equipment?.supplierRate,
            'Unit of measurement': w.equipment?.uom,
            'Duration (HRS)':
              w.equipment?.uom === 'hour' ? msToTime(w.duration) : 0,
            'Duration (DAYS)':
              w.equipment?.uom === 'day'
                ? Math.round(w.duration * 100) / 100
                : 0,
            'Work done': w?.workDone?.jobDescription,
            'Other work description': w.dispatch?.otherJobType,
            'Revenue from CTK': w.totalExpenditure,
            'Driver Names': w.driver
              ? w?.driver?.firstName + ' ' + w?.driver?.lastName
              : w.equipment?.eqOwner,
            'Driver contacts': w.driver?.phone,
            'Target trips': w.dispatch?.targetTrips,
            'Trips done': w?.tripsDone,
            "Driver's/Operator's Comment": w.comment,
            Customer: w.project?.customer,
            Status: w.status,
          }
        } else {
          return {
            'Dispatch date': Date.parse(w.dispatch?.date),
            'Dispatch Shift': w.dispatch?.shift?.toLocaleUpperCase(),
            'Site work': w.siteWork ? 'YES' : 'NO',
            'Project Description': w.project.prjDescription,
            'Equipment-PlateNumber': w.equipment?.plateNumber,
            'Equipment Type': w.equipment?.eqDescription,
            'Duration (HRS)':
              w.equipment?.uom === 'hour' ? msToTime(w.duration) : 0,
            'Duration (DAYS)':
              w.equipment?.uom === 'day'
                ? Math.round(w.duration * 100) / 100
                : 0,
            'Work done': w?.workDone?.jobDescription,
            'Other work description': w.dispatch?.otherJobType,
            'Driver Names': w.driver
              ? w?.driver?.firstName + ' ' + w?.driver?.lastName
              : w.equipment?.eqOwner,
            'Driver contacts': w.driver?.phone,
            'Target trips': w.dispatch?.targetTrips,
            'Trips done': w?.tripsDone,
            "Driver's/Operator's Comment": w.comment,
            Customer: w.project?.customer,
            Status: w.status,
          }
        }
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

    exportToCSV(
      _workList,
      `Dispatch report ${moment().format('DD-MMM-YYYY HH:mm:ss')}`
    )
    // exportToCSV(
    //   _siteWorkDetails,
    //   `Detailed Site works ${moment().format('DD-MMM-YYYY HH-mm-ss')}`
    // )
  }

  function download() {
    setDownloadingData(true)
    fetch(
      `${url}/works/detailed/${canViewRenues}?userType=${
        user.userType
      }&companyName=${
        user.company?.name
      }&&startDate=${startDate}&endDate=${endDate}&searchText=${search}&project=${encodeURIComponent(
        searchProject
      )}&isVendor=${isVendor}&vendorName=${encodeURIComponent(
        user.firstName
      )}&userProject=${
        user?.assignedProjects?.length > 1 &&
        user?.assignedProjects[0]?.prjDescription
      }&userProjects=${JSON.stringify(user?.assignedProjects)}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        let data = res.map((r) => {
          r['Dispatch date'] = Date.parse(r['Dispatch date'])
          r['Posted On'] = Date.parse(r['Posted On'])
            ? Date.parse(r['Posted On'])
            : ''
          return r
        })
        exportToCSV(
          data,
          `Detailed Site works ${moment().format('DD-MMM-YYYY HH-mm-ss')}`
        )
        setDownloadingData(false)
      })
      .catch((err) => {
        toast.error('Error occured!')
        setDownloadingData(false)
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

    // exportToCSV(
    //   _workList,
    //   `Dispatch report ${moment().format('DD-MMM-YYYY HH:mm:ss')}`
    // )
  }

  function getData(reset = false) {
    if (reset) setPageNumber(1)
    // refresh()
    setSiteWork(false)
    setLowbedWork(false)
    setLoadingData(true)
    setWorkStartDate(Date.today().clearTime().moveToFirstDayOfMonth())
    setWorkEndDate(Date.today().clearTime().moveToLastDayOfMonth())
    fetch(
      `${url}/works/filtered/${pageNumber}?userProject=${
        user?.assignedProjects?.length >= 1 &&
        user?.assignedProjects[0]?.prjDescription
      }&userType=${user.userType}&companyName=${
        user.company?.name
      }&&startDate=${startDate}&endDate=${endDate}&searchText=${search}&project=${encodeURIComponent(
        searchProject
      )}&isVendor=${isVendor}&vendorName=${encodeURIComponent(
        user.firstName
      )}&userProjects=${JSON.stringify(user?.assignedProjects)}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        let dataList = resp.workList
        setDataCount(resp.dataCount)

        let data = !isVendor
          ? dataList
          : dataList.filter((p) => p.equipment?.eqOwner === user.firstName)

        let _workList = data

        // ?.filter((w) => {
        //   return (
        //     Date.parse(startDate) <= Date.parse(w?.dispatch?.date) &&
        //     Date.parse(endDate).addHours(23).addMinutes(59) >=
        //       Date.parse(w?.dispatch?.date)
        //   )
        // })
        setWorkList(_workList)
        setOgWorkList(data)

        setEquipments([])
        setEquipmentList([])
        setDrivers([])
        setNJobs(1)
        setNMachinesToMove(1)
        setSelEquipments([])
        setFromProjects([])
        settoProjects([])
        setTargetTrips(0)
        setEqType('')
        setLoadingData(false)
        setSubmitting(false)
      })
      .catch((err) => {
        toast.error(err)
        setLoadingData(false)
        setSubmitting(false)
      })
  }

  function handlePageChange(e, data) {
    setPageNumber(data.activePage)
  }

  function onCloseDrawer() {
    setOpenDrawer(false)
    setViewRow(null)
  }

  return (
    <>
      <div className="my-5 flex flex-col space-y-3 px-10">
        {viewPort !== 'edit' ? (
          <>
            <div className="flex h-12 items-start justify-end">
              <h2 className="flex-1">
                <span>Dispatches</span>
              </h2>
              {viewPort === 'list' && canDispatch && (
                <div>
                  <MSubmitButton
                    submit={() => setViewPort('new')}
                    intent="primary"
                    icon={<PlusIcon className="h-5 w-5" />}
                    label="New"
                  />
                </div>
              )}
            </div>
            <Menu allCount={workList ? dataCount : 0} current="All" />
          </>
        ) : (
          <div className="text-2xl font-semibold">Edit Form ({row?._id})</div>
        )}
        <div className="grid w-full grid-cols-1 gap-1 md:flex md:flex-row md:items-center md:justify-between md:space-x-10">
          {/* {viewPort === 'list' && canDispatch && (
            <div className="hidden md:block">
              <MSubmitButton
                submit={() => setViewPort('new')}
                intent="primary"
                icon={<PlusIcon className="h-5 w-5 text-zinc-800" />}
                label="New"
              />
            </div>
          )} */}

          {viewPort === 'list' && (
            <div className="grid grid-cols-1 gap-2 md:flex md:flex-1 md:flex-row md:items-center md:space-x-2 md:py-5">
              <div className="border md:w-3/12 lg:w-3/12">
                <TextInput
                  placeholder="Search plate number"
                  setValue={setSearch}
                />
              </div>

              <div className="border md:w-3/12 lg:w-3/12">
                <TextInput
                  placeholder="Search Project"
                  setValue={setSearchProject}
                />
              </div>
              {/* <TextInputV placeholder="Customer Name" setValue={setCustomer} />
            <TextInputV placeholder="Project" setValue={setSearchProject} />*/}

              {/* <div className="hidden md:block">
                <TextInputV placeholder="Driver" setValue={setSearchDriver} />
              </div> */}

              <div className="border md:w-3/12 lg:w-3/12">
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
                  placeholder="Equipment owner"
                  fluid
                  search
                  selection
                  className="border-transparent"
                  onChange={(e, data) => {
                    setOwner(data.value)
                  }}
                />
              </div>

              <div className="md:w-1/3">
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
                    padding: '8px 6px',
                  }}
                />
              </div>
            </div>
          )}
          {(viewPort === 'new' || viewPort === 'edit') && (
            <MSubmitButton
              submit={() => {
                setViewPort('list')
                refresh()
              }}
              intent="primary"
              icon={<ArrowLeftIcon className="text-zinc-800 h-5 w-5" />}
              label="Back"
            />
          )}

          {viewPort === 'list' && (
            <div className="flex flex-row items-center space-x-5">
              {selectedWorks?.length >= 1 && (
                <div
                  className="cursor-pointer rounded-lg p-1 font-normal"
                  onClick={() => bulkApprove('available')}
                >
                  Approve selected
                </div>
              )}
              {loadingData ? (
                <div>
                  <Loader active size="small" inline className="ml-5" />
                </div>
              ) : (
                <MagnifyingGlassIcon
                  className="h-6 w-6 cursor-pointer text-red-500"
                  onClick={getData}
                />
              )}

              {downloadingData ? (
                <div>
                  <Loader active size="tiny" inline className="ml-5" />
                </div>
              ) : (
                canDownloadDispatches && (
                  <ArrowDownTrayIcon
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => download()}
                  />
                )
              )}

              <MSubmitButton
                submit={refresh}
                icon={<ArrowPathIcon className="text-zinc-800 h-5 w-5" />}
                label="Refresh"
              />
            </div>
          )}
        </div>

        {viewPort === 'list' && (
          <div className="overflow-x-auto">
            {loadingData && <Loader active />}
            {workList &&
              !loadingData &&
              (submitting ? (
                <Dimmer active>
                  <Loader active />
                </Dimmer>
              ) : (
                <WorkListTable
                  data={workList}
                  handelApprove={_setApproveRow}
                  handelExpandSw={_setExpandSWRow}
                  handelReject={_setRejectRow}
                  handelRecall={_setRecallRow}
                  handelStop={_setStopRow}
                  handelStart={_setStartRow}
                  handleOrder={order}
                  handleSelect={select}
                  handleDeselect={deselect}
                  handelEnd={_setEndRow}
                  handleSetDataSize={setDataSize}
                  handlePageChange={handlePageChange}
                  dataCount={dataCount}
                  loading
                  pageNumber={pageNumber}
                  handleEdit={_setEditRow}
                  handleOpenDrawer={setOpenDrawer}
                  handleViewRow={setViewRow}
                />
              ))}
          </div>
        )}
        {viewPort === 'new' && (
          <Card title="Create a new dispatch">
            <div className="flex flex-col">
              <div className="mt-5 flex flex-row items-center space-x-2">
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
                    class="form-check-label text-zinc-800 inline-block"
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
                    class="form-check-label text-zinc-800 inline-block"
                    for="flexRadioDefault2"
                  >
                    Night shift
                  </label>
                </div>
              </div>
              <div className="mt-5 flex flex-row items-center space-x-10">
                <div class="form-check">
                  <input
                    class="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none focus:ring-0"
                    type="checkbox"
                    name="check"
                    id="checkLowbed"
                    onChange={() => {
                      setSelEquipments([])
                      setSelJobTypes([])
                      setAstDrivers([[]])
                      setDispatchDates(null)
                      setFromProjects([])
                      settoProjects([])
                      setDrivers([])
                      setNJobs(1)
                      setNAstDrivers(1)
                      setSelectedWorks(null)
                      setNJobs(1)
                      setNMachinesToMove(1)
                      let _eqLists = [equipmentFullLists[0]]
                      setEquipmentFullLists(_eqLists)
                      setLowbedWork(!lowbedWork)
                    }}
                  />
                  <label
                    class="form-check-label text-zinc-800 inline-block"
                    for="checkLowbed"
                  >
                    Machine dispatch (by Lowbed)
                  </label>
                </div>
              </div>

              {!lowbedWork && (
                <div className="mt-5 flex flex-row items-center space-x-10">
                  <div class="form-check">
                    <input
                      class="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none focus:ring-0"
                      type="checkbox"
                      name="check"
                      id="check1"
                      onChange={() => {
                        setSiteWork(!siteWork)
                        setDispatchDate(moment())
                      }}
                    />
                    <label
                      class="form-check-label text-zinc-800 inline-block"
                      for="check1"
                    >
                      Site work
                    </label>
                  </div>

                  <RangePicker
                    onChange={(values, dateStrings) => {
                      setWorkStartDate(dateStrings[0])
                      setWorkEndDate(dateStrings[1])
                    }}
                    disabledDate={disabledDate}
                    disabled={!siteWork}
                  />
                </div>
              )}

              {lowbedWork && (
                <div className="mt-5 flex flex-row space-x-10">
                  <div className="mt-5 flex w-2/5 flex-col space-y-5">
                    <div className="flex flex-row items-center justify-between">
                      <div className="items-cente flex flex-row">
                        <MTextView content="Lowbed" />
                        {<div className="text-sm text-red-600">*</div>}
                      </div>
                      <div className="w-4/5">
                        <Dropdown
                          options={lowbedList}
                          placeholder="Select Lowbed"
                          fluid
                          search
                          selection
                          onChange={(e, data) => {
                            setLowbed(
                              ogLowbedList.filter((l) => l._id == data.value)
                            )
                          }}
                        />
                      </div>
                    </div>

                    {lowbed[0]?.eqOwner === 'Construck' && (
                      <div className="flex flex-row items-center justify-between">
                        <div className="items-cente flex flex-1 flex-row">
                          <MTextView content="Lowbed Driver" />
                          {<div className="text-sm text-red-600">*</div>}
                        </div>
                        <div className="w-4/5">
                          <Dropdown
                            options={lowBedDriverList}
                            placeholder="Select Driver      "
                            fluid
                            search
                            selection
                            onChange={(e, data) => {
                              setLowbedOperator(data.value)
                              let _drList = lowBedDriverList.filter(
                                (d) => d.value !== data.value
                              )
                              setDriverList(_drList)
                              setDriverLists([_drList])
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center">
                        <MTextView content="Movement Date" />
                        <div className="text-sm text-red-600">*</div>
                      </div>
                      <div className="w-4/5">
                        <DatePicker
                          size={20}
                          disabledDate={disabledDate}
                          defaultValue={moment()}
                          onChange={(date, dateString) => {
                            setMovementDate(dateString)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-row space-x-10">
                {!lowbedWork && (
                  <>
                    <div className="mt-5 flex w-1/4 flex-col space-y-5">
                      <MTitle content="Dispatch data" />

                      {/* Project */}
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

                      {/* Equipment type */}
                      {/* <div className="mt-5 flex flex-row items-center justify-between">
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
            </div> */}

                      {/* Job type */}
                      {/* <div className="mt-5 flex flex-row items-center justify-between">
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
            </div> */}

                      {/* {(jobType === '62690bbacf45ad62aa6144e6' ||
                jobType === '62690b67cf45ad62aa6144d8') && (
                <TextInput
                  label="Specify Job Type"
                  placeholder="Job type..."
                  setValue={setOtherJobType}
                  type="text"
                  isRequired
                />
              )} */}

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

                          <TextInput
                            label="Target Trips"
                            placeholder="8"
                            type="number"
                            setValue={setTargetTrips}
                          />
                        </>
                      )}

                      {/* <TextInput isRequired={true} label="Date" placeholder="Day" /> */}

                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                          <MTextView content="Date" />
                          <div className="text-sm text-red-600">*</div>
                        </div>
                        <div className="w-4/5">
                          <DatePicker
                            size={20}
                            disabledDate={disabledDate}
                            defaultValue={moment()}
                            onChange={(date, dateString) => {
                              setDispatchDate(dateString)
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Equipment Data */}
                    <div className="mt-5 flex w-3/5 flex-col space-y-5">
                      <div className="flex flex-row items-center space-x-5">
                        <MTitle content="Equipment & Driver data" />
                        {loadingEquipments && (
                          <div className="mb-2">
                            <Loader active size="tiny" inline />
                          </div>
                        )}
                      </div>
                      {[...Array(nJobs)].map((e, i) => (
                        <div className="bg-zinc-100 p-3">
                          <div className="mb-2 grid grid-cols-3 gap-2">
                            {/* Equipment */}
                            <div className="flex flex-col justify-start space-y-1">
                              <div className="items-cente flex flex-row">
                                <MTextView content="Equipment" />
                                {<div className="text-sm text-red-600">*</div>}
                                {selEquipments && selEquipments[i] && (
                                  <div className="ml-2 rounded shadow-md">
                                    <MTextView
                                      content={selEquipments[i]?.eqDescription}
                                      selected
                                    />
                                  </div>
                                )}
                              </div>
                              <Dropdown
                                options={equipmentFullLists[i]}
                                placeholder="Select Equipment"
                                fluid
                                search
                                selection
                                onChange={(e, data) => {
                                  let selecteObj = _.find(equipments, (e) => {
                                    return e._id === data.value
                                  })
                                  if (!selecteObj) {
                                    let _eq = selEquipments
                                      ? [...selEquipments]
                                      : []
                                    _eq[i] = equipmentsOgFull.filter(
                                      (e) => e._id === data.value
                                    )[0]
                                    if (_eq[i].eqtype === 'Truck') {
                                      let _jList = [...jobTypeListsbyRow]
                                      _jList[i] = jobTypeListTrucks
                                      setJobTypeListsbyRow(_jList)
                                    } else {
                                      let _jList = [...jobTypeListsbyRow]
                                      _jList[i] = jobTypeListMachines
                                      setJobTypeListsbyRow(_jList)
                                    }
                                    let _eqLists = [...equipmentFullLists]
                                    let filteredEqList =
                                      equipmentFullList.filter((e) => {
                                        let _eqId = e.value
                                        let _seleEqIds = _eq.map((s) => s._id)
                                        return !_seleEqIds.includes(_eqId)
                                      })

                                    if (_eq[i].eqOwner !== 'Construck') {
                                      let _drOw = drivers ? [...drivers] : []
                                      _drOw[i] = 'NA'
                                      setDrivers(_drOw)
                                      let _dr = drivers ? [...drivers] : []

                                      let _drLists = [...driverLists]
                                      let filteredDrList = driverList.filter(
                                        (e) => {
                                          let _drId = e.value
                                          let _seleDrIds = _dr.map((s) => s)
                                          return !_seleDrIds.includes(_drId)
                                        }
                                      )

                                      _drLists[i + 1] = filteredDrList
                                      setDriverLists(_drLists)
                                    }

                                    _eqLists[i + 1] = filteredEqList
                                    setEquipmentFullLists(_eqLists)

                                    setSelEquipments(_eq)
                                  } else {
                                    toast.warning('Already selected!')
                                    // if (nJobs === 1) {
                                    // } else {
                                    //   setNJobs(nJobs - 1)
                                    // }
                                  }
                                }}
                              />
                            </div>

                            {/* Driver */}
                            {selEquipments[i]?.eqOwner === 'Construck' && (
                              <div className="flex flex-col justify-start space-y-1">
                                <div className="items-cente flex flex-row">
                                  <MTextView content="Driver" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                </div>
                                <Dropdown
                                  options={driverLists[i]}
                                  placeholder="Select Driver      "
                                  fluid
                                  search
                                  selection
                                  onChange={(e, data) => {
                                    let selectedDr = _.find(drivers, (d) => {
                                      return d === data.value
                                    })

                                    if (!selectedDr) {
                                      let _dr = drivers ? [...drivers] : []
                                      _dr[i] = data.value

                                      let _drLists = [...driverLists]
                                      let filteredDrList = driverList.filter(
                                        (e) => {
                                          let _drId = e.value
                                          let _seleDrIds = _dr.map((s) => s)
                                          return !_seleDrIds.includes(_drId)
                                        }
                                      )

                                      _drLists[i + 1] = filteredDrList
                                      setDriverLists(_drLists)
                                      setDrivers(_dr)
                                    } else {
                                      toast.error('Already selected!')
                                    }
                                  }}
                                />
                              </div>
                            )}

                            {/* Job Type */}
                            <div className="flex flex-col justify-start space-y-1">
                              <div className="flex flex-row items-center">
                                <MTextView content="Job Type" />
                                {<div className="text-sm text-red-600">*</div>}
                              </div>
                              <div className="w-full">
                                <Dropdown
                                  options={jobTypeListsbyRow[i]}
                                  placeholder="Select Job type"
                                  fluid
                                  search
                                  selection
                                  onChange={(_e, data) => {
                                    let _selJT = [...selJobTypes]
                                    _selJT[i] = data.value
                                    setSelJobTypes(_selJT)
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <>
                            <div className="grid grid-cols-4 gap-2">
                              {(selJobTypes[i] === '62690bbacf45ad62aa6144e6' ||
                                selJobTypes[i] ===
                                  '62690b67cf45ad62aa6144d8') && (
                                <TextInput
                                  // label="Specify Job Type"
                                  placeholder="Job type..."
                                  setValue={(e) => {
                                    let _othJTypes = [...selJobTypesOthers]
                                    _othJTypes[i] = e
                                    setSelJobTypesOthers(_othJTypes)
                                  }}
                                  type="text"
                                  isRequired
                                />
                              )}

                              {selEquipments &&
                                selEquipments[i]?.eqtype === 'Truck' && (
                                  <>
                                    <TextInput
                                      // label="Site origin"
                                      placeholder="From which site?"
                                      setValue={(e) => {
                                        let _lset = [...selFromSite]
                                        _lset[i] = e
                                        setSelFromSite(_lset)
                                      }}
                                      type="text"
                                    />
                                    <TextInput
                                      // label="Site Destination"
                                      placeholder="To which site?"
                                      setValue={(e) => {
                                        let _lset = [...selToSite]
                                        _lset[i] = e
                                        setSelToSite(_lset)
                                      }}
                                      type="text"
                                    />

                                    {!siteWork && (
                                      <TextInput
                                        // label="Target Trips"
                                        placeholder="Target trips"
                                        type="number"
                                        setValue={(e) => {
                                          let _lset = [...selTargetTrips]
                                          _lset[i] = e
                                          setSelTargetTrips(_lset)
                                        }}
                                      />
                                    )}
                                  </>
                                )}
                            </div>
                          </>

                          {selEquipments[i]?.eqOwner === 'Construck' && (
                            <div className="mt-2 flex flex-col items-start space-y-1">
                              <div className="ml-1">
                                <MTextView content="Assistant Driver / Turn boys" />
                              </div>
                              <div className="flex w-full flex-row justify-between">
                                <div className="flex w-1/2 flex-col space-y-1">
                                  {[...Array(nAstDrivers)].map((e, i) => (
                                    <div className="flex flex-row items-center space-x-5">
                                      <Dropdown
                                        options={driverList}
                                        placeholder="Select Driver"
                                        fluid
                                        search
                                        multiple
                                        selection
                                        onChange={(e, data) => {
                                          let _set = astDrivers
                                            ? [...astDrivers]
                                            : []
                                          _set[i] = data.value
                                          setAstDrivers(_set)
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>

                                {/* <div className="mt-3 flex flex-row space-x-10">
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
                    </div> */}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-row space-x-10">
                      <PlusIcon
                        className="text-teal-600 mt-5 h-5 w-5 cursor-pointer"
                        onClick={() => setNJobs(nJobs + 1)}
                      />
                      <TrashIcon
                        className="mt-5 h-5 w-5 cursor-pointer text-red-500"
                        onClick={() => {
                          if (nJobs === 1) {
                          } else {
                            setNJobs(nJobs - 1)
                            equipmentFullLists.pop()
                            selEquipments.pop()
                            driverLists.pop()
                          }
                        }}
                      />
                    </div>
                  </>
                )}

                {lowbedWork && (
                  <>
                    <div className="mt-5 flex min-w-full flex-col space-y-5">
                      <MTitle content="Dispatch data" />
                      <div className="flex min-w-full flex-row justify-between">
                        <div className="flex flex-1 flex-col space-y-2">
                          {[...Array(nMachinesToMove)].map((e, i) => (
                            <div className="flex flex-row items-center space-x-2">
                              {/* Equipment */}
                              <div className="flex w-1/6 flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="Equipment" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                  <div className="ml-2 shadow-md">
                                    <MTextView
                                      selected
                                      content={selEquipments[i]?.eqDescription}
                                    />
                                  </div>
                                </div>
                                <Dropdown
                                  options={equipmentFullLists[i]}
                                  placeholder="Select Equipment"
                                  fluid
                                  search
                                  selection
                                  onChange={(e, data) => {
                                    let selecteObj = _.find(
                                      selEquipments,
                                      (e) => {
                                        return e._id === data.value
                                      }
                                    )
                                    if (!selecteObj) {
                                      let _eq = selEquipments
                                        ? [...selEquipments]
                                        : []
                                      _eq[i] = equipmentsOgFull.filter(
                                        (e) => e._id === data.value
                                      )[0]
                                      if (_eq[i].eqtype === 'Truck') {
                                        let _jList = [...jobTypeListsbyRow]
                                        _jList[i] = jobTypeListTrucks
                                        setJobTypeListsbyRow(_jList)
                                      } else {
                                        let _jList = [...jobTypeListsbyRow]
                                        _jList[i] = jobTypeListMachines
                                        setJobTypeListsbyRow(_jList)
                                      }
                                      let _eqLists = [...equipmentFullLists]
                                      let filteredEqList =
                                        equipmentFullList.filter((e) => {
                                          let _eqId = e.value
                                          let _seleEqIds = _eq.map((s) => s._id)
                                          return !_seleEqIds.includes(_eqId)
                                        })

                                      _eqLists[i + 1] = filteredEqList
                                      setEquipmentFullLists(_eqLists)

                                      if (_eq[i].eqOwner !== 'Construck') {
                                        let _drOw = drivers ? [...drivers] : []
                                        _drOw[i] = 'NA'
                                        setDrivers(_drOw)
                                        let _dr = drivers ? [...drivers] : []

                                        let _drLists = [...driverLists]
                                        let filteredDrList = driverList.filter(
                                          (e) => {
                                            let _drId = e.value
                                            let _seleDrIds = _dr.map((s) => s)
                                            return !_seleDrIds.includes(_drId)
                                          }
                                        )

                                        _drLists[i + 1] = filteredDrList
                                        setDriverLists(_drLists)
                                      }
                                      setSelEquipments(_eq)
                                    } else {
                                      toast.error('Already selected!')
                                      // if (nMachinesToMove === 1) {
                                      // } else {
                                      //   setNMachinesToMove(nMachinesToMove - 1)
                                      // }
                                    }
                                  }}
                                />
                              </div>

                              {selEquipments[i]?.eqOwner === 'Construck' && (
                                <div className="flex w-1/6 flex-col justify-start space-y-1">
                                  <div className="flex flex-row items-center">
                                    <MTextView content="Driver" />
                                    {
                                      <div className="text-sm text-red-600">
                                        *
                                      </div>
                                    }
                                  </div>
                                  <Dropdown
                                    options={driverLists[i]}
                                    placeholder="Select Driver      "
                                    fluid
                                    search
                                    selection
                                    onChange={(e, data) => {
                                      let selectedDr = _.find(drivers, (d) => {
                                        return d === data.value
                                      })
                                      if (!selectedDr) {
                                        let _dr = drivers ? [...drivers] : []
                                        _dr[i] = data.value

                                        let _drLists = [...driverLists]
                                        let filteredDrList = driverList.filter(
                                          (e) => {
                                            let _drId = e.value
                                            let _seleDrIds = _dr.map((s) => s)
                                            return !_seleDrIds.includes(_drId)
                                          }
                                        )

                                        _drLists[i + 1] = filteredDrList
                                        setDriverLists(_drLists)
                                        setDrivers(_dr)
                                      } else {
                                        toast.error('Already selected!')
                                        if (nMachinesToMove === 1) {
                                        } else {
                                          let _e = [...selEquipments]
                                          _e.pop()
                                          setSelEquipments(_e)
                                          setNMachinesToMove(
                                            nMachinesToMove - 1
                                          )
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              )}

                              {/* From Project */}
                              <div className="flex w-1/6 flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="From" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                </div>
                                <div className="w-full">
                                  <Dropdown
                                    options={projectList}
                                    placeholder="Project"
                                    fluid
                                    search
                                    selection
                                    onChange={(e, data) => {
                                      let selectedPr = _.find(
                                        fromProjects,
                                        (d) => {
                                          return d === data.value
                                        }
                                      )
                                      if (!selectedPr) {
                                        let _dr = fromProjects
                                          ? [...fromProjects]
                                          : []
                                        _dr[i] = projects.filter(
                                          (p) => p._id === data.value
                                        )[0]
                                        setFromProjects(_dr)
                                      } else {
                                        toast.error('Already selected!')
                                        if (nMachinesToMove === 1) {
                                        } else {
                                          let _e = fromProjects
                                            ? [...fromProjects]
                                            : []
                                          _e.pop()
                                          setFromProjects(_e)
                                          setNMachinesToMove(
                                            nMachinesToMove - 1
                                          )
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              </div>

                              {/* To Project */}
                              <div className="flex w-1/6 flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="To" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                </div>
                                <div className="w-full">
                                  <Dropdown
                                    options={projectList}
                                    placeholder="Project"
                                    fluid
                                    search
                                    selection
                                    onChange={(e, data) => {
                                      let selectedPr = _.find(
                                        toProjects,
                                        (d) => {
                                          return d === data.value
                                        }
                                      )
                                      if (!selectedPr) {
                                        let _dr = toProjects
                                          ? [...toProjects]
                                          : []
                                        _dr[i] = projects.filter(
                                          (p) => p._id === data.value
                                        )[0]
                                        settoProjects(_dr)
                                      } else {
                                        toast.error('Already selected!')
                                        if (nMachinesToMove === 1) {
                                        } else {
                                          let _e = toProjects
                                            ? [...toProjects]
                                            : []
                                          _e.pop()
                                          settoProjects(_e)
                                          setNMachinesToMove(
                                            nMachinesToMove - 1
                                          )
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Job Type */}
                              <div className="flex w-1/6 flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="Job Type" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                </div>
                                <div className="w-full">
                                  <Dropdown
                                    options={jobTypeListsbyRow[i]}
                                    placeholder="Select Job type"
                                    fluid
                                    search
                                    selection
                                    onChange={(e, data) => {
                                      let _selJT = [...selJobTypes]
                                      _selJT[i] = data.value
                                      setSelJobTypes(_selJT)
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Date */}
                              <div className="flex flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="Date" />
                                  <div className="text-sm text-red-600">*</div>
                                </div>
                                <div className="w-full">
                                  <RangePicker
                                    size={20}
                                    defaultValue={moment()}
                                    disabledDate={disabledDate}
                                    onChange={(date, dateString) => {
                                      let _dispDates = dispatchDates
                                        ? [...dispatchDates]
                                        : []

                                      _dispDates[i] = dateString

                                      setDispatchDates(_dispDates)
                                      // setDispatchDate(dateString)
                                    }}
                                  />
                                </div>
                              </div>
                              {selEquipments[i]?.eqType === 'Truck' && (
                                <div className="flex flex-col justify-start space-y-1">
                                  <div className="flex flex-row items-center">
                                    <MTextView content="Target trips" />
                                    {
                                      <div className="text-sm text-red-600">
                                        *
                                      </div>
                                    }
                                  </div>
                                  {/* Target trips */}
                                  <TextInput
                                    // label="Target Trips"
                                    placeholder="Target trips"
                                    type="number"
                                    setValue={(e) => {
                                      let _lset = [...selTargetTrips]
                                      _lset[i] = e
                                      setSelTargetTrips(_lset)
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 ml-5 flex flex-row space-x-5">
                          <PlusIcon
                            className="text-teal-600 h-5 w-5 cursor-pointer"
                            onClick={() => {
                              let nSelEq = selEquipments.length

                              if (nSelEq == nMachinesToMove) {
                                setNMachinesToMove(nMachinesToMove + 1)
                              }
                            }}
                          />
                          <TrashIcon
                            className="h-5 w-5 cursor-pointer text-red-500"
                            onClick={() => {
                              if (nMachinesToMove === 1) {
                              } else {
                                let nSelEq = selEquipments.length
                                if (
                                  nSelEq <= nMachinesToMove &&
                                  nMachinesToMove !== 1
                                ) {
                                  setNMachinesToMove(nMachinesToMove - 1)
                                  if (nSelEq > 1) {
                                    selEquipments.pop()
                                    equipmentFullLists.pop()
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {((dispatchDate &&
                project &&
                selEquipments?.length > 0 &&
                drivers?.length > 0) ||
                lowbedWork) && (
                <div className="mt-10 w-24 self-center">
                  <MSubmitButton
                    icon={
                      !submitting && (
                        <CheckIcon className="text-zinc-800 h-5 w-5" />
                      )
                    }
                    intent={submitting ? 'disabled' : 'primary'}
                    label={
                      submitting ? (
                        <Loader active inline size="tiny" />
                      ) : (
                        'Create'
                      )
                    }
                    submit={() => submit()}
                    disabled={submitting}
                  />
                </div>
              )}
            </div>
          </Card>
        )}

        {viewPort === 'edit' && (
          <Card title="Edit dispatch">
            <div className="flex flex-col">
              <div className="mt-5 flex flex-row items-center space-x-2">
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
                    class="form-check-label text-zinc-800 inline-block"
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
                    class="form-check-label text-zinc-800 inline-block"
                    for="flexRadioDefault2"
                  >
                    Night shift
                  </label>
                </div>
              </div>
              <div className="mt-5 flex flex-row items-center space-x-10">
                <div class="form-check">
                  <input
                    class="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none focus:ring-0"
                    type="checkbox"
                    name="check"
                    id="checkLowbed"
                    onChange={() => {
                      setSelEquipments([])
                      setSelJobTypes([])
                      setAstDrivers([[]])
                      setDispatchDates(null)
                      setFromProjects([])
                      settoProjects([])
                      setDrivers([])
                      setNJobs(1)
                      setNAstDrivers(1)
                      setSelectedWorks(null)
                      setNJobs(1)
                      setNMachinesToMove(1)
                      let _eqLists = [equipmentFullLists[0]]
                      setEquipmentFullLists(_eqLists)
                      setLowbedWork(!lowbedWork)
                    }}
                  />
                  <label
                    class="form-check-label text-zinc-800 inline-block"
                    for="checkLowbed"
                  >
                    Machine dispatch (by Lowbed)
                  </label>
                </div>
              </div>

              {!lowbedWork && (
                <div className="mt-5 flex flex-row items-center space-x-10">
                  <div class="form-check">
                    <input
                      class="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 focus:outline-none focus:ring-0"
                      type="checkbox"
                      name="check"
                      checked={siteWork}
                      id="check1"
                      onChange={() => {
                        setSiteWork(!siteWork)
                        setDispatchDate(moment())
                      }}
                    />
                    <label
                      class="form-check-label text-zinc-800 inline-block"
                      for="check1"
                    >
                      Site work
                    </label>
                  </div>

                  <RangePicker
                    onChange={(values, dateStrings) => {
                      setWorkStartDate(dateStrings[0])
                      setWorkEndDate(dateStrings[1])
                    }}
                    defaultValue={[moment(workStartDate), moment(workEndDate)]}
                    disabledDate={disabledDate}
                    disabled={!siteWork}
                  />
                </div>
              )}

              {lowbedWork && (
                <div className="mt-5 flex flex-row space-x-10">
                  <div className="mt-5 flex w-2/5 flex-col space-y-5">
                    <div className="flex flex-row items-center justify-between">
                      <div className="items-cente flex flex-row">
                        <MTextView content="Lowbed" />
                        {<div className="text-sm text-red-600">*</div>}
                      </div>
                      <div className="w-4/5">
                        <Dropdown
                          options={lowbedList}
                          placeholder="Select Lowbed"
                          fluid
                          search
                          selection
                          onChange={(e, data) => {
                            setLowbed(
                              ogLowbedList.filter((l) => l._id == data.value)
                            )
                          }}
                        />
                      </div>
                    </div>

                    {lowbed[0]?.eqOwner === 'Construck' && (
                      <div className="flex flex-row items-center justify-between">
                        <div className="items-cente flex flex-1 flex-row">
                          <MTextView content="Lowbed Driver" />
                          {<div className="text-sm text-red-600">*</div>}
                        </div>
                        <div className="w-4/5">
                          <Dropdown
                            options={lowBedDriverList}
                            placeholder="Select Driver      "
                            fluid
                            search
                            selection
                            onChange={(e, data) => {
                              setLowbedOperator(data.value)
                              let _drList = lowBedDriverList.filter(
                                (d) => d.value !== data.value
                              )
                              setDriverList(_drList)
                              setDriverLists([_drList])
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center">
                        <MTextView content="Movement Date" />
                        <div className="text-sm text-red-600">*</div>
                      </div>
                      <div className="w-4/5">
                        <DatePicker
                          size={20}
                          disabledDate={disabledDate}
                          defaultValue={moment()}
                          onChange={(date, dateString) => {
                            setMovementDate(dateString)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-row space-x-10">
                {!lowbedWork && (
                  <>
                    <div className="mt-5 flex w-1/4 flex-col space-y-5">
                      <MTitle content="Dispatch data" />

                      {/* Project */}
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
                            defaultValue={row?.project?._id}
                            onChange={(e, data) => {
                              setProject(
                                projects.filter((p) => p._id === data.value)[0]
                              )
                            }}
                          />
                        </div>
                      </div>

                      {/* Equipment type */}
                      {/* <div className="mt-5 flex flex-row items-center justify-between">
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
                  </div> */}

                      {/* Job type */}
                      {/* <div className="mt-5 flex flex-row items-center justify-between">
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
                  </div> */}

                      {/* <TextInput isRequired={true} label="Date" placeholder="Day" /> */}

                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                          <MTextView content="Date" />
                          <div className="text-sm text-red-600">*</div>
                        </div>
                        <div className="w-4/5">
                          <DatePicker
                            size={20}
                            disabledDate={disabledDate}
                            defaultValue={moment(row?.dispatch?.date)}
                            onChange={(date, dateString) => {
                              setDispatchDate(dateString)
                              row.dispatch.date = new Date(dateString)
                              setRow(row)
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Equipment Data */}
                    <div className="mt-5 flex w-3/5 flex-col space-y-5">
                      <div className="flex flex-row items-center space-x-5">
                        <MTitle content="Equipment & Driver data" />
                        {loadingEquipments && (
                          <div className="mb-2">
                            <Loader active size="tiny" inline />
                          </div>
                        )}
                      </div>
                      {[...Array(nJobs)].map((e, i) => (
                        <div className="bg-zinc-100 p-3">
                          <div className="mb-2 grid grid-cols-3 gap-2">
                            {/* Equipment */}
                            <div className="flex flex-col justify-start space-y-1">
                              <div className="items-cente flex flex-row">
                                <MTextView content="Equipment" />
                                {<div className="text-sm text-red-600">*</div>}
                                {row?.equipment && (
                                  <div className="ml-2 rounded shadow-md">
                                    <MTextView
                                      content={row?.equipment.eqDescription}
                                      selected
                                    />
                                  </div>
                                )}
                              </div>
                              <Dropdown
                                options={equipmentFullLists[i]}
                                placeholder={row?.equipment?.plateNumber}
                                fluid
                                search
                                selection
                                defaultValue={row?.equipment?._id}
                                onChange={(e, data) => {
                                  let selecteObj = _.find(equipments, (e) => {
                                    return e._id === data.value
                                  })

                                  if (!selecteObj) {
                                    let _eq = selEquipments
                                      ? [...selEquipments]
                                      : []
                                    _eq[i] = equipmentsOgFull.filter(
                                      (e) => e._id === data.value
                                    )[0]
                                    if (row?.equipment?.eqtype === 'Truck') {
                                      let _jList = [...jobTypeListsbyRow]
                                      _jList[i] = jobTypeListTrucks
                                      setJobTypeListsbyRow(_jList)
                                    } else {
                                      let _jList = [...jobTypeListsbyRow]
                                      _jList[i] = jobTypeListMachines
                                      setJobTypeListsbyRow(_jList)
                                    }
                                    let _eqLists = [...equipmentFullLists]
                                    let filteredEqList =
                                      equipmentFullList.filter((e) => {
                                        let _eqId = e.value
                                        let _seleEqIds = _eq.map((s) => s._id)
                                        return !_seleEqIds.includes(_eqId)
                                      })

                                    if (
                                      row?.equipment?.eqOwner !== 'Construck'
                                    ) {
                                      let _drOw = drivers ? [...drivers] : []
                                      _drOw[i] = 'NA'
                                      setDrivers(_drOw)
                                      let _dr = drivers ? [...drivers] : []

                                      let _drLists = [...driverLists]
                                      let filteredDrList = driverList.filter(
                                        (e) => {
                                          let _drId = e.value
                                          let _seleDrIds = _dr.map((s) => s)
                                          return !_seleDrIds.includes(_drId)
                                        }
                                      )

                                      _drLists[i + 1] = filteredDrList
                                      setDriverLists(_drLists)
                                    }

                                    _eqLists[i + 1] = filteredEqList
                                    setEquipmentFullLists(_eqLists)

                                    setSelEquipments(_eq)
                                  } else {
                                    toast.warning('Already selected!')
                                    // if (nJobs === 1) {
                                    // } else {
                                    //   setNJobs(nJobs - 1)
                                    // }
                                  }
                                }}
                              />
                            </div>

                            {/* Driver */}
                            {row?.equipment?.eqOwner === 'Construck' && (
                              <div className="flex flex-col justify-start space-y-1">
                                <div className="items-cente flex flex-row">
                                  <MTextView content="Driver" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                </div>
                                <Dropdown
                                  options={driverLists[i]}
                                  placeholder={
                                    row?.driver?.firstName +
                                    ' ' +
                                    row?.driver?.lastName
                                  }
                                  fluid
                                  search
                                  selection
                                  defaultValue={driver}
                                  onChange={(e, data) => {
                                    let selectedDr = _.find(drivers, (d) => {
                                      return d === data.value
                                    })

                                    if (!selectedDr || viewPort === 'edit') {
                                      let _dr = drivers ? [...drivers] : []
                                      _dr[i] = data.value

                                      let _drLists = [...driverLists]
                                      let filteredDrList = driverList.filter(
                                        (e) => {
                                          let _drId = e.value
                                          let _seleDrIds = _dr.map((s) => s)
                                          return !_seleDrIds.includes(_drId)
                                        }
                                      )

                                      _drLists[i + 1] = filteredDrList
                                      setDriverLists(_drLists)
                                      setDrivers(_dr)
                                    } else {
                                      toast.error('Already selected!')
                                    }
                                  }}
                                />
                              </div>
                            )}

                            {/* Job Type */}
                            <div className="flex flex-col justify-start space-y-1">
                              <div className="flex flex-row items-center">
                                <MTextView content="Job Type" />
                                {<div className="text-sm text-red-600">*</div>}
                              </div>
                              <div className="w-full">
                                <Dropdown
                                  options={
                                    row?.equipment?.eqtype === 'Truck'
                                      ? jobTypeListTrucks
                                      : jobTypeListMachines
                                  }
                                  placeholder="Select Job type"
                                  fluid
                                  search
                                  selection
                                  defaultValue={jobType}
                                  onChange={(_e, data) => {
                                    let _selJT = [...selJobTypes]
                                    _selJT[i] = data.value
                                    setSelJobTypes(_selJT)
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <>
                            <div className="grid grid-cols-4 gap-2">
                              {(row?.workDone?._id ===
                                '62690bbacf45ad62aa6144e6' ||
                                row?.workDone?._id ===
                                  '62690b67cf45ad62aa6144d8') && (
                                <TextInput
                                  // label="Specify Job Type"
                                  placeholder="Job type..."
                                  setValue={(e) => {
                                    let _othJTypes = [...selJobTypesOthers]
                                    _othJTypes[i] = e
                                    setSelJobTypesOthers(_othJTypes)
                                  }}
                                  type="text"
                                  isRequired
                                />
                              )}

                              {selEquipments &&
                                row?.equipment?.eqtype === 'Truck' && (
                                  <>
                                    <TextInput
                                      // label="Site origin"
                                      placeholder="From which site?"
                                      setValue={(e) => {
                                        let _lset = [...selFromSite]
                                        _lset[i] = e
                                        setSelFromSite(_lset)
                                      }}
                                      type="text"
                                    />
                                    <TextInput
                                      // label="Site Destination"
                                      placeholder="To which site?"
                                      setValue={(e) => {
                                        let _lset = [...selToSite]
                                        _lset[i] = e
                                        setSelToSite(_lset)
                                      }}
                                      type="text"
                                    />

                                    {!siteWork && (
                                      <TextInput
                                        // label="Target Trips"
                                        placeholder="Target trips"
                                        type="number"
                                        setValue={(e) => {
                                          let _lset = [...selTargetTrips]
                                          _lset[i] = e
                                          setSelTargetTrips(_lset)
                                        }}
                                      />
                                    )}
                                  </>
                                )}
                            </div>
                          </>

                          {row?.equipment?.eqOwner === 'Construck' && (
                            <div className="mt-2 flex flex-col items-start space-y-1">
                              <div className="ml-1">
                                <MTextView content="Assistant Driver / Turn boys" />
                              </div>
                              <div className="flex w-full flex-row justify-between">
                                <div className="flex w-1/2 flex-col space-y-1">
                                  {[...Array(nAstDrivers)].map((e, i) => (
                                    <div className="flex flex-row items-center space-x-5">
                                      <Dropdown
                                        options={driverList}
                                        placeholder="Select Driver"
                                        fluid
                                        search
                                        multiple
                                        selection
                                        onChange={(e, data) => {
                                          let _set = astDrivers
                                            ? [...astDrivers]
                                            : []
                                          _set[i] = data.value
                                          setAstDrivers(_set)
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>

                                {/* <div className="mt-3 flex flex-row space-x-10">
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
                          </div> */}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* <div className="flex flex-row space-x-10">
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
                          equipmentFullLists.pop()
                          selEquipments.pop()
                          driverLists.pop()
                        }
                      }}
                    />
                  </div> */}
                  </>
                )}

                {lowbedWork && (
                  <>
                    <div className="mt-5 flex min-w-full flex-col space-y-5">
                      <MTitle content="Dispatch data" />
                      <div className="flex min-w-full flex-row justify-between">
                        <div className="flex flex-1 flex-col space-y-2">
                          {[...Array(nMachinesToMove)].map((e, i) => (
                            <div className="flex flex-row items-center space-x-2">
                              {/* Equipment */}
                              <div className="flex w-1/6 flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="Equipment" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                  <div className="ml-2 shadow-md">
                                    <MTextView
                                      selected
                                      content={selEquipments[i]?.eqDescription}
                                    />
                                  </div>
                                </div>
                                <Dropdown
                                  options={equipmentFullLists[i]}
                                  placeholder="Select Equipment"
                                  fluid
                                  search
                                  selection
                                  onChange={(e, data) => {
                                    let selecteObj = _.find(
                                      selEquipments,
                                      (e) => {
                                        return e._id === data.value
                                      }
                                    )
                                    if (!selecteObj) {
                                      let _eq = selEquipments
                                        ? [...selEquipments]
                                        : []
                                      _eq[i] = equipmentsOgFull.filter(
                                        (e) => e._id === data.value
                                      )[0]
                                      if (_eq[i].eqtype === 'Truck') {
                                        let _jList = [...jobTypeListsbyRow]
                                        _jList[i] = jobTypeListTrucks
                                        setJobTypeListsbyRow(_jList)
                                      } else {
                                        let _jList = [...jobTypeListsbyRow]
                                        _jList[i] = jobTypeListMachines
                                        setJobTypeListsbyRow(_jList)
                                      }
                                      let _eqLists = [...equipmentFullLists]
                                      let filteredEqList =
                                        equipmentFullList.filter((e) => {
                                          let _eqId = e.value
                                          let _seleEqIds = _eq.map((s) => s._id)
                                          return !_seleEqIds.includes(_eqId)
                                        })

                                      _eqLists[i + 1] = filteredEqList
                                      setEquipmentFullLists(_eqLists)

                                      if (_eq[i].eqOwner !== 'Construck') {
                                        let _drOw = drivers ? [...drivers] : []
                                        _drOw[i] = 'NA'
                                        setDrivers(_drOw)
                                        let _dr = drivers ? [...drivers] : []

                                        let _drLists = [...driverLists]
                                        let filteredDrList = driverList.filter(
                                          (e) => {
                                            let _drId = e.value
                                            let _seleDrIds = _dr.map((s) => s)
                                            return !_seleDrIds.includes(_drId)
                                          }
                                        )

                                        _drLists[i + 1] = filteredDrList
                                        setDriverLists(_drLists)
                                      }
                                      setSelEquipments(_eq)
                                    } else {
                                      toast.error('Already selected!')
                                      // if (nMachinesToMove === 1) {
                                      // } else {
                                      //   setNMachinesToMove(nMachinesToMove - 1)
                                      // }
                                    }
                                  }}
                                />
                              </div>

                              {selEquipments[i]?.eqOwner === 'Construck' && (
                                <div className="flex w-1/6 flex-col justify-start space-y-1">
                                  <div className="flex flex-row items-center">
                                    <MTextView content="Driver" />
                                    {
                                      <div className="text-sm text-red-600">
                                        *
                                      </div>
                                    }
                                  </div>
                                  <Dropdown
                                    options={driverLists[i]}
                                    placeholder="Select Driver      "
                                    fluid
                                    search
                                    selection
                                    onChange={(e, data) => {
                                      let selectedDr = _.find(drivers, (d) => {
                                        return d === data.value
                                      })
                                      if (!selectedDr) {
                                        let _dr = drivers ? [...drivers] : []
                                        _dr[i] = data.value

                                        let _drLists = [...driverLists]
                                        let filteredDrList = driverList.filter(
                                          (e) => {
                                            let _drId = e.value
                                            let _seleDrIds = _dr.map((s) => s)
                                            return !_seleDrIds.includes(_drId)
                                          }
                                        )

                                        _drLists[i + 1] = filteredDrList
                                        setDriverLists(_drLists)
                                        setDrivers(_dr)
                                      } else {
                                        toast.error('Already selected!')
                                        if (nMachinesToMove === 1) {
                                        } else {
                                          let _e = [...selEquipments]
                                          _e.pop()
                                          setSelEquipments(_e)
                                          setNMachinesToMove(
                                            nMachinesToMove - 1
                                          )
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              )}

                              {/* From Project */}
                              <div className="flex w-1/6 flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="From" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                </div>
                                <div className="w-full">
                                  <Dropdown
                                    options={projectList}
                                    placeholder="Project"
                                    fluid
                                    search
                                    selection
                                    onChange={(e, data) => {
                                      let selectedPr = _.find(
                                        fromProjects,
                                        (d) => {
                                          return d === data.value
                                        }
                                      )
                                      if (!selectedPr) {
                                        let _dr = fromProjects
                                          ? [...fromProjects]
                                          : []
                                        _dr[i] = projects.filter(
                                          (p) => p._id === data.value
                                        )[0]
                                        setFromProjects(_dr)
                                      } else {
                                        toast.error('Already selected!')
                                        if (nMachinesToMove === 1) {
                                        } else {
                                          let _e = fromProjects
                                            ? [...fromProjects]
                                            : []
                                          _e.pop()
                                          setFromProjects(_e)
                                          setNMachinesToMove(
                                            nMachinesToMove - 1
                                          )
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              </div>

                              {/* To Project */}
                              <div className="flex w-1/6 flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="To" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                </div>
                                <div className="w-full">
                                  <Dropdown
                                    options={projectList}
                                    placeholder="Project"
                                    fluid
                                    search
                                    selection
                                    onChange={(e, data) => {
                                      let selectedPr = _.find(
                                        toProjects,
                                        (d) => {
                                          return d === data.value
                                        }
                                      )
                                      if (!selectedPr) {
                                        let _dr = toProjects
                                          ? [...toProjects]
                                          : []
                                        _dr[i] = projects.filter(
                                          (p) => p._id === data.value
                                        )[0]
                                        settoProjects(_dr)
                                      } else {
                                        toast.error('Already selected!')
                                        if (nMachinesToMove === 1) {
                                        } else {
                                          let _e = toProjects
                                            ? [...toProjects]
                                            : []
                                          _e.pop()
                                          settoProjects(_e)
                                          setNMachinesToMove(
                                            nMachinesToMove - 1
                                          )
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Job Type */}
                              <div className="flex w-1/6 flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="Job Type" />
                                  {
                                    <div className="text-sm text-red-600">
                                      *
                                    </div>
                                  }
                                </div>
                                <div className="w-full">
                                  <Dropdown
                                    options={jobTypeListsbyRow[i]}
                                    placeholder="Select Job type"
                                    fluid
                                    search
                                    selection
                                    onChange={(e, data) => {
                                      let _selJT = [...selJobTypes]
                                      _selJT[i] = data.value
                                      setSelJobTypes(_selJT)
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Date */}
                              <div className="flex flex-col justify-start space-y-1">
                                <div className="flex flex-row items-center">
                                  <MTextView content="Date" />
                                  <div className="text-sm text-red-600">*</div>
                                </div>
                                <div className="w-full">
                                  <RangePicker
                                    size={20}
                                    defaultValue={moment()}
                                    disabledDate={disabledDate}
                                    onChange={(date, dateString) => {
                                      let _dispDates = dispatchDates
                                        ? [...dispatchDates]
                                        : []

                                      _dispDates[i] = dateString

                                      setDispatchDates(_dispDates)
                                      // setDispatchDate(dateString)
                                    }}
                                  />
                                </div>
                              </div>
                              {selEquipments[i]?.eqType === 'Truck' && (
                                <div className="flex flex-col justify-start space-y-1">
                                  <div className="flex flex-row items-center">
                                    <MTextView content="Target trips" />
                                    {
                                      <div className="text-sm text-red-600">
                                        *
                                      </div>
                                    }
                                  </div>
                                  {/* Target trips */}
                                  <TextInput
                                    // label="Target Trips"
                                    placeholder="Target trips"
                                    type="number"
                                    setValue={(e) => {
                                      let _lset = [...selTargetTrips]
                                      _lset[i] = e
                                      setSelTargetTrips(_lset)
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 ml-5 flex flex-row space-x-5">
                          <PlusIcon
                            className="text-teal-600 h-5 w-5 cursor-pointer"
                            onClick={() => {
                              let nSelEq = selEquipments.length

                              if (nSelEq == nMachinesToMove) {
                                setNMachinesToMove(nMachinesToMove + 1)
                              }
                            }}
                          />
                          <TrashIcon
                            className="h-5 w-5 cursor-pointer text-red-500"
                            onClick={() => {
                              if (nMachinesToMove === 1) {
                              } else {
                                let nSelEq = selEquipments.length
                                if (
                                  nSelEq <= nMachinesToMove &&
                                  nMachinesToMove !== 1
                                ) {
                                  setNMachinesToMove(nMachinesToMove - 1)
                                  if (nSelEq > 1) {
                                    selEquipments.pop()
                                    equipmentFullLists.pop()
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {((dispatchDate &&
                project &&
                selEquipments?.length > 0 &&
                drivers?.length > 0) ||
                lowbedWork) && (
                <div className="mt-10 self-center">
                  <MSubmitButton
                    icon={
                      !submitting && (
                        <CheckIcon className="text-zinc-800 h-5 w-5" />
                      )
                    }
                    intent={submitting ? 'disabled' : 'primary'}
                    label={
                      submitting ? (
                        <Loader active inline size="tiny" />
                      ) : (
                        'Update Form'
                      )
                    }
                    submit={() => update()}
                    disabled={submitting}
                  />
                </div>
              )}
            </div>
          </Card>
        )}

        <ToastContainer />
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
          handleSetMoreComment={setMoreComment}
          handleSetReason={_setReason}
          reasons={reasonList}
          rowData={workList[rowIndex]}
          showReasonField={
            tripsDone < workList[rowIndex]?.dispatch?.targetTrips ||
            duration < 5
          }
          type="stop"
          startIndexInvalid={false}
          endIndexInvalid={
            !endIndex ||
            endIndex === 0 ||
            endIndex < parseInt(workList[rowIndex]?.startIndex)
          }
          endIndexErrorMessage={
            !endIndex || endIndex === 0
              ? 'End Index can not be empty or zero!'
              : 'End Index should not be lesser than the Start Index!'
          }
          reasonSelected={(duration < 5 && comment) || duration >= 5}
          isSiteWork={workList[rowIndex]?.siteWork}
          handleSetPostingDate={setPostingDate}
          dailyWorks={workList[rowIndex]?.dailyWork}
        />
      )}

      {endModalIsShown && (
        <Modal
          title="End site work!"
          body="Are you sure you want to end this site work?"
          isShown={endModalIsShown}
          setIsShown={setEndModalIsShown}
          handleConfirm={end}
          rowData={workList[rowIndex]}
          type="end"
        />
      )}

      {startModalIsShown && (
        <Modal
          title="Start job"
          body="Please fill the info to start the job! "
          isShown={startModalIsShown}
          setIsShown={setStartModalIsShown}
          handleConfirm={start}
          handleSetStartIndex={setStartIndex}
          rowData={workList[rowIndex]}
          type="start"
          isSiteWork={workList[rowIndex]?.siteWork}
          endIndexInvalid={false}
          startIndexInvalid={
            !startIndex ||
            startIndex == 0 ||
            startIndex < workList[rowIndex]?.equipment?.millage
          }
          startIndexErrorMessage={
            !startIndex || startIndex == 0
              ? 'Start Index can not be empty or zero!'
              : 'Start Index should not be lesser that the last index!'
          }
          handleSetPostingDate={setPostingDate}
          dailyWorks={workList[rowIndex]?.dailyWork}
          reasonSelected={true}
          showReasonField={false}
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

      {expandSwModalIsShown && (
        <Modal
          title="More details"
          body="Please select which dates to approve or reject."
          isShown={expandSwModalIsShown}
          setIsShown={setExpandSwModalIsShown}
          handleConfirmApproval={confirmApproveDailyWork}
          handleConfirmRejection={confirmRejectDailyWork}
          handleApproveDailyWork={approveDailyWork}
          handleRejectDailyWork={rejectDailyWork}
          handleDiscardDailyWork={discardDailyWork}
          handleSetReason={setReasonForRejection}
          rowData={row}
          type="expand"
        />
      )}

      {editModalIsShown && (
        <Modal
          title="Edit"
          body="Please fill the info to edit the job! "
          isShown={editModalIsShown}
          setIsShown={setEditModalIsShown}
          rowData={workList[rowIndex]}
          type="edit"
          isSiteWork={workList[rowIndex]?.siteWork}
          endIndexInvalid={false}
        />
      )}

      <Drawer title={`Activity log`} onClose={onCloseDrawer} open={openDrawer}>
        {activityLog && !loadingActivity && (
          <>
            {activityLog?.map((activity) => {
              return (
                <div className="my-5 rounded border-2 p-2 text-xs">
                  <div>Action: {activity?._id?.action?.toLowerCase()}</div>
                  <div>
                    Done On:{' '}
                    {moment(activity?._id?.createdOn).format(
                      'DD-MMM-YYYY hh:mm:ss a'
                    )}
                  </div>
                  <div>
                    Done By:{' '}
                    {activity?._id?.doneBy?.lastName +
                      ' ' +
                      activity?._id?.doneBy?.firstName}
                  </div>
                </div>
              )
            })}
          </>
        )}
        {loadingActivity && <Skeleton active />}
      </Drawer>
    </>
  )
}
