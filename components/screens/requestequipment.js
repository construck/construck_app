import React, { useEffect, useContext, useState } from 'react'
import { Dimmer, Dropdown, Loader } from 'semantic-ui-react'
import { toast, ToastContainer } from 'react-toastify'
import Card from './../common/Card'
import TextInput from '../common/TextIput'
import MSubmitButton from '../common/mSubmitButton'
import { DatePicker, Descriptions, Drawer, Skeleton } from 'antd'
import 'datejs'
import moment from 'moment'

const { RangePicker } = DatePicker

export default function RequestEquipment() {
  let url = process.env.NEXT_PUBLIC_BKEND_URL
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [equipments, setEquipments] = useState([])
  const [equipment, setEquipment] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [tripsToBeMade, setTripsToBeMade] = useState("")
  const [tripFrom, setTripFrom] = useState("")
  const [tripTo, setTripTo] = useState("")
  const [referenceNumber, setReferenceNumber] = useState('')
  const [shift, setShift] = useState('')
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-01'))
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
  let [projectList, setProjectList] = useState(null)
  let [projects, setProjects] = useState(null)
  let [project, setProject] = useState('')
  let [projectId, setProjectId] = useState('')
  let [jobTypeListsbyRow, setJobTypeListsbyRow] = useState([])
  let [workToBeDone, setWorkToBeDone] = useState([])
  let [selJobTypesOthers, setSelJobTypesOthers] = useState([])

  useEffect(() => {
    getEquipments()
    getProjects()
    getJobTypes()
  }, [])
  // FETCH JOB TYPES
  const getJobTypes = () => {
    let types = []
    fetch(`${url}/jobTypes/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        resp.map((r) => {
          types.push({
            key: r._id,
            value: r._id,
            text: r.jobDescription,
          })
        })
        setJobTypeListsbyRow(types)
      })
      .catch((err) => {})
  }
  // FETCH PROJECTS
  const getProjects = () => {
    let projectOptions = []
    fetch(`${url}/projects/v2`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let list = resp
        list.map((p) => {
          console.log('###p: ', p);
          projectOptions.push({
            key: p._id,
            value: p.prjDescription,
            text: p.prjDescription,
          })
          // return {
          //   key: p._id,
          //   value: p._id,
          //   text: p.prjDescription,
          //   customer: p.customer,
          // }
        })
        setProjectList(projectOptions)
        setProjects(list)
      })
      .catch((err) => {
        toast.error(err)
        // setLoadingData(false)
      })
  }

  // FETCH EQUIPMENTS
  const getEquipments = () => {
    let equipmentList = []
    fetch(`${url}/equipments/`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let eqs = res?.equipments
        eqs.map((e) => {
          console.log('eqs: ', e)
          equipmentList.push({
            key: e._id,
            text: e.plateNumber,
            value: e._id,
          })
        })
        console.log('equipmentList: ', equipmentList)
        setEquipments(equipmentList)
      })
      .catch((err) => {
        setLoading(false)
        toast.error('Error occured!')
      })
  }

  const handleEquipmentRequestSubmit = () => {
    setLoading(true)
    //Send email
    fetch(`${url}/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({
        referenceNumber,
        project,
        equipmentType: equipment,
        workToBeDone,
        tripsToBeMade: tripsToBeMade,
        tripFrom: tripFrom,
        tripTo: tripTo,
        quantity,
        startDate: startDate,
        endDate: endDate,
        shift,
        status: 'pending',
        owner: '',
        approvedQuantity: null,
      }),
    })
      .then((res) => res.json())
      .then((res) => {})
      .catch((err) => console.log(err))
  }

  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      <Card title="Request equipment">
        <div className="flex flex-col gap-y-4">
          {/* equipment type and quantity */}
          <div className="flex flex-row gap-x-4">
            <div className="w-4/12">
              <div>Select Equipment</div>
              <Dropdown
                options={equipments}
                placeholder="Select Equipment"
                fluid
                search
                selection
                labeled
                onChange={(e, data) => {
                  setEquipment(data.value)
                }}
              />
            </div>
            <div className="w-4/12">
              <div>Quantity</div>
              <TextInput
                placeholder="Type quantity..."
                value={quantity}
                setValue={setQuantity}
              />
            </div>
            <div className="w-4/12">
              <div>Dispatch date</div>
              <RangePicker
                onChange={(values, dateStrings) => {
                  setStartDate(dateStrings[0])
                  setEndDate(dateStrings[1])
                }}
              />
            </div>
          </div>

          {/* work, project and shifts */}
          <div className="flex flex-row gap-x-4">
            <div className="w-4/12">
              <div>Select project</div>
              <Dropdown
                options={projectList}
                placeholder="Project"
                fluid
                search
                selection
                onChange={(e, data) => {
                  setProject(data.value)
                }}
              />
            </div>
            <div className="w-4/12">
              <div>Select work to be done</div>
              <Dropdown
                options={jobTypeListsbyRow}
                placeholder="Select Job type"
                fluid
                search
                selection
                onChange={(e, data) => {
                  // let _selJT = [...selJobTypes]
                  // _selJT[i] = data.value
                  setWorkToBeDone(e.value)
                }}
              />
            </div>
            <div className="w-4/12">
              <div>Select shift: {shift}</div>
              <Dropdown
                options={[
                  {
                    key: 1,
                    value: 'dayShift',
                    text: 'Day shift',
                  },
                  {
                    key: 2,
                    value: 'nightShift',
                    text: 'Night shift',
                  },
                ]}
                placeholder="Select Equipment"
                fluid
                search
                selection
                labeled
                onChange={(e, data) => {
                  setShift(data.value)
                }}
              />
            </div>
          </div>
          {/* number of trips, from and to(locations) */}
          <div className="flex flex-row gap-x-4">
            <div className="w-4/12">
              <div>Number of trips</div>
              <TextInput
                placeholder="Type quantity..."
                value={tripsToBeMade}
                setValue={setTripsToBeMade}
              />
            </div>
            <div className="w-4/12">
              <div>From(location)</div>
              <TextInput
                placeholder="Type location from..."
                value={tripFrom}
                setValue={setTripFrom}
              />
            </div>
            <div className="w-4/12">
              <div>To(Location)</div>
              <TextInput
                placeholder="Type location to..."
                value={tripTo}
                setValue={setTripTo}
              />
            </div>
          </div>
          {/* dispatch date(range), reference number */}
          <div className="flex flex-row gap-x-4">
            <div className="w-96">
              <div>NOZA Purchase Reference number</div>
              <TextInput
                placeholder="Type reference number..."
                type="text"
                value={referenceNumber}
                setValue={setReferenceNumber}
              />
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <MSubmitButton 
            intent={
              !loading && tripsToBeMade === "" && tripFrom === "" && tripTo === "" && shift === "" ? 'disabled': false
            } 
            label="Request equipment" />
            {!loading && <Loader active size="tiny" inline />}
          </div>
        </div>
      </Card>
    </div>
  )
}
