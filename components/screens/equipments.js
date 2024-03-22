import {
  ArrowLeftIcon,
  ArchiveBoxXMarkIcon,
  CheckIcon,
  CogIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import React, { useContext, useEffect, useState } from 'react'
import EquipmentCard from '../common/equipmentCard'
import MSubmitButton from '../common/mSubmitButton'
import TextInput from '../common/TextIput'
import readXlsxFile from 'read-excel-file'
import { Dropdown, Loader } from 'semantic-ui-react'
import { DatePicker, Tooltip, Drawer, Skeleton } from 'antd'
import Modal from '../common/modal'
import { UserContext } from '../../contexts/UserContext'
import EqStatusCard from '../common/eqStatusCard'
import TextInputV from '../common/TextIputV'
import TextInputLogin from '../common/TextIputLogin'
import MTextView from '../common/mTextView'
import { toast, ToastContainer } from 'react-toastify'

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import moment from 'moment'

export default function Equipments() {
  let { user, setUser } = useContext(UserContext)
  //AUTORIZATION
  let canCreateData = user?.permissions?.canCreateData
  let canMoveAssets = user?.permissions?.canMoveAssets

  let [submitting, setSubmitting] = useState(false)
  let [equipments, setEquipments] = useState([])
  let [nAvailable, setNAvailable] = useState(0)
  let [nAssigned, setNAssigned] = useState(0)
  let [nStandby, setNStandby] = useState(0)
  let [nInWorkshop, setNInWorkshop] = useState(0)
  let [nDisposed, setNDisposed] = useState(0)
  let [nInTechnicalInsp, setNInTechnicalInsp] = useState(0)
  let [nDispatched, setNDispatched] = useState(0)
  let [ogEquipmentList, setOgEquipmentList] = useState([])
  let [viewPort, setViewPort] = useState('list')
  let [search, setSearch] = useState('')
  let [loading, setLoading] = useState(false)
  let [statusFilter, setStatusFilter] = useState('')
  let [filterBy, setFilterBy] = useState('all')
  let [dataFound, setDataFound] = useState(false)
  let [nRecords, setNRecords] = useState(-1)

  let [plateNumber, setPlateNumber] = useState('')
  let [eqDescription, setEqDescription] = useState('')

  let [assetClass, setAsseClass] = useState('')
  let [eqtype, setEqType] = useState('')
  let [eqOwner, setEqOwner] = useState('')
  let [eqStatus, setEqStatus] = useState('')
  let [rate, setRate] = useState(0)
  let [supplierRate, setSupplierRate] = useState(0)
  let [uom, setUom] = useState('')
  let [effectiveDate, setEffectiveDate] = useState(null)

  let [downloadingData, setDownloadingData] = useState(false)

  let [idToUpdate, setIdToUpdate] = useState('')

  let [rowId, setRowId] = useState()
  let [sendToWorkshopModalIsShown, setSendToWorkshopModalIsShown] =
    useState(false)
  let [makeAvailableModalIsShown, setMakeAvailableModalIsShown] =
    useState(false)

  let [disposeModalIsShown, setDisposeModalIsShown] = useState(false)

  let [vendorOptions, setVendorOptions] = useState([])

  const [openDrawer, setOpenDrawer] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [activityLog, setActivityLog] = useState(null)

  let url = process.env.NEXT_PUBLIC_BKEND_URL
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

  let assetClassOptions = [
    { key: 1, text: 'OTHER MACHINES', value: 'OTHER MACHINES' },
    { key: 2, text: 'CONSTRUCTION MACHINE', value: 'CONSTRUCTION MACHINE' },
    { key: 3, text: 'SPECIALIZED TRUCK', value: 'SPECIALIZED TRUCK' },
    { key: 4, text: 'TRUCKS', value: 'TRUCKS' },
    { key: 5, text: 'JAC', value: 'JAC' },
    { key: 6, text: 'DUMP TRUCK', value: 'DUMP TRUCK' },
    { key: 7, text: 'TRAILER TRUCK', value: 'TRAILER TRUCK' },
    { key: 8, text: 'HOWO TRAILER TRUCKS', value: 'HOWO TRAILER TRUCKS' },
  ]

  let equipmentTypeOptions = [
    { key: 1, text: 'AIR COMPRESSOR', value: 'AIR COMPRESSOR' },
    { key: 2, text: 'ASPHALT PAVER MACHINE', value: 'ASPHALT PAVER MACHINE' },
    { key: 3, text: 'BACKHOE LOADER', value: 'BACKHOE LOADER' },
    { key: 4, text: 'BITUMEN SPRAYER', value: 'BITUMEN SPRAYER' },
    { key: 5, text: 'BULLDOZER', value: 'BULLDOZER' },
    { key: 6, text: 'CONCRETE MIXER TRUCK', value: 'CONCRETE MIXER TRUCK' },
    { key: 7, text: 'CRANE TRUCKS', value: 'CRANE TRUCKS' },
    { key: 8, text: 'DRILLING MACHINE', value: 'DRILLING MACHINE' },
    { key: 9, text: 'DUMPER', value: 'DUMPER' },
    { key: 10, text: 'EXCAVATOR', value: 'EXCAVATOR' },
    { key: 11, text: 'FOLK LIFT', value: 'FOLK LIFT' },
    { key: 12, text: 'FOOT SMALL ROLLER', value: 'FOOT SMALL ROLLER' },
    { key: 13, text: 'FUEL TANK TRUCK', value: 'FUEL TANK TRUCK' },
    { key: 14, text: 'IVECO', value: 'IVECO' },
    { key: 15, text: 'MILLING MACHINE', value: 'MILLING MACHINE' },
    { key: 16, text: 'MOTOR GRADER', value: 'MOTOR GRADER' },
    {
      key: 17,
      text: 'PNEUMATIC ASPHALT COMPACTOR',
      value: 'PNEUMATIC ASPHALT COMPACTOR',
    },
    {
      key: 27,
      text: 'DOUBLE DRUM ASPHALT COMPACTOR',
      value: 'DOUBLE DRUM ASPHALT COMPACTOR',
    },
    { key: 18, text: 'SOIL COMPACTOR', value: 'SOIL COMPACTOR' },
    { key: 19, text: 'STUMPER', value: 'STUMPER' },
    { key: 20, text: 'TIPPER TRUCK', value: 'TIPPER TRUCK' },
    { key: 21, text: 'LOWBED', value: 'LOWBED' },
    { key: 22, text: 'WALK-BEHIND', value: 'WALK-BEHIND' },
    { key: 23, text: 'WATER TANK TRUCK', value: 'WATER TANK TRUCK' },
    { key: 24, text: 'WHEEL LOADER', value: 'WHEEL LOADER' },
    { key: 25, text: 'CONCRETE PUMP', value: 'CONCRETE PUMP' },
    { key: 26, text: 'PICK UP', value: 'PICK UP' },
    {
      key: 28,
      text: 'MILK TANK TRUCK',
      value: 'MILK TANK TRUCK',
    },
    {
      key: 29,
      text: 'MILK MINI-TRUCK',
      value: 'MILK MINI-TRUCK',
    },
    {
      key: 30,
      text: 'SMALL TRUCK',
      value: 'SMALL TRUCK',
    },
    {
      key: 31,
      text: 'MEDIUM CONTAINER TRUCK',
      value: 'MEDIUM CONTAINER TRUCK',
    },
    {
      key: 32,
      text: 'FLATBED',
      value: 'FLATBED',
    },
    {
      key: 33,
      text: 'TRAILER',
      value: 'TRAILER',
    },
  ]

  let assetTypeOptions = [
    { key: 1, text: 'Machine', value: 'Machine' },
    { key: 2, text: 'Truck', value: 'Truck' },
  ]

  useEffect(() => {
    setLoading(true)
    refresh()
    getListOfOwners()
  }, [])

  useEffect(() => {
    setLoading(true)
    if (search.length >= 3) {
      let eqList = equipments.filter((w) => {
        let _search = search?.toLocaleLowerCase()
        let plateNumber = w?.plateNumber?.toLocaleLowerCase()
        let assetType = w?.eqDescription.toLocaleLowerCase()

        return plateNumber.includes(_search) || assetType.includes(_search)
      })
      setEquipments(eqList)
      setLoading(false)
    }

    if (search.length < 3) {
      setEquipments(ogEquipmentList)
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    if (viewPort !== 'change') {
      setPlateNumber('')
      setEqDescription('')
      setAsseClass('')
      setEqType('')
      setEqOwner('')
      setRate(0)
      setSupplierRate(0)
      setUom('')
    }
  }, [viewPort])

  useEffect(() => {
    setLoadingActivity(true)
    // if (viewRow?.length > 12)
    fetch(`${url}/logs/filtered?plateNumber=${viewRow}`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
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

  function getListOfOwners() {
    let construckEntry = [
      {
        key: 111,
        text: 'Construck',
        value: 'Construck',
      },
    ]
    fetch(`${url}/vendors`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let _vOptions = res.map((vendor) => {
          return {
            key: vendor._id,
            text: vendor.name,
            value: vendor.name,
          }
        })

        setVendorOptions(construckEntry.concat(_vOptions))
      })
      .catch((err) => {})
  }

  function onCloseDrawer() {
    setOpenDrawer(false)
    setViewRow(null)
  }

  function refresh() {
    setLoading(true)
    setPlateNumber('')
    setEqDescription('')
    setAsseClass('')
    setEqType('')
    setEqOwner('')
    setRate(0)
    setSupplierRate(0)
    setUom('')
    fetch(`${url}/equipments/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let eqs = res?.equipments
        let nEqs = res.nrecords
        setNRecords(nEqs)

        let availableEq = res?.available
        let assignedEq = 0
        let dispatchedEq = res?.dispatched
        let inWorkshopEq = res?.workshop
        let onStandby = res?.standby
        let disposed = res?.disposed
        let inCT = res?.ct

        setNAssigned(assignedEq)
        setNAvailable(availableEq)
        setNDispatched(dispatchedEq)
        setNInWorkshop(inWorkshopEq)
        setNStandby(onStandby)
        setNDisposed(disposed)
        setNInTechnicalInsp(inCT)
        setOgEquipmentList(eqs)
        setEquipments(eqs)

        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        toast.error('Error occured!')
      })
  }

  async function readFromFile(file) {
    setLoading(true)
    let promises = []
    readXlsxFile(file)
      .then((rows) => {
        rows.forEach((row) => {
          let promise = fetch(`${url}/equipments/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
            body: JSON.stringify({
              plateNumber: row[2],
              eqtype: row[5],
              eqStatus: 'standby',
              rate: row[6],
              uom: row[7],
              eqOwner: row[8],
              eqDescription: row[1],
              assetClass: row[4],
              vendorRate: row[9],
              vendor: row[10],
            }),
          })

          promises.push(promise)
        })
      })
      .finally(() => {
        Promise.all(promises)
          .then((res) => {
            refresh()
            setLoading(false)
          })
          .finally(() => {
            refresh()
          })
          .catch((err) => {})
      })
      .catch((err) => {})
  }

  useEffect(() => {
    let _eqList = [...ogEquipmentList]
    setEquipments(
      statusFilter !== 'all'
        ? statusFilter !== 'available'
          ? _eqList.filter((e) => e.eqStatus === statusFilter)
          : _eqList.filter(
              (e) => e.eqStatus === 'standby' || e.eqStatus === 'dispatched'
            )
        : ogEquipmentList
    )
  }, [statusFilter])

  useEffect(() => {
    if (filterBy === statusFilter) {
      setStatusFilter('all')
    } else setStatusFilter(filterBy)
  }, [filterBy])

  function sendToWorkShop() {
    // let _eqs = [...equipments]
    // let indexToUpdate = 0
    // let eqToUpdate = _eqs.find((e, index) => {
    //   indexToUpdate = index
    //   return e._id == rowId
    // })
    // eqToUpdate.eqStatus = 'updating'
    // _eqs[indexToUpdate] = eqToUpdate
    // setEquipments(_eqs)
    // fetch(`${url}/equipments/sendToWorkshop/${rowId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     let _eqs = [...equipments]
    //     let indexToUpdate = 0
    //     let eqToUpdate = _eqs.find((e, index) => {
    //       indexToUpdate = index
    //       return e._id == rowId
    //     })
    //     eqToUpdate.eqStatus = 'workshop'
    //     _eqs[indexToUpdate] = eqToUpdate
    //     setEquipments(_eqs)
    //     // setOgEquipmentList(_eqs)
    //     let availableEq = equipments.filter((e) => e.eqStatus === 'standby')
    //     let assignedEq = equipments.filter((e) => e.eqStatus === 'dispatched')
    //     let dispatchedEq = equipments.filter((e) => e.eqStatus === 'dispatched')
    //     let inWorkshopEq = equipments.filter((e) => e.eqStatus === 'workshop')
    //     let disposed = equipments.filter((e) => e.eqStatus === 'disposed')
    //     setNAssigned(assignedEq.length)
    //     setNAvailable(availableEq.length)
    //     setNDispatched(dispatchedEq.length)
    //     setNInWorkshop(inWorkshopEq.length)
    //     setNDisposed(disposed.length)
    //   })
    //   .catch((err) => {})
  }

  function makeAvailable() {
    // let _eqs = [...equipments]
    // let indexToUpdate = 0
    // let eqToUpdate = _eqs.find((e, index) => {
    //   indexToUpdate = index
    //   return e._id == rowId
    // })
    // eqToUpdate.eqStatus = 'updating'
    // _eqs[indexToUpdate] = eqToUpdate
    // setEquipments(_eqs)
    // fetch(`${url}/equipments/makeAvailable/${rowId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     let _eqs = [...equipments]
    //     let indexToUpdate = 0
    //     let eqToUpdate = _eqs.find((e, index) => {
    //       indexToUpdate = index
    //       return e._id == rowId
    //     })
    //     eqToUpdate.eqStatus = 'standby'
    //     _eqs[indexToUpdate] = eqToUpdate
    //     setEquipments(_eqs)
    //     // setOgEquipmentList(_eqs)
    //     let availableEq = equipments.filter((e) => e.eqStatus === 'standby')
    //     let assignedEq = equipments.filter((e) => e.eqStatus === 'dispatched')
    //     let dispatchedEq = equipments.filter((e) => e.eqStatus === 'dispatched')
    //     let inWorkshopEq = equipments.filter((e) => e.eqStatus === 'workshop')
    //     let disposed = equipments.filter((e) => e.eqStatus === 'disposed')
    //     setNAssigned(assignedEq.length)
    //     setNAvailable(availableEq.length)
    //     setNDispatched(dispatchedEq.length)
    //     setNInWorkshop(inWorkshopEq.length)
    //     setNDisposed(disposed.length)
    //   })
  }

  function disposeEquipment() {
    let _eqs = [...equipments]
    let indexToUpdate = 0
    let eqToUpdate = _eqs.find((e, index) => {
      indexToUpdate = index
      return e._id == rowId
    })
    eqToUpdate.eqStatus = 'updating'
    _eqs[indexToUpdate] = eqToUpdate
    setEquipments(_eqs)

    fetch(`${url}/equipments/dispose/${rowId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let _eqs = [...equipments]
        let indexToUpdate = 0
        let eqToUpdate = _eqs.find((e, index) => {
          indexToUpdate = index
          return e._id == rowId
        })
        eqToUpdate.eqStatus = 'disposed'
        _eqs[indexToUpdate] = eqToUpdate
        setEquipments(_eqs)
        // setOgEquipmentList(_eqs)
        let availableEq = equipments.filter((e) => e.eqStatus === 'standby')
        let assignedEq = equipments.filter((e) => e.eqStatus === 'dispatched')
        let dispatchedEq = equipments.filter((e) => e.eqStatus === 'dispatched')
        let inWorkshopEq = equipments.filter((e) => e.eqStatus === 'workshop')
        let disposed = equipments.filter((e) => e.eqStatus === 'disposed')

        setNAssigned(assignedEq.length)
        setNAvailable(availableEq.length)
        setNDispatched(dispatchedEq.length)
        setNInWorkshop(inWorkshopEq.length)
        setNDisposed(disposed.length)
      })
  }

  function _setToWorkshopRow(id) {
    setRowId(id)
    setSendToWorkshopModalIsShown(true)
  }

  function _setMakeAvailableRow(id) {
    setRowId(id)
    setMakeAvailableModalIsShown(true)
  }

  function _setDisposeRow(id) {
    setRowId(id)
    setDisposeModalIsShown(true)
  }

  function createEquipment() {
    setSubmitting(true)
    fetch(`${url}/equipments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        plateNumber,
        eqDescription,
        assetClass,
        eqtype,
        eqOwner,
        eqStatus: 'standby',
        rate,
        supplierRate,
        uom,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast.error(res.error)
          setSubmitting(false)
        } else {
          refresh()
          setSubmitting(false)
          setViewPort('list')
        }
      })
      .catch((err) => {
        setSubmitting(false)
      })
  }

  function _setToChange(data) {
    setIdToUpdate(data.id)
    setPlateNumber(data.plateNumber)
    setRate(data.rate)
    setSupplierRate(data.supplierRate)
    setEqDescription(data.description)
    setAsseClass(data.assetClass)
    setEqType(data.eqType)
    setUom(data.uom)
    setViewPort('change')
  }

  function updateEquipment() {
    setSubmitting(true)
    fetch(`${url}/equipments/${idToUpdate}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        plateNumber,
        eqDescription,
        assetClass,
        eqtype,
        eqOwner,
        rate,
        supplierRate,
        uom,
        effectiveDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast.error(res.error)
          setSubmitting(false)
        } else {
          refresh()
          setSubmitting(false)
          setViewPort('list')
        }
      })
      .catch((err) => {
        setSubmitting(false)
      })
  }

  function download() {
    setDownloadingData(true)

    fetch(`${url}/equipments/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let data = res['equipments'].map((w) => {
          {
            return {
              'Plate number': w.plateNumber,
              'Equipment type': w.eqDescription,
              'Asset class': w.assetClass,
              'Equipment category': w.eqtype,
              Owner: w.eqOwner,
              Status: w.eqStatus,
              Rate: w.rate,
              'Supplier rate': w.supplierRate,
              'Unit of measurement': w.uom,
              'On site work?': w.assignedToSiteWork ? 'Yes' : 'No',
              'Millage or Index': w.millage,
            }
          }
        })

        exportToCSV(
          data,
          `Equipment List ${moment().format('DD-MMM-YYYY HH:mm:ss')}`
        )

        setDownloadingData(false)
      })
      .catch((err) => {
        setLoading(false)
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
    //   _siteWorkDetails,
    //   `Detailed Site works ${moment().format('DD-MMM-YYYY HH-mm-ss')}`
    // )
  }

  return (
    <>
      {sendToWorkshopModalIsShown && (
        <Modal
          title="Send to Workshop"
          body="Are you sure you want to send this asset to workshop?"
          isShown={sendToWorkshopModalIsShown}
          setIsShown={setSendToWorkshopModalIsShown}
          handleConfirm={sendToWorkShop}
        />
      )}

      {makeAvailableModalIsShown && (
        <Modal
          title="Make asset available"
          body="Are you sure you want to move this asset from the workshop?"
          isShown={makeAvailableModalIsShown}
          setIsShown={setMakeAvailableModalIsShown}
          handleConfirm={makeAvailable}
        />
      )}

      {disposeModalIsShown && (
        <Modal
          title="Dispose asset."
          body="Are you sure you want to dispose this asset?"
          isShown={disposeModalIsShown}
          setIsShown={setDisposeModalIsShown}
          handleConfirm={disposeEquipment}
        />
      )}
      <div className="my-5 flex flex-col space-y-5 px-10">
        <div className="text-2xl font-semibold">Equipment</div>
        <div className="flex w-full flex-row items-center justify-between space-x-4">
          {viewPort === 'list' && canCreateData && (
            <MSubmitButton
              submit={() => setViewPort('new')}
              intent="primary"
              icon={<PlusIcon className="h-5 w-5 text-zinc-800" />}
              label="New"
            />
          )}

          {viewPort === 'list' && (
            <div className="mx-auto flex flex-grow flex-col">
              <TextInput placeholder="Search..." setValue={setSearch} />
            </div>
          )}

          {(viewPort === 'new' || viewPort === 'change') && (
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
              <EqStatusCard
                data={{ title: 'Available', content: nAvailable }}
                intent={
                  filterBy === 'available' || filterBy === 'all'
                    ? 'available'
                    : ''
                }
                icon={<CheckIcon className="h-4 w-4" />}
                onClick={() =>
                  filterBy === 'available'
                    ? setFilterBy('all')
                    : setFilterBy('available')
                }
              />

              <EqStatusCard
                data={{ title: 'Dispatched', content: nDispatched }}
                intent={
                  filterBy === 'dispatched' || filterBy === 'all'
                    ? 'dispatched'
                    : ''
                }
                icon={<ExclamationTriangleIcon className="h-4 w-4" />}
                onClick={() =>
                  filterBy === 'dispatched'
                    ? setFilterBy('all')
                    : setFilterBy('dispatched')
                }
              />

              <EqStatusCard
                data={{ title: 'Standby', content: nStandby }}
                intent={
                  filterBy === 'standby' || filterBy === 'all' ? 'standby' : ''
                }
                icon={<TruckIcon className="h-4 w-4" />}
                onClick={() =>
                  filterBy === 'standby'
                    ? setFilterBy('all')
                    : setFilterBy('standby')
                }
              />

              <EqStatusCard
                data={{ title: 'Workshop', content: nInWorkshop }}
                intent={
                  filterBy === 'workshop' || filterBy === 'all'
                    ? 'workshop'
                    : ''
                }
                icon={<CogIcon className="h-4 w-4" />}
                onClick={() =>
                  filterBy === 'workshop'
                    ? setFilterBy('all')
                    : setFilterBy('workshop')
                }
              />

              <EqStatusCard
                data={{ title: 'Disposed', content: nDisposed }}
                intent={
                  filterBy === 'disposed' || filterBy === 'all'
                    ? 'disposed'
                    : ''
                }
                icon={<ArchiveBoxXMarkIcon className="h-4 w-4" />}
                onClick={() =>
                  filterBy === 'disposed'
                    ? setFilterBy('all')
                    : setFilterBy('disposed')
                }
              />

              <EqStatusCard
                data={{ title: 'Technical Insp.', content: nInTechnicalInsp }}
                intent={
                  filterBy === 'technicalInsp' || filterBy === 'all'
                    ? 'technicalInsp'
                    : ''
                }
                icon={<ShieldCheckIcon className="h-4 w-4" />}
                onClick={() =>
                  filterBy === 'ct' ? setFilterBy('all') : setFilterBy('ct')
                }
              />

              {/* Available */}
              {/* <div
                className={
                  filterBy === 'available'
                    ? 'cursor-pointer rounded-lg p-1 font-normal'
                    : 'cursor-pointer rounded-lg p-1 font-normal'
                }
                onClick={() =>
                  filterBy === 'available'
                    ? setFilterBy('all')
                    : setFilterBy('available')
                }
              >
                <Tooltip title="Available">
                  <div
                    className={
                      filterBy !== 'standby'
                        ? 'flex flex-row items-center rounded-lg p-1 text-green-400 shadow-md ring-1 ring-green-100'
                        : 'flex flex-row items-center rounded-lg bg-green-50 p-1 text-green-600 ring-1 ring-green-400'
                    }
                  >
                    <CheckIcon className="h-5 w-5" />
                    <div>({nAvailable})</div>
                  </div>
                </Tooltip>
              </div> */}

              {/* Dispatched */}
              {/* <div
                className={
                  filterBy === 'dispatched'
                    ? 'cursor-pointer rounded-lg p-1 font-normal'
                    : 'cursor-pointer rounded-lg p-1 font-normal'
                }
                onClick={() =>
                  filterBy === 'dispatched'
                    ? setFilterBy('all')
                    : setFilterBy('dispatched')
                }
              >
                <Tooltip title="Dispatched">
                  <div
                    className={
                      filterBy !== 'dispatched'
                        ? 'flex flex-row items-center rounded-lg p-1 text-zinc-500 shadow-md ring-1 ring-zinc-100'
                        : 'flex flex-row items-center rounded-lg bg-zinc-100 p-1 text-zinc-600 ring-1 ring-zinc-300'
                    }
                  >
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    <div>({nDispatched})</div>
                  </div>
                </Tooltip>
              </div> */}

              {/* Standby */}
              {/* <div
                className={
                  filterBy === 'standby'
                    ? 'cursor-pointer rounded-lg p-1 font-normal'
                    : 'cursor-pointer rounded-lg p-1 font-normal'
                }
                onClick={() =>
                  filterBy === 'standby'
                    ? setFilterBy('all')
                    : setFilterBy('standby')
                }
              >
                <Tooltip title="Stand by">
                  <div
                    className={
                      filterBy !== 'standby'
                        ? 'flex flex-row items-center rounded-lg p-1 text-orange-300 shadow-md ring-1 ring-orange-100'
                        : 'flex flex-row items-center rounded-lg bg-orange-50 p-1 text-orange-400 ring-1 ring-orange-300'
                    }
                  >
                    <LockClosedIcon className="h-5 w-5" />
                    <div>({nStandby})</div>
                  </div>
                </Tooltip>
              </div> */}

              {/* Workshop */}
              {/* <div
                className={
                  filterBy === 'workshop'
                    ? 'cursor-pointer rounded-lg p-1 font-normal'
                    : 'cursor-pointer rounded-lg p-1 font-normal'
                }
                onClick={() =>
                  filterBy === 'workshop'
                    ? setFilterBy('all')
                    : setFilterBy('workshop')
                }
              >
                <Tooltip title="In workshop">
                  <div
                    className={
                      filterBy !== 'workshop'
                        ? 'flex flex-row items-center rounded-lg p-1 text-red-300 shadow-md ring-1 ring-red-100'
                        : 'flex flex-row items-center rounded-lg bg-red-50 p-1 text-red-400 ring-1 ring-red-300'
                    }
                  >
                    <CogIcon className="h-5 w-5" />
                    <div>({nInWorkshop})</div>
                  </div>
                </Tooltip>
              </div> */}

              {/* <AdjustmentsIcon className="h-5 w-5 cursor-pointer text-red-500" /> */}

              {canCreateData && (
                <div>
                  <label>
                    <span className="mt-2 cursor-pointer text-base leading-normal">
                      <ArrowUpTrayIcon className="h-5 w-5" />
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        readFromFile(e.target.files[0])
                      }}
                    />
                  </label>
                </div>
              )}

              {downloadingData ? (
                <div>
                  <Loader active size="tiny" inline className="ml-5" />
                </div>
              ) : (
                <ArrowDownTrayIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => download()}
                />
              )}

              {/* <ArrowDownTrayIcon className="h-5 w-5 cursor-pointer" /> */}
              {/* <DocumentDuplicateIcon className="h-5 w-5 cursor-pointer" /> */}
              <MSubmitButton
                submit={refresh}
                intent="neutral"
                icon={<ArrowPathIcon className="h-5 w-5 text-zinc-800" />}
                label="Refresh"
              />
            </div>
          )}
        </div>
        {viewPort === 'list' && (
          <>
            {loading || nRecords < 0 ? (
              <Loader active />
            ) : (
              <div className="grid gap-x-3 gap-y-5 sm:grid-cols-2 md:grid-cols-5 md:gap-y-6">
                {equipments.map((e) => {
                  return (
                    <EquipmentCard
                      data={{
                        eqOwner: e.eqOwner,
                        plateNumber: e.plateNumber,
                        eqType: e.eqtype,
                        eqStatus: e.eqStatus,
                        description: e.eqDescription,
                        id: e._id,
                        rate: e.rate,
                        supplierRate: e.supplierRate,
                        assetClass: e.assetClass,
                        uom: e.uom,
                      }}
                      intent={e.eqOwner === 'Construck' ? e.eqStatus : 'hired'}
                      handleSendToWorkshop={_setToWorkshopRow}
                      handleMakeAvailable={_setMakeAvailableRow}
                      handleDispose={_setDisposeRow}
                      handleChange={_setToChange}
                      canMoveAssets={canMoveAssets}
                      canCreateData={canCreateData}
                      handleOpenDrawer={setOpenDrawer}
                      handleViewRow={setViewRow}
                    />
                  )
                })}
              </div>
            )}
          </>
        )}

        {viewPort === 'new' && (
          <div className="flex items-start">
            <div className="flex flex-col space-y-5">
              <div className="grid-col grid grid-cols-2 gap-5">
                {/* Inputs col1 */}
                <div className="flex flex-col items-start space-y-5">
                  {/* Plate number */}
                  <TextInputLogin
                    label="Plate number"
                    placeholder="RAA 000 D"
                    type="text"
                    setValue={setPlateNumber}
                    isRequired
                  />

                  {/* Eq Description */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Equipment Type" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={equipmentTypeOptions}
                      placeholder="Select equipment type"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        setEqDescription(data.value)
                      }}
                    />
                  </div>

                  {/* Asset Class */}

                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Asset Class" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={assetClassOptions}
                      placeholder="Select asset class"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        setAsseClass(data.value)
                      }}
                    />
                  </div>

                  {/* Eq Type */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Asset Type" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={assetTypeOptions}
                      placeholder="Select asset type"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        setEqType(data.value)
                      }}
                    />
                  </div>

                  {/* Eq Owner */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Equipment Owner" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={vendorOptions}
                      placeholder="Select Owner"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        setEqOwner(data.value)
                      }}
                    />
                  </div>
                </div>
                {/* Inputs col2*/}
                <div className="flex flex-col space-y-5">
                  {/* Rate */}
                  <TextInputLogin
                    label="Rate"
                    placeholder="rate"
                    type="number"
                    setValue={setRate}
                    isRequired
                  />

                  {/* Supplier rate */}
                  <TextInputLogin
                    label="Supplier Rate"
                    placeholder="supplier rate"
                    type="number"
                    setValue={setSupplierRate}
                  />

                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Unit of measurement" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={[
                        { key: 1, text: 'Hour', value: 'hour' },
                        { key: 1, text: 'Day', value: 'day' },
                      ]}
                      placeholder="Select UoM"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        setUom(data.value)
                      }}
                    />
                  </div>
                </div>
              </div>

              {plateNumber.length > 1 &&
                eqtype.length > 1 &&
                assetClass.length > 1 &&
                eqDescription.length > 1 &&
                eqOwner.length > 1 &&
                rate >= 1 &&
                uom.length > 1 && (
                  <div>
                    {submitting ? (
                      <Loader inline size="small" active />
                    ) : (
                      <MSubmitButton submit={createEquipment} />
                    )}
                  </div>
                )}
            </div>
          </div>
        )}

        {viewPort === 'change' && (
          <div className="flex items-start">
            <div className="flex flex-col space-y-5">
              <div className="grid-col grid grid-cols-2 gap-5">
                {/* Inputs col1 */}
                <div className="flex flex-col items-start space-y-5">
                  {/* Plate number */}
                  <TextInputLogin
                    label="Plate number"
                    placeholder="RAA 000 D"
                    type="text"
                    value={plateNumber}
                    setValue={setPlateNumber}
                    isRequired
                  />

                  {/* Eq Description */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Equipment Type" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={equipmentTypeOptions}
                      placeholder="Select equipment type"
                      fluid
                      search
                      selection
                      value={eqDescription}
                      onChange={(e, data) => {
                        setEqDescription(data.value)
                      }}
                    />
                  </div>

                  {/* Asset Class */}

                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Asset Class" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={assetClassOptions}
                      placeholder="Select asset class"
                      fluid
                      search
                      selection
                      value={assetClass}
                      onChange={(e, data) => {
                        setAsseClass(data.value)
                      }}
                    />
                  </div>

                  {/* Eq Type */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Asset Type" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={assetTypeOptions}
                      placeholder="Select asset type"
                      fluid
                      search
                      selection
                      value={eqtype}
                      onChange={(e, data) => {
                        setEqType(data.value)
                      }}
                    />
                  </div>

                  {/* Eq Owner */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Equipment Owner" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={vendorOptions}
                      placeholder="Select Owner"
                      fluid
                      search
                      selection
                      value={eqOwner}
                      onChange={(e, data) => {
                        setEqOwner(data.value)
                      }}
                    />
                  </div>
                </div>
                {/* Inputs col2*/}
                <div className="flex flex-col space-y-5">
                  {/* Rate */}
                  <TextInputLogin
                    label="Rate"
                    placeholder="rate"
                    type="number"
                    value={rate}
                    setValue={setRate}
                    isRequired
                  />

                  {/* Supplier rate */}
                  <TextInputLogin
                    label="Supplier Rate"
                    placeholder="supplier rate"
                    type="number"
                    setValue={setSupplierRate}
                    value={supplierRate}
                  />

                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Unit of measurement" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={[
                        { key: 1, text: 'Hour', value: 'hour' },
                        { key: 1, text: 'Day', value: 'day' },
                      ]}
                      placeholder="Select UoM"
                      fluid
                      search
                      selection
                      value={uom}
                      onChange={(e, data) => {
                        setUom(data.value)
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Effective date" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <DatePicker
                      size={20}
                      defaultValue={moment()}
                      onChange={(date, dateString) => {
                        setEffectiveDate(dateString)
                      }}
                    />
                  </div>
                </div>
              </div>

              {plateNumber.length > 1 &&
                eqtype.length > 1 &&
                assetClass.length > 1 &&
                eqDescription.length > 1 &&
                eqOwner.length > 1 &&
                rate >= 1 &&
                effectiveDate &&
                uom.length > 1 && (
                  <div>
                    {submitting ? (
                      <Loader inline size="small" active />
                    ) : (
                      <MSubmitButton submit={updateEquipment} />
                    )}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />

      <Drawer title={`Activity log`} onClose={onCloseDrawer} open={openDrawer}>
        {activityLog && !loadingActivity && (
          <>
            {activityLog?.map((activity) => {
              return (
                <div className="my-5 rounded border-2 p-2 text-xs">
                  <div>Action: {activity?._id?.action?.toLowerCase()}</div>
                  <div>
                    Project: {activity?._id?.payload?.project?.prjDescription}
                  </div>
                  <div>
                    Dispatch Date:{' '}
                    {moment(activity?._id?.payload?.dispatch?.date).format(
                      'DD-MMM-YYYY'
                    )}
                  </div>
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
