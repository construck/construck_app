import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import React, { useContext, useEffect, useState } from 'react'
import ProjectCard from '../common/projectCard'
import MSubmitButton from '../common/mSubmitButton'
import TextInput from '../common/TextIput'
import readXlsxFile from 'read-excel-file'
import { Dropdown, Loader } from 'semantic-ui-react'
import { UserContext } from '../../contexts/UserContext'
import TextInputLogin from '../common/TextIputLogin'
import MTextView from '../common/mTextView'

import { toast, ToastContainer } from 'react-toastify'

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

import moment from 'moment'
import ModalApprovalRejections from '../common/projectModalApvlRjct'
import ModalRelease from '../common/projectModalReleased'

export default function Projects() {
  let { user, setUser } = useContext(UserContext)
  //AUTORIZATION
  let canCreateData = user?.permissions?.canCreateData

  let [projects, setProjects] = useState([])
  let [ogProjectList, setOgProjectList] = useState([])
  let [viewPort, setViewPort] = useState('list')
  let [search, setSearch] = useState('')
  let [loading, setLoading] = useState(true)
  let [statusFilter, setStatusFilter] = useState('')
  let [filterBy, setFilterBy] = useState('')
  let [customers, setCustomers] = useState([])
  let [customersOptions, setCustomersOptions] = useState([])
  let [selectedCustomer, setSelectedCustomer] = useState(null)
  let [projectAdmin, setProjectAdmin] = useState(null)
  let [projectDescription, setProjectDescription] = useState('')
  let [submitting, setSubmitting] = useState(false)

  let [selectedProject, setSelectedProject] = useState(null)
  let [workDetails, setWorkDetails] = useState(null)
  let [releasedData, setReleasedData] = useState(null)

  let [validationModalIsShown, setValidationModalIsShown] = useState(false)
  let [releasedModalIsShown, setReleasedModalIsShown] = useState(false)
  let url = process.env.NEXT_PUBLIC_BKEND_URL

  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

  let [downloadingData, setDownloadingData] = useState(false)
  let [idToUpdate, setIdToUpdate] = useState('')
  let [customerId, setCustomerId] = useState('')
  let [revenueOfficers, setRevenueOfficers] = useState([])

  useEffect(() => {
    setValidationModalIsShown(false)
    getRevenueOfficers()
    fetch(`${url}/projects/v2`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setProjects(res)
        setOgProjectList(res)
        setLoading(false)
      })
      .catch((err) => toast.error('Error occured!'))

    fetch(`${url}/customers/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((resp) => {
        setCustomers(resp)
        setCustomersOptions(
          resp.map((r) => {
            return {
              key: r._id,
              text: r.name,
              value: r._id,
            }
          })
        )
      })
      .catch((err) => toast.error('Error occured!'))
  }, [])

  useEffect(() => {
    setLoading(true)
    setValidationModalIsShown(false)
    if (search.length >= 3) {
      let projList = projects.filter((w) => {
        let _search = search?.toLocaleLowerCase()
        let prjDescription = w?.prjDescription?.toLocaleLowerCase()

        return prjDescription.includes(_search)
      })
      setProjects(projList)
      setLoading(false)
    }

    if (search.length < 3) {
      setProjects(ogProjectList)
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    let _projList = [...ogProjectList]
    setProjects(
      statusFilter !== 'all'
        ? _projList.filter((e) => e.eqStatus === statusFilter)
        : ogProjectList
    )
  }, [statusFilter])

  useEffect(() => {
    if (filterBy === statusFilter) {
      setStatusFilter('all')
    } else setStatusFilter(filterBy)
  }, [filterBy])

  function getRevenueOfficers() {
    setLoading(true)
    fetch(`${url}/users/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setRevenueOfficers(
          res.filter((r) => {
            return r?.userType === 'revenue'
          })
        )
        setLoading(false)
      })
      .catch((err) => toast.error('Error occured!'))
  }

  function showDetails(data, workDetails) {
    setSelectedProject(data.prjDescription)
    setWorkDetails(workDetails)
    setValidationModalIsShown(true)
  }

  function showReleased(data, releasedMonthlyWorks) {
    setSelectedProject(data.prjDescription)
    setReleasedData(releasedMonthlyWorks)
    setReleasedModalIsShown(true)
  }

  function refresh() {
    setLoading(true)
    fetch(`${url}/projects/v2`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setProjects(res)
        setOgProjectList(res)
        setLoading(false)
      })
      .catch((err) => toast.error('Error occured!'))
  }

  function submit() {
    setSubmitting(true)
    fetch(`${url}/customers/project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        id: selectedCustomer,
        project: {
          prjDescription: projectDescription,
          status: 'ongoing',
          projectAdmin
        },
        
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setSubmitting(false)
        refresh()
        setViewPort('list')
      })
      .catch((err) => toast.error('Error occured!'))
  }

  async function readFromFile(file) {
    setLoading(true)
    let promises = []
    readXlsxFile(file)
      .then((rows) => {
        rows.forEach((row) => {
          let promise = fetch(`${url}/projects/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
            body: JSON.stringify({
              prjDescription: row[2],
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

  function _setPrjToUpdate(data) {
    //TODO
    setViewPort('change')
    setProjectDescription(data.prjDescription)
    setIdToUpdate(data.id)
    setCustomerId(data.customerId)
    setProjectAdmin(data?.projectAdmin)
  }

  function updateProject() {
    //TODO
    setSubmitting(true)
    fetch(`${url}/customers/project/${idToUpdate}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        customerId,
        prjDescription: projectDescription,
        projectAdmin
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setSubmitting(false)
        refresh()
        setViewPort('list')
      })
      .catch((err) => toast.error('Error occured!'))
  }

  function download() {
    setDownloadingData(true)

    fetch(`${url}/projects/v2`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let data = res.map((w) => {
          {
            return {
              'Project description': w.prjDescription,
              'Project status': w.status,
              Customer: w.customer,
            }
          }
        })

        exportToCSV(
          data,
          `Projects List ${moment().format('DD-MMM-YYYY HH:mm:ss')}`
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
      <div className="my-5 flex flex-col space-y-5 px-10">
        <div className="text-2xl font-semibold">Projects</div>
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
              }}
              intent="primary"
              icon={<ArrowLeftIcon className="h-5 w-5 text-zinc-800" />}
              label="Back"
            />
          )}

          {viewPort === 'list' && (
            <div className="flex flex-row items-center space-x-5">
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
              <DocumentDuplicateIcon className="h-5 w-5 cursor-pointer" />
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
            {!loading && projects.length > 0 && (
              <div className="grid gap-x-3 gap-y-5 sm:grid-cols-2 md:grid-cols-4 md:gap-y-6">
                {projects.map((e) => {
                  return (
                    <ProjectCard
                      key={e.prjDescription}
                      data={{
                        prjDescription: e.prjDescription,
                        status: e.status,
                        customer: e.customer,
                        id: e._id,
                        customerId: e.customerId,
                        projectAdmin: e.projectAdmin
                      }}
                      handleChange={_setPrjToUpdate}
                      handleShowDetails={showDetails}
                      handleShowReleased={showReleased}
                      canCreateData={canCreateData}
                    />
                  )
                })}
              </div>
            )}

            {(loading || projects.length === 0) && (
              <div className="mx-auto h-full">
                <Loader active />
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
                    label="Project Description"
                    placeholder="Project description"
                    type="text"
                    setValue={setProjectDescription}
                    isRequired
                  />

                  {/* Eq Description */}
                  <div className="flex flex-col space-y-1 w-[250px]">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Customer" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={customersOptions}
                      placeholder="Select customer"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        setSelectedCustomer(data.value)
                      }}
                    />
                  </div>

                  {/* Responsible */}
                  <div className="flex flex-col space-y-1 w-[250px]">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Project Admin" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={revenueOfficers?.map((officer) => {
                        return {
                          value: officer?._id,
                          text: officer?.firstName + ' ' + officer?.lastName,
                          // label: officer?.firstName + ' ' + officer?.lastName,
                        }
                      })}
                      placeholder="Select project admin"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        setProjectAdmin(data.value)
                      }}
                    />
                  </div>
                </div>
              </div>

              {projectDescription.length >= 4 && selectedCustomer && (
                <div>
                  {submitting ? (
                    <Loader inline size="small" active />
                  ) : (
                    <MSubmitButton submit={submit} />
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
                    label="Project Description"
                    placeholder="Project description"
                    type="text"
                    setValue={setProjectDescription}
                    value={projectDescription}
                    isRequired
                  />
                </div>

                <div className="flex flex-col space-y-1 w-[250px]">
                    <div className="flex flex-1 flex-row items-center">
                      <MTextView content="Project Admin" />
                      <div className="text-sm text-red-600">*</div>
                    </div>
                    <Dropdown
                      options={revenueOfficers?.map((officer) => {
                        return {
                          value: officer?._id,
                          text: officer?.firstName + ' ' + officer?.lastName,
                          // label: officer?.firstName + ' ' + officer?.lastName,
                        }
                      })}
                      value={projectAdmin?._id}
                      placeholder="Select project admin"
                      fluid
                      search
                      selection
                      onChange={(e, data) => {
                        setProjectAdmin(data.value)
                      }}
                    />
                  </div>
              </div>

              {projectDescription.length >= 1 && (
                <div>
                  {submitting ? (
                    <Loader inline size="small" active />
                  ) : (
                    <MSubmitButton submit={updateProject} />
                  )}
                </div>
              )}


            </div>
          </div>
        )}

        <ToastContainer />
      </div>

      {/* recall modal */}
      {validationModalIsShown && (
        <ModalApprovalRejections
          title={`Work validation for work done at ${selectedProject}`}
          body="Are you sure you want to recall this job?"
          isShown={validationModalIsShown}
          setIsShown={setValidationModalIsShown}
          data={workDetails}
          handleConfirm={() => {}}
        />
      )}

      {releasedModalIsShown && (
        <ModalRelease
          title={`Released revenues at ${selectedProject}`}
          body=""
          isShown={releasedModalIsShown}
          setIsShown={setReleasedModalIsShown}
          data={releasedData}
          handleConfirm={() => {}}
        />
      )}
    </>
  )
}
