import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Loader } from 'semantic-ui-react'
import { UserContext } from '../../contexts/UserContext'
import CustomerCard from '../common/customerCard'
import MSubmitButton from '../common/mSubmitButton'
import TextInput from '../common/TextIput'
import TextInputLogin from '../common/TextIputLogin'

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

import moment from 'moment'

export default function Customers() {
  let { user, setUser } = useContext(UserContext)
  //AUTORIZATION
  let canCreateData = user?.permissions?.canCreateData

  let [customers, setCustomers] = useState([])
  let [ogCustomerList, setOgCustomerList] = useState([])
  let [viewPort, setViewPort] = useState('list')
  let [search, setSearch] = useState('')

  let [name, setName] = useState('')
  let [phone, setPhone] = useState('')
  let [email, setEmail] = useState('')
  let [tinNumber, setTinNumber] = useState('')
  let [submitting, setSubmitting] = useState(false)
  let [downloadingData, setDownloadingData] = useState(false)

  let [idToUpdate, setIdToUpdate] = useState('')

  let [loadingCustomers, setLoadingCustomers] = useState(true)
  let url = process.env.NEXT_PUBLIC_BKEND_URL
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

  useEffect(() => {
    loadCustomers()
  }, [])

  function loadCustomers() {
    setLoadingCustomers(true)
    setSubmitting(false)
    setPhone('')
    setName('')
    setEmail('')
    setTinNumber('')
    fetch(`${url}/customers/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((resp) => {
        setCustomers(resp)
        setOgCustomerList(resp)
        setLoadingCustomers(false)
      })
      .catch((err) => toast.error('Error occured!'))
  }

  function createCustomer() {
    setSubmitting(true)
    fetch(`${url}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        tinNumber,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast.error(res.error)
          setSubmitting(false)
        } else {
          setSubmitting(false)
          setViewPort('list')
          loadCustomers()
        }
      })
      .catch((err) => toast.error('Error occured!'))
  }

  function setCustomerToUpdate(data) {
    setViewPort('change')
    setName(data.name)
    setPhone(data.phone)
    setEmail(data.email)
    setTinNumber(data.tinNumber)
    setIdToUpdate(data._id)
  }

  function updateCustomer() {
    setSubmitting(true)
    fetch(`${url}/customers/${idToUpdate}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        tinNumber,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast.error(res.error)
          setSubmitting(false)
        } else {
          setSubmitting(false)
          setViewPort('list')
          loadCustomers()
        }
      })
      .catch((err) => toast.error('Error occured!'))
  }

  function download() {
    setDownloadingData(true)
    fetch(`${url}/customers/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((resp) => {
        setCustomers(resp)

        let data = resp.map((w) => {
          {
            return {
              Name: w.name,
              Phone: w.phone,
              Email: w.email,
              TIN: w.tinNumber,
            }
          }
        })

        exportToCSV(
          data,
          `Customer List ${moment().format('DD-MMM-YYYY HH:mm:ss')}`
        )

        setDownloadingData(false)
        setOgCustomerList(resp)
        setLoadingCustomers(false)
      })
      .catch((err) => toast.error('Error occured!'))

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

  useEffect(() => {
    if (search.length >= 3) {
      setLoadingCustomers(true)
      let _customerList = ogCustomerList.filter((w) => {
        let _search = search?.toLocaleLowerCase()
        let custName = w?.name?.toLocaleLowerCase()

        return custName.includes(_search)
      })
      setCustomers(_customerList)
      setLoadingCustomers(false)
    }

    if (search.length < 3) {
      setCustomers(ogCustomerList)
      setLoadingCustomers(false)
    }
  }, [search])

  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      <div className="text-2xl font-semibold">Customers</div>
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
          <div className="mx-auto flex flex-grow flex-col px-40">
            <TextInput placeholder="Search..." setValue={setSearch} />
          </div>
        )}

        {(viewPort === 'new' || viewPort === 'change') && (
          <MSubmitButton
            submit={() => {
              setViewPort('list')
              loadCustomers()
            }}
            intent="primary"
            icon={<ArrowLeftIcon className="h-5 w-5 text-zinc-800" />}
            label="Back"
          />
        )}

        {viewPort === 'list' && (
          <>
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
            <MSubmitButton
              submit={loadCustomers}
              intent="neutral"
              icon={<ArrowPathIcon className="h-5 w-5 text-zinc-800" />}
              label="Refresh"
            />
          </>
        )}
      </div>
      {viewPort === 'list' &&
        (!loadingCustomers && customers.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
            {customers.map((c) => {
              return (
                <CustomerCard
                  data={{
                    _id: c._id,
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    tinNumber: c.tinNumber,
                    nProjects: c.projects?.length,
                  }}
                  updateMe={setCustomerToUpdate}
                  canCreateData={canCreateData}
                />
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
            <Loader active />
          </div>
        ))}

      {viewPort === 'new' && (
        <div className="flex items-start">
          <div className="flex flex-col space-y-5">
            <TextInputLogin
              label="Name"
              type="text"
              placeholder="Names"
              isRequired
              setValue={setName}
            />

            <TextInputLogin
              label="Contact number"
              type="text"
              placeholder="phone"
              isRequired
              setValue={setPhone}
            />

            <TextInputLogin
              label="Email"
              type="email"
              placeholder="email@example.com"
              setValue={setEmail}
            />
            <TextInputLogin
              label="TIN"
              type="number"
              placeholder="999999999"
              setValue={setTinNumber}
            />

            {name.length > 1 && phone.length > 1 && (
              <div>
                {submitting ? (
                  <Loader inline size="small" active />
                ) : (
                  <MSubmitButton submit={createCustomer} />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {viewPort === 'change' && (
        <div className="flex items-start">
          <div className="flex flex-col space-y-5">
            <TextInputLogin
              label="Name"
              type="text"
              placeholder="Names"
              isRequired
              value={name}
              setValue={setName}
            />

            <TextInputLogin
              label="Contact number"
              type="text"
              placeholder="phone"
              isRequired
              value={phone}
              setValue={setPhone}
            />

            <TextInputLogin
              label="Email"
              type="email"
              placeholder="email@example.com"
              setValue={setEmail}
              value={email}
            />
            <TextInputLogin
              label="TIN"
              type="number"
              value={tinNumber}
              placeholder="999999999"
              setValue={setTinNumber}
            />

            {name.length > 1 && phone.length > 1 && (
              <div>
                {submitting ? (
                  <Loader inline size="small" active />
                ) : (
                  <MSubmitButton submit={updateCustomer} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}
