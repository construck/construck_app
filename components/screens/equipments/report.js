import React, { useEffect, useContext, useState, use } from 'react'
import { Table, Segment, Loader, Dropdown } from 'semantic-ui-react'
import { Modal, DatePicker } from 'antd'
import MSubmitButton from './../../common/mSubmitButton'
import { UserContext } from '../../../contexts/UserContext'
import Menu from './menu'
import Image from 'next/image'
import _ from 'lodash'
import moment from 'moment'
import {
  PlusIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import Nodata from '@/assets/images/no-data.png'
import { Header, Button } from '@/components/atoms'
import Download from './download'

let url = process.env.NEXT_PUBLIC_BKEND_URL
let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

export default function EquipmentReport() {
  let { user, setUser } = useContext(UserContext)
  const [equipments, setEquipments] = useState([])
  let [equipmentType, setEquipmentType] = useState([])
  let [equipmentTypes, setEquipmentTypes] = useState([])
  const [loading, setLoading] = useState(false)
  let canCreateData = user.userType === 'admin'
  let [viewPort, setViewPort] = useState('list')
  const [isModalDownloadOpen, setIsModalDownloadOpen] = useState(false)
  const [totalInMaintenance, setTotalInMaintenance] = useState(0)
  const [totalOpen, setTotalOpen] = useState(0)
  const [globalTotal, setGlobalTotal] = useState(0)

  const [date, setDate] = useState('')
  const [initialDate, setInitialDate] = useState(
    moment().subtract(1, 'days').format('YYYY-MM-DD')
  )
  useEffect(() => {
    getEquipmentTypes()
    getReport()
  }, [])

  const disabledDate = (current) => {
    return current && current.isSameOrAfter(moment())
  }

  const getEquipmentTypes = () => {
    fetch(`${url}/equipments/types`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        let key = ''
        let text = ''
        let value = ''
        const data = response.map((item) => {
          key = item?._id?.id
          text = item?._id?.id
          value = item?._id?.id
          return {
            key,
            text,
            value,
            style: { fontSize: '12px', padding: '4px 2px' },
          }
        })
        setEquipmentTypes(data)
      })
      .catch((err) => {})
  }

  const getReport = async () => {
    let d = date === '' ? initialDate : date
    setLoading(true)
    await fetch(
      `${url}/equipments/utilization/date/${d}?eqtypes=${equipmentType.join()}`,
      {
        headers: {
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
      }
    )
      .then((res) => res.json())
      .then((response) => {
        setEquipments(response?.response?.length === 0 ? [] : response)
        getGlobalInMaintenance(response?.response)
        getGlobalOpenTotal(response?.response)
        getTotal(response?.response)
        setLoading(false)
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false)
      })
  }

  const handleEquipmentSearch = () => {
    getReport(date)
  }

  const closeDownloadModal = () => {
    setIsModalDownloadOpen(false)
  }
  const onDownloadCompleted = () => {
    setIsModalDownloadOpen(false)
  }
  const getTotal = (records) => {
    let total = 0
    records.map((r) => {
      total = total + r.open + r.workshop
    })
    setGlobalTotal(total)
  }

  const getGlobalOpenTotal = (records) => {
    let total = 0
    records &&
      records.map((r) => {
        total = total + r.open
      })
    setTotalOpen(total)
  }
  const getGlobalInMaintenance = (records) => {
    let total = 0
    records &&
      records.map((r) => {
        total = total + r.workshop
      })
    setTotalInMaintenance(total)
  }
  return (
    <>
      <div className="my-5 flex flex-col space-y-3 px-10">
        <Header title="Equipments"></Header>
        <Menu current="equipmentReports" />
        {/* Filters */}
        <div className="flex items-start">
          <div className="flex flex-1 items-start gap-x-3">
            <div className="flex w-auto items-start gap-x-3">
              {/* 1. Date picker */}
              <div className="w-auto">
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
              </div>
              {/* 2. Select equipment type/multiple section with search */}
              <div className="max-w-xl flex-1">
                <Dropdown
                  options={equipmentTypes}
                  placeholder="Equipment types"
                  // fluid
                  search
                  multiple
                  selection
                  onChange={(e, data) => {
                    setEquipmentType(data.value)
                  }}
                  className="wrap-dropdown"
                />
              </div>
            </div>
            {date !== '' && equipmentType.length === 0 ? (
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 p-0 text-gray-400 hover:text-gray-500 focus:relative md:hover:bg-gray-50"
                onClick={handleEquipmentSearch}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            ) : equipmentType.length > 0 && (date !== '' || initialDate) ? (
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 p-0 text-gray-400 hover:text-gray-500 focus:relative md:hover:bg-gray-50"
                onClick={handleEquipmentSearch}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            ) : (
              <></>
            )}
          </div>
          {/* 3. Download: Allow user choose date range */}
          <div className="items-end">
            <MSubmitButton
              submit={() => setIsModalDownloadOpen(true)}
              icon={<ArrowDownTrayIcon className="text-zinc-800 h-5 w-5" />}
              label="Download"
            />
          </div>
        </div>
        {/* Table of data */}
        <div>
          {!loading && equipments?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Image
                src={Nodata}
                width={125}
                height={125}
                priority
                alt="icon"
                // className="h-8 w-8"
              />
              <h2 className="text-xl font-bold">No data found!</h2>
              <div className="text-md font-normal">
                Report on the selected date does not have any data.
              </div>
            </div>
          )}
          {!loading && equipments?.response?.length > 0 && (
            <Table size="small" compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>#</Table.HeaderCell>
                  <Table.HeaderCell>Equipment type</Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                  <Table.HeaderCell>Open</Table.HeaderCell>
                  <Table.HeaderCell>% (Open)</Table.HeaderCell>
                  <Table.HeaderCell>Under maintenance</Table.HeaderCell>
                  <Table.HeaderCell>% (Under maintenance)</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {equipments &&
                  equipments?.response?.map((row, index) => {
                    return (
                      <Table.Row key={index}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{row.type}</Table.Cell>
                        <Table.Cell>{row.open + row.workshop}</Table.Cell>
                        <Table.Cell>{row.open}</Table.Cell>
                        <Table.Cell>
                          {_.round(
                            (row.open * 100) / (row.open + row.workshop),
                            1
                          )}
                          %
                        </Table.Cell>
                        <Table.Cell>{row.workshop}</Table.Cell>
                        <Table.Cell>
                          {_.round(
                            (row.workshop * 100) / (row.workshop + row.open),
                            1
                          )}
                          %
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}

                <Table.Row className="bg-gray-50/50">
                  <Table.Cell>Total</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>{globalTotal}</Table.Cell>
                  <Table.Cell>{totalOpen}</Table.Cell>
                  <Table.Cell>
                    {_.round((totalOpen * 100) / globalTotal, 1)}%
                  </Table.Cell>
                  <Table.Cell>{totalInMaintenance}</Table.Cell>
                  <Table.Cell>
                    {_.round((totalInMaintenance * 100) / globalTotal, 1)}%
                  </Table.Cell>
                  {/*
                   */}
                </Table.Row>
              </Table.Body>
            </Table>
          )}
          {loading && (
            <Segment>
              {/* <Dimmer active> */}
              {/* <div className="border py-2"> */}
              <Loader active inline="centered" />
              {/* </div> */}
              {/* </Dimmer> */}
            </Segment>
          )}
        </div>
      </div>
      <Modal
        open={isModalDownloadOpen}
        onCancel={closeDownloadModal}
        on
        width={400}
        title="Download equipment report"
        // okText="Download now"
        footer={null}
        // cancelText="Cancel"
      >
        <Download onDownloadCompleted={onDownloadCompleted} />
      </Modal>
    </>
  )
}
