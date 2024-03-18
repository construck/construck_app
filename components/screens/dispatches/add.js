import React, { useContext, useEffect, useState } from 'react'
import Card from './../../common/Card'
import MSubmitButton from './../../common/mSubmitButton'
import { ScreenContext } from './../../../contexts/ScreenContext'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function Add() {
    let { screen, setScreen } = useContext(ScreenContext)
  let [viewPort, setViewPort] = useState('list')
  return (
    <>
      <Card title="Create new dispatch">
        {/* {(viewPort === 'new' || viewPort === 'edit') && ( */}
        <MSubmitButton
          onClick={() => setScreen('workData')}
          intent="primary"
          icon={<ArrowLeftIcon className="h-5 w-5 text-zinc-800" />}
          label="Back"
        />
        {/* )} */}
        <div className="flex flex-col">
          <div className="mt-5 flex flex-row items-center space-x-2">
            New dispatch
            {/* <div class="form-check">
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
          </div> */}
          </div>
          {/* <div className="mt-5 flex flex-row items-center space-x-10">
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
              class="form-check-label inline-block text-zinc-800"
              for="checkLowbed"
            >
              Machine dispatch (by Lowbed)
            </label>
          </div>
        </div> */}

          {/* {!lowbedWork && (
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
                class="form-check-label inline-block text-zinc-800"
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
        )} */}

          {/* {lowbedWork && (
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
                      setLowbed(ogLowbedList.filter((l) => l._id == data.value))
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
        )} */}

          {/* <div className="mt-5 flex flex-row space-x-10">
          {!lowbedWork && (
            <>
              <div className="mt-5 flex w-1/4 flex-col space-y-5">
                <MTitle content="Dispatch data" />

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
                              let _eq = selEquipments ? [...selEquipments] : []
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
                              let filteredEqList = equipmentFullList.filter(
                                (e) => {
                                  let _eqId = e.value
                                  let _seleEqIds = _eq.map((s) => s._id)
                                  return !_seleEqIds.includes(_eqId)
                                }
                              )

                              if (_eq[i].eqOwner !== 'Construck') {
                                let _drOw = drivers ? [...drivers] : []
                                _drOw[i] = 'NA'
                                setDrivers(_drOw)
                                let _dr = drivers ? [...drivers] : []

                                let _drLists = [...driverLists]
                                let filteredDrList = driverList.filter((e) => {
                                  let _drId = e.value
                                  let _seleDrIds = _dr.map((s) => s)
                                  return !_seleDrIds.includes(_drId)
                                })

                                _drLists[i + 1] = filteredDrList
                                setDriverLists(_drLists)
                              }

                              _eqLists[i + 1] = filteredEqList
                              setEquipmentFullLists(_eqLists)

                              setSelEquipments(_eq)
                            } else {
                              toast.warning('Already selected!')
                            }
                          }}
                        />
                      </div>

                      {selEquipments[i]?.eqOwner === 'Construck' && (
                        <div className="flex flex-col justify-start space-y-1">
                          <div className="items-cente flex flex-row">
                            <MTextView content="Driver" />
                            {<div className="text-sm text-red-600">*</div>}
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
                                let filteredDrList = driverList.filter((e) => {
                                  let _drId = e.value
                                  let _seleDrIds = _dr.map((s) => s)
                                  return !_seleDrIds.includes(_drId)
                                })

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
                          selJobTypes[i] === '62690b67cf45ad62aa6144d8') && (
                          <TextInput
                            // label="Specify Job Type"
                            placeholder="Job type..."
                            setValue={(e) => {
                              let _othJTypes = [...selJobTypesOthers]
                              _othJTypes[i] = e
                              setSelJobTypesOthers(_othJTypes)
                            }}
                            type="text"
                          />
                        )}

                        {selEquipments && selEquipments[i]?.eqtype === 'Truck' && (
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
                                    let _set = astDrivers ? [...astDrivers] : []
                                    _set[i] = data.value
                                    setAstDrivers(_set)
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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
                        <div className="flex w-1/6 flex-col justify-start space-y-1">
                          <div className="flex flex-row items-center">
                            <MTextView content="Equipment" />
                            {<div className="text-sm text-red-600">*</div>}
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
                              let selecteObj = _.find(selEquipments, (e) => {
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
                                let filteredEqList = equipmentFullList.filter(
                                  (e) => {
                                    let _eqId = e.value
                                    let _seleEqIds = _eq.map((s) => s._id)
                                    return !_seleEqIds.includes(_eqId)
                                  }
                                )

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
                              }
                            }}
                          />
                        </div>

                        {selEquipments[i]?.eqOwner === 'Construck' && (
                          <div className="flex w-1/6 flex-col justify-start space-y-1">
                            <div className="flex flex-row items-center">
                              <MTextView content="Driver" />
                              {<div className="text-sm text-red-600">*</div>}
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
                                    setNMachinesToMove(nMachinesToMove - 1)
                                  }
                                }
                              }}
                            />
                          </div>
                        )}

                        <div className="flex w-1/6 flex-col justify-start space-y-1">
                          <div className="flex flex-row items-center">
                            <MTextView content="From" />
                            {<div className="text-sm text-red-600">*</div>}
                          </div>
                          <div className="w-full">
                            <Dropdown
                              options={projectList}
                              placeholder="Project"
                              fluid
                              search
                              selection
                              onChange={(e, data) => {
                                let selectedPr = _.find(fromProjects, (d) => {
                                  return d === data.value
                                })
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
                                    setNMachinesToMove(nMachinesToMove - 1)
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex w-1/6 flex-col justify-start space-y-1">
                          <div className="flex flex-row items-center">
                            <MTextView content="To" />
                            {<div className="text-sm text-red-600">*</div>}
                          </div>
                          <div className="w-full">
                            <Dropdown
                              options={projectList}
                              placeholder="Project"
                              fluid
                              search
                              selection
                              onChange={(e, data) => {
                                let selectedPr = _.find(toProjects, (d) => {
                                  return d === data.value
                                })
                                if (!selectedPr) {
                                  let _dr = toProjects ? [...toProjects] : []
                                  _dr[i] = projects.filter(
                                    (p) => p._id === data.value
                                  )[0]
                                  settoProjects(_dr)
                                } else {
                                  toast.error('Already selected!')
                                  if (nMachinesToMove === 1) {
                                  } else {
                                    let _e = toProjects ? [...toProjects] : []
                                    _e.pop()
                                    settoProjects(_e)
                                    setNMachinesToMove(nMachinesToMove - 1)
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex w-1/6 flex-col justify-start space-y-1">
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
                              onChange={(e, data) => {
                                let _selJT = [...selJobTypes]
                                _selJT[i] = data.value
                                setSelJobTypes(_selJT)
                              }}
                            />
                          </div>
                        </div>

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
                              {<div className="text-sm text-red-600">*</div>}
                            </div>
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
                      className="h-5 w-5 cursor-pointer text-teal-600"
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
        </div> */}

          {/* {((dispatchDate &&
          project &&
          selEquipments?.length > 0 &&
          drivers?.length > 0) ||
          lowbedWork) && (
          <div className="mt-10 w-24 self-center">
            <MSubmitButton
              icon={
                !submitting && <CheckIcon className="h-5 w-5 text-zinc-800" />
              }
              intent={submitting ? 'disabled' : 'primary'}
              label={
                submitting ? <Loader active inline size="tiny" /> : 'Create'
              }
              submit={() => submit()}
              disabled={submitting}
            />
          </div>
        )} */}
        </div>
      </Card>
    </>
  )
}
