import {
  AdjustmentsIcon,
  ArrowLeftIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  DownloadIcon,
  PlusIcon,
  RefreshIcon,
  UploadIcon,
} from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import EquipmentCard from '../common/equipmentCard'
import MSubmitButton from '../common/mSubmitButton'
import TextInput from '../common/TextIput'
import readXlsxFile from 'read-excel-file'
import { Loader } from 'semantic-ui-react'
import { Tooltip } from 'antd'
import { ExclamationIcon, LockClosedIcon } from '@heroicons/react/solid'

export default function Equipments() {
  let [equipments, setEquipments] = useState([])
  let [nAvailable, setNAvailable] = useState(0)
  let [nAssigned, setNAssigned] = useState(0)
  let [nDispatched, setNDispatched] = useState(0)
  let [ogEquipmentList, setOgEquipmentList] = useState([])
  let [viewPort, setViewPort] = useState('list')
  let [search, setSearch] = useState('')
  let [loading, setLoading] = useState(true)
  let [statusFilter, setStatusFilter] = useState('')
  let [filterBy, setFilterBy] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('https://construck-backend.herokuapp.com/equipments/')
      .then((res) => res.json())
      .then((res) => {
        setEquipments(res)

        let availableEq = res.filter((e) => e.eqStatus === 'available')
        let assignedEq = res.filter((e) => e.eqStatus === 'assigned to job')
        let dispatchedEq = res.filter((e) => e.eqStatus === 'dispatched')

        setNAssigned(assignedEq.length)
        setNAvailable(availableEq.length)
        setNDispatched(dispatchedEq.length)
        setOgEquipmentList(res)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    if (search.length >= 3) {
      let eqList = equipments.filter((w) => {
        let _search = search?.toLocaleLowerCase()
        let plateNumber = w?.plateNumber?.toLocaleLowerCase()

        return plateNumber.includes(_search)
      })
      setEquipments(eqList)
      setLoading(false)
    }

    if (search.length < 3) {
      setEquipments(ogEquipmentList)
      setLoading(false)
    }
  }, [search])

  function refresh() {
    setLoading(true)
    fetch('https://construck-backend.herokuapp.com/equipments/')
      .then((res) => res.json())
      .then((res) => {
        setEquipments(res)
        let availableEq = res.filter((e) => e.eqStatus === 'available')
        let assignedEq = res.filter((e) => e.eqStatus === 'assigned to job')
        let dispatchedEq = res.filter((e) => e.eqStatus === 'dispatched')

        setNAssigned(assignedEq.length)
        setNAvailable(availableEq.length)
        setNDispatched(dispatchedEq.length)
        setOgEquipmentList(res)
        setLoading(false)
      })
  }

  async function readFromFile(file) {
    setLoading(true)
    let promises = []
    readXlsxFile(file)
      .then((rows) => {
        console.log(rows)
        rows.forEach((row) => {
          let promise = fetch(
            'https://construck-backend.herokuapp.com/equipments/',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                plateNumber: row[2],
                eqtype: row[5],
                eqStatus: 'available',
                rate: row[6],
                uom: row[7],
                eqOwner: row[8],
                eqDescription: row[1],
                assetClass: row[4],
                supplierRate: row[9],
              }),
            }
          )

          promises.push(promise)
        })
      })
      .finally(() => {
        Promise.all(promises)
          .then((res) => {
            console.log(res)
            refresh()
            setLoading(false)
          })
          .finally(() => {
            refresh()
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    let _eqList = [...ogEquipmentList]
    setEquipments(
      statusFilter !== 'all'
        ? _eqList.filter((e) => e.eqStatus === statusFilter)
        : ogEquipmentList
    )
  }, [statusFilter])

  useEffect(() => {
    if (filterBy === statusFilter) {
      setStatusFilter('all')
    } else setStatusFilter(filterBy)
  }, [filterBy])

  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      <div className="text-2xl font-semibold">Equipments</div>
      <div className="flex w-full flex-row items-center justify-between space-x-4">
        {viewPort === 'list' && (
          <MSubmitButton
            submit={() => setViewPort('new')}
            intent="primary"
            icon={<PlusIcon className="h-5 w-5 text-zinc-800" />}
            label="New"
          />
        )}

        {viewPort === 'list' && (
          <div className="mx-auto flex flex-grow flex-col px-40">
            <TextInput placeholder="Search..." setValue={setSearch} />
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
            <div
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
                    filterBy !== 'available'
                      ? 'flex flex-row items-center rounded-lg p-1 text-green-400 shadow-md ring-1 ring-green-100'
                      : 'flex flex-row items-center rounded-lg bg-green-50 p-1 text-green-600 ring-1 ring-green-400'
                  }
                >
                  <CheckIcon className="h-5 w-5" />
                  <div>({nAvailable})</div>
                </div>
              </Tooltip>
            </div>
            <div
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
                  <ExclamationIcon className="h-5 w-5" />
                  <div>({nDispatched})</div>
                </div>
              </Tooltip>
            </div>

            <div
              className={
                filterBy === 'assigned to job'
                  ? 'cursor-pointer rounded-lg p-1 font-normal'
                  : 'cursor-pointer rounded-lg p-1 font-normal'
              }
              onClick={() =>
                filterBy === 'assigned to job'
                  ? setFilterBy('all')
                  : setFilterBy('assigned to job')
              }
            >
              <Tooltip title="Busy">
                <div
                  className={
                    filterBy !== 'assigned to job'
                      ? 'flex flex-row items-center rounded-lg p-1 text-red-300 shadow-md ring-1 ring-red-100'
                      : 'flex flex-row items-center rounded-lg bg-red-50 p-1 text-red-400 ring-1 ring-red-300'
                  }
                >
                  <LockClosedIcon className="h-5 w-5" />
                  <div>({nAssigned})</div>
                </div>
              </Tooltip>
            </div>
            <AdjustmentsIcon className="h-5 w-5 cursor-pointer text-red-500" />
            <div>
              <label>
                <span className="mt-2 cursor-pointer text-base leading-normal">
                  <UploadIcon className="h-5 w-5" />
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

            <DownloadIcon className="h-5 w-5 cursor-pointer" />
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
      {viewPort === 'list' && (
        <>
          {loading && (
            <div className="h-fu mx-auto">
              <Loader active />
            </div>
          )}
          {!loading && (
            <div className="grid gap-x-3 gap-y-5 sm:grid-cols-2 md:grid-cols-6 md:gap-y-6">
              {equipments.map((e) => {
                return (
                  <EquipmentCard
                    data={{
                      eqOwner: e.eqOwner,
                      plateNumber: e.plateNumber,
                      eqType: e.eqtype,
                      eqStatus: e.eqStatus,
                      description: e.eqDescription,
                    }}
                    intent={e.eqStatus}
                  />
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
