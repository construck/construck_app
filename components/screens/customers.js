import { ArrowLeftIcon, PlusIcon, RefreshIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import CustomerCard from '../common/customerCard'
import MSubmitButton from '../common/mSubmitButton'
import TextInput from '../common/TextIput'

export default function Customers() {
  let [customers, setCustomers] = useState([])
  let [ogCustomerList, setOgCustomerList] = useState([])
  let [viewPort, setViewPort] = useState('list')
  let [search, setSearch] = useState('')

  useEffect(() => {
    fetch('https://construck-backend.herokuapp.com/customers/')
      .then((res) => res.json())
      .then((resp) => {
        setCustomers(resp)
        setOgCustomerList(resp)
        console.log(resp)
      })
  }, [])

  useEffect(() => {
    if (search.length >= 3) {
      let _customerList = ogCustomerList.filter((w) => {
        let _search = search?.toLocaleLowerCase()
        let custName = w?.name?.toLocaleLowerCase()

        return custName.includes(_search)
      })
      setCustomers(_customerList)
    }

    if (search.length < 3) {
      setCustomers(ogCustomerList)
    }
  }, [search])

  function refresh(row) {}
  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      <div className="text-2xl font-semibold">Customers</div>
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
          <MSubmitButton
            submit={refresh}
            intent="neutral"
            icon={<RefreshIcon className="h-5 w-5 text-zinc-800" />}
            label="Refresh"
          />
        )}
      </div>
      {viewPort === 'list' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {customers.map((c) => {
            return (
              <CustomerCard
                data={{
                  name: c.name,
                  email: c.email,
                  phone: c.phone,
                  tinNumber: c.tinNumber,
                  nProjects: c.projects?.length,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
