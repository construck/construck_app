import {
  ReceiptRefundIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  TruckIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import StatisticCard from '../common/statisticCard'
import 'antd/dist/antd.css'

import { DatePicker, Space } from 'antd'
import TextInputV from '../common/TextIputV'
import { Dropdown, Loader } from 'semantic-ui-react'
import MSubmitButton from '../common/mSubmitButton'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import 'datejs'
import moment from 'moment'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { toast, ToastContainer } from 'react-toastify'
import * as _ from 'lodash'

const CUT_OVER_DATE = new Date('01-JUN-2022')

const { RangePicker } = DatePicker

export default function Dashboard() {
  let [startDate, setStartDate] = useState(
    Date.today().clearTime().moveToFirstDayOfMonth()
  )
  let [endDate, setEndDate] = useState(Date.today())
  let [customer, setCustomer] = useState([])
  let [project, setProject] = useState([])
  let [equipment, setEquipment] = useState([])
  let [owner, setOwner] = useState('')

  let [customerOptions, setCustomerOptions] = useState([])
  let [projectOptions, setProjectOptions] = useState([])
  let [equipmentOptions, setEquipmentOptions] = useState([])

  let [finalRevenues, setFinalRevenues] = useState(0)
  let [provisionalRevenues, setProvisionalRevenues] = useState(0)
  let [totalDays, setTotalDays] = useState(0)
  let [assetUtilization, setAssetUtilization] = useState(0)
  let [assetAvailability, setAssetAvailability] = useState(0)
  let [averageDownTimeTrucks, setAverageDowntimeTrucks] = useState(0)
  let [averageDownTimeMachines, setAverageDowntimeMachines] = useState(0)

  let [loadingFinalRev, setLoadingFinalRev] = useState(true)
  let [loadingProvisionalRev, setLoadingProvisionalRev] = useState(true)
  let [loadingTotalDays, setLoadingTotalDays] = useState(true)
  let [loadingAvailability, setLoadingAvailability] = useState(true)
  let [loadingAssetUtilization, setLoadingAssetUtilization] = useState(true)
  let [loadingAverageDownTimeTrucks, setLoadingAverageDownTimeTrucks] =
    useState(true)
  let [loadingAverageDownTimeMachines, setLoadingAverageDownTimeMachines] =
    useState(true)
  let [downloadingDrivers, setDownloadingDrivers] = useState(false)
  let [nAvailable, setNAvailable] = useState(0)
  let [nAssigned, setNAssigned] = useState(0)
  let [nInWorkshop, setNInWorkshop] = useState(0)
  let [nDispatched, setNDispatched] = useState(0)
  let [nRecords, setNRecords] = useState(-1)
  let url = process.env.NEXT_PUBLIC_BKEND_URL
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

  useEffect(() => {
    fetch(`${url}/works/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        status: 'final',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFinalRevenues(parseFloat(res.totalRevenue))
        setTotalDays(res.totalDays)
        setProvisionalRevenues(parseFloat(res.projectedRevenue))
        setLoadingFinalRev(false)
        setLoadingTotalDays(false)
        setLoadingProvisionalRev(false)
      })
      .catch((err) => toast.error('Error Occured!'))

    fetch(`${url}/assetAvailability/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate
          ? startDate
          : Date.today().clearTime().moveToFirstDayOfMonth(),
        endDate: endDate ? endDate : Date.today(),
        status: 'projected',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoadingAvailability(false)
        setAssetAvailability(res?.assetAvailability)
        setLoadingAssetUtilization(false)
        setAssetUtilization(res.assetUtilization)
      })
      .catch((err) => toast.error('Error Occured!'))

    fetch(`${url}/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let customers = res
        let options = customers.map((c) => {
          return {
            key: c._id,
            text: c.name,
            value: c.name,
          }
        })

        setCustomerOptions(options)
      })

    fetch(`${url}/projects/v2`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let projects = res
        let options = projects.map((c) => {
          return {
            key: c._id,
            text: c.prjDescription,
            value: c.prjDescription,
          }
        })

        setProjectOptions(options)
      })

    fetch(`${url}/equipments/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let equipments = res?.equipments
        let options = equipments.map((c) => {
          return {
            key: c._id,
            text: c.plateNumber,
            value: c.plateNumber,
            // description: c.eqDescription,
          }
        })

        setEquipmentOptions(options)
      })
      .catch((err) => {})
  }, [])

  //Date range changed
  useEffect(() => {
    setLoadingFinalRev(true)
    setLoadingProvisionalRev(true)
    setLoadingTotalDays(true)
    setLoadingAvailability(true)
    setLoadingAssetUtilization(true)
    setLoadingAverageDownTimeTrucks(true)
    setLoadingAverageDownTimeMachines(true)

    fetch(`${url}/works/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate
          ? startDate
          : Date.today().clearTime().moveToFirstDayOfMonth(),
        endDate: endDate ? endDate : Date.today(),
        status: 'final',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFinalRevenues(parseFloat(res.totalRevenue))
        setTotalDays(res.totalDays)
        setProvisionalRevenues(parseFloat(res.projectedRevenue))
        setLoadingFinalRev(false)
        setLoadingTotalDays(false)
        setLoadingProvisionalRev(false)
      })
      .catch((err) => toast.error('Error Occured!'))

    fetch(`${url}/assetAvailability/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate
          ? startDate
          : Date.today().clearTime().moveToFirstDayOfMonth(),
        endDate: endDate ? endDate : Date.today(),
        status: 'projected',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoadingAvailability(false)
        setAssetAvailability(res?.assetAvailability)
        setLoadingAssetUtilization(false)
        setAssetUtilization(res?.assetUtilization)
      })
      .catch((err) => toast.error('Error Occured!'))

    fetch(`${url}/downtimes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let downTimeTrucks = res.filter((r) => r._id == 'Truck')
        let downTimeMachines = res.filter((r) => r._id == 'Machine')

        console.log(downTimeTrucks)

        setLoadingAverageDownTimeTrucks(false)
        setLoadingAverageDownTimeMachines(false)

        setAverageDowntimeTrucks(
          _.round(downTimeTrucks[0]?.fieldN, 2)?.toLocaleString()
        )
        setAverageDowntimeMachines(
          _.round(downTimeMachines[0]?.fieldN, 2)?.toLocaleString()
        )
      })
  }, [startDate, endDate])

  //Customer changed
  useEffect(() => {
    setLoadingFinalRev(true)
    setLoadingProvisionalRev(true)
    setLoadingTotalDays(true)

    fetch(`${url}/works/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate
          ? startDate
          : Date.today().clearTime().moveToFirstDayOfMonth(),
        endDate: endDate ? endDate : Date.today(),
        status: 'final',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFinalRevenues(parseFloat(res.totalRevenue))
        setTotalDays(res.totalDays)
        setProvisionalRevenues(parseFloat(res.projectedRevenue))
        setLoadingFinalRev(false)
        setLoadingTotalDays(false)
        setLoadingProvisionalRev(false)
      })
      .catch((err) => toast.error('Error Occured!'))
  }, [customer])

  //project changed
  useEffect(() => {
    setLoadingFinalRev(true)
    setLoadingProvisionalRev(true)
    setLoadingTotalDays(true)

    fetch(`${url}/works/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate
          ? startDate
          : Date.today().clearTime().moveToFirstDayOfMonth(),
        endDate: endDate ? endDate : Date.today(),
        status: 'final',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('Reeees', res)
        setFinalRevenues(parseFloat(res.totalRevenue))
        setProvisionalRevenues(parseFloat(res.projectedRevenue))
        setTotalDays(res.totalDays)
        setLoadingFinalRev(false)
        setLoadingTotalDays(false)
        setLoadingProvisionalRev(false)
      })
      .catch((err) => {})
  }, [project])

  //equipment changed
  useEffect(() => {
    setLoadingFinalRev(true)
    setLoadingProvisionalRev(true)
    setLoadingTotalDays(true)

    fetch(`${url}/works/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate
          ? startDate
          : Date.today().clearTime().moveToFirstDayOfMonth(),
        endDate: endDate ? endDate : Date.today(),
        status: 'final',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFinalRevenues(parseFloat(res.totalRevenue))
        setProvisionalRevenues(parseFloat(res.projectedRevenue))
        setTotalDays(res.totalDays)
        setLoadingFinalRev(false)
        setLoadingTotalDays(false)
        setLoadingProvisionalRev(false)
      })
      .catch((err) => {})
  }, [equipment])

  //owner changed
  useEffect(() => {
    setLoadingFinalRev(true)
    setLoadingProvisionalRev(true)
    setLoadingTotalDays(true)

    fetch(`${url}/works/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate
          ? startDate
          : Date.today().clearTime().moveToFirstDayOfMonth(),
        endDate: endDate ? endDate : Date.today(),
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFinalRevenues(parseFloat(res.totalRevenue))
        setTotalDays(res.totalDays)
        setProvisionalRevenues(parseFloat(res.projectedRevenue))
        setLoadingTotalDays(false)
        setLoadingFinalRev(false)
        setLoadingProvisionalRev(false)
      })
      .catch((err) => {})
  }, [owner])

  function go() {
    fetch(`${url}/works/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        status: 'final',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFinalRevenues(parseFloat(res.totalRevenue))
        setTotalDays(res.totalDays)
      })
      .catch((err) => {})

    fetch(`${url}/works/getAnalytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        status: 'projected',
        customer,
        project,
        equipment,
        owner,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setProvisionalRevenues(parseFloat(res.projectedRevenue))
        setTotalDays(res.totalDays)
      })
      .catch((err) => {})
  }

  async function downloadDrivers() {
    setDownloadingDrivers(true)
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

    fetch(`${url}/works/gethoursperdriver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        startDate,
        endDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        let data = res?.map((d) => {
          let myAssistants = d['Drivers']
          let nAssistants = myAssistants.length

          return {
            'Main Driver': d['Main Driver'],
            // Assistants: myAssistants,
            'Assistant 1':
              nAssistants >= 1
                ? myAssistants[0]?.firstName + ' ' + myAssistants[0]?.lastName
                : '',
            'Assistant 2':
              nAssistants >= 2
                ? myAssistants[1]?.firstName + ' ' + myAssistants[1]?.lastName
                : '',
            'Assistant 3':
              nAssistants >= 3
                ? myAssistants[2]?.firstName + ' ' + myAssistants[2]?.lastName
                : '',
            'Assistant 4':
              nAssistants >= 4
                ? myAssistants[3]?.firstName + ' ' + myAssistants[3]?.lastName
                : '',
            'Assistant 5':
              nAssistants >= 5
                ? myAssistants[4]?.firstName + ' ' + myAssistants[4]?.lastName
                : '',
            Phone: d['Phone'],
            'Total Duration': d['Total Duration'],
            'Unit of measurement': d['Unit of measurement'],
          }
        })

        exportToCSV(
          data,
          'Hours per driver' + moment().format('DD-MMM-YYYY hh:mm:ss')
        )
        setDownloadingDrivers(false)
      })
      .catch((err) => {
        toast.error(err)
        console.log('Error', err)
        setDownloadingDrivers(false)
      })
  }

  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      <div className="flex h-12 items-start justify-end">
        <h2 className="flex-1">
          <span>Dashboard</span>
        </h2>
      </div>

      <div className="mb-5 flex flex-row space-x-5 py-5">
        {/* Customer name list */}
        {/* <TextInputV placeholder="Customer Name" setValue={setCustomer} /> */}
        <div className="w-1/5">
          <Dropdown
            options={customerOptions}
            placeholder="Select customer(s)"
            fluid
            search
            multiple
            selection
            onChange={(e, data) => {
              setCustomer(data.value)
            }}
          />
        </div>

        {/* Project list */}
        {/* <TextInputV placeholder="Project" setValue={setProject} /> */}
        <div className="w-1/5">
          <Dropdown
            options={projectOptions}
            placeholder="Select project(s)"
            fluid
            search
            multiple
            selection
            onChange={(e, data) => {
              setProject(data.value)
            }}
          />
        </div>

        {/* equipment list */}
        {/* <TextInputV placeholder="Equipment" setValue={setEquipment} /> */}
        <div className="w-1/5">
          <Dropdown
            options={equipmentOptions}
            placeholder="Select equipment"
            fluid
            search
            multiple
            selection
            onChange={(e, data) => {
              setEquipment(data.value)
            }}
          />
        </div>

        <div className="w-1/5">
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

        <RangePicker
          onChange={(values, dateStrings) => {
            setStartDate(dateStrings[0])
            setEndDate(dateStrings[1])
          }}
        />
        <div className="">
          <MSubmitButton label="Go" submit={() => go()} />
        </div>
      </div>
      <div className="mt-5 sm:mr-5">
        <div className="mb-5 text-xl font-semibold">Key Indicators</div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatisticCard
            data={{
              title: 'Projected Revenues',
              content: loadingProvisionalRev ? (
                <Loader active size="mini" inline />
              ) : (
                provisionalRevenues?.toLocaleString() + ' RWF'
              ),
            }}
            icon={<BanknotesIcon className="text-yellow-600 h-5 w-5" />}
          />
          <StatisticCard
            data={{
              title: 'Actual Revenues',
              content: loadingFinalRev ? (
                <Loader active size="mini" inline />
              ) : (
                finalRevenues?.toLocaleString() + ' RWF'
              ),
            }}
            icon={<BanknotesIcon className="h-5 w-5 text-blue-600" />}
          />
          <StatisticCard
            data={{
              title: 'Asset utilization',
              content: loadingAssetUtilization ? (
                <Loader active inline size="mini" />
              ) : (
                assetUtilization + '%'
              ),
            }}
            icon={<ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />}
          />

          <StatisticCard
            data={{
              title: 'Asset availability',
              content: loadingAvailability ? (
                <Loader active inline size="mini" />
              ) : (
                assetAvailability + '%'
              ),
            }}
            icon={<TruckIcon className="text-yellow-500 h-5 w-5" />}
          />
        </div>
      </div>

      <div className="pt-10 text-xl font-semibold">Equipment Downtime</div>
      <div className="mt-5 grid grid-cols-1 gap-6 sm:mr-5 md:grid-cols-4">
        <StatisticCard
          // intent="danger"
          data={{
            title: 'Trucks - Average Downtime',
            content: loadingAverageDownTimeTrucks ? (
              <Loader active inline size="mini" />
            ) : (
              averageDownTimeTrucks + ' days'
            ),
          }}
          icon={<TruckIcon className="h-5 w-5 text-red-500" />}
        />

        <StatisticCard
          // intent="danger"
          data={{
            title: 'Machines - Average Downtime',
            content: loadingAverageDownTimeMachines ? (
              <Loader active inline size="mini" />
            ) : (
              averageDownTimeMachines + ' days'
            ),
          }}
          icon={<WrenchScrewdriverIcon className="h-5 w-5 text-red-500" />}
        />
      </div>

      <div className="pt-10 text-xl font-semibold">Downloads</div>
      <div className="mb-5 flex flex-row space-x-5 py-5">
        <div className="flex cursor-pointer flex-row items-center space-x-2 text-sm font-semibold hover:underline">
          {downloadingDrivers ? (
            <Loader active size="mini" inline />
          ) : (
            <ArrowDownTrayIcon className="h-5 w-5" />
          )}
          <div onClick={() => downloadDrivers()}>Get Hours/Driver report</div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
