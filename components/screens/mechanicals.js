import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { UserContext } from '../../contexts/UserContext';
import MSubmitButton from '../common/mSubmitButton';
import MTextView from '../common/mTextView';
import MPagination from '../common/pagination';
import TextInput from '../common/TextIput';
import TextInputLogin from '../common/TextIputLogin';

const Mechanicals = () => {

  let { user } = useContext(UserContext)

  let role = user?.userType
  let canCreateData = user?.permissions?.canCreateData

  let [pageNumber, setPageNumber] = useState(1);
  const [mechanicals, setMechanicals] = useState([]);
  const [totalMechanicals, setTotalMechanical] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false)
  const [row, setRow] = useState('')

  const [viewPort, setViewPort] = useState('list');
  const [service, setService] = useState('');

  const newUrl = process.env.NEXT_PUBLIC_BKEND_URL
  const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD
  
  const refreshData = () => {
    setService('');
  }

  const populateMechanicals = () => {
    setLoading(true);
    fetch(`${newUrl}/api/mechanicals?page=${pageNumber}`, {
      headers: {
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      }
    })
    .then((res) => res.json())
    .then(res => {
      setMechanicals(res.mechanicals);
      setTotalMechanical(res.totalMechanicals);
      setLoading(false);
    }
    )
    .catch((err) => {
      toast.error(err)
    })
  }

  const handleSubmit = () => {
    const payload = {
      service,
    };

    fetch(`${newUrl}/api/mechanicals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`)    
      },
      body: JSON.stringify({
        payload
      })
    })
    .then((res) => res.json())
    .then((res) => {
      setViewPort('list');
      populateMechanicals();
    })
  }

  const handleChange = () => {
    const payload = {
      service
    }

    fetch(`${newUrl}/api/mechanicals/${row._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
      },
      body: JSON.stringify({payload})
    })
    .then(res => res.json())
    .then(result => {
      setViewPort('list');
      populateMechanicals();
    })
    .catch(error => toast.error(error));
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    populateMechanicals();
  }, [pageNumber])

  const getData = () => {
    let filtered = mechanicals;

    if(search) {
      filtered = mechanicals.filter(item => 
        item && item['SERVICE'].toLowerCase().includes(search.toLowerCase())
      )
    }

    return {totalCount: filtered.length, data: filtered}
  }

  function handlePageChange(e, data) {
    setPageNumber(data.activePage);
  }

  const handleUpdate = (item) => {
    setRow(item);
    setService(item['SERVICE'])
    setViewPort('change')
  }

  return (
    <div className="my-5 flex flex-col space-y-5 px-10">
      <div className="text-2xl font-semibold">
        Mechanicals Master Data
      </div>
      <div className='flex w-full flex-row items-center space-x-4'>
        {viewPort === 'list' && canCreateData && (
          <MSubmitButton
            submit={() => {
                // emptyState();
                setViewPort('new')
                setRow('');
                refreshData()
            }}
            intent="primary"
            icon={<PlusIcon className="h-5 w-5 text-zinc-800" />}
            label="New"
          />
        )}
        {(viewPort === 'new' || viewPort === 'change' || viewPort === 'operatorView') && (
          <MSubmitButton
            submit={() => {
              // setPreviousMode(false);
              // setPage(0);
              populateMechanicals();
              setViewPort('list');
            }}
            intent="primary"
            icon={<ArrowLeftIcon className="h-5 w-5 text-zinc-800" />}
            label="Back"
          />
        )}
        {viewPort === 'list' && <div className="mx-1/2 px-10 flex-1">
          <TextInput placeholder="Search..." setValue={setSearch} />
        </div>}
      </div>
      {(viewPort == 'list') && <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-4">
                  #
                </th>
                <th scope="col" class="px-6 py-4">
                  <div class="flex items-center">
                    SERVICE
                    {/* <a href="#"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"/></svg></a> */}
                  </div>
                </th>
              </tr>
            </thead>
            {!loading && <tbody>
              {getData().data.map((item) => (
                <tr onClick={() => role == 'workshop-support' && handleUpdate(item)} class={`bg-white border-b dark:bg-white-800 dark:border-white-700 ${role == 'workshop-support' && `hover:bg-gray-100 hover:cursor-pointer`}`}>
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray">
                    {item['_id']}
                  </th>
                  <td class="px-6 py-4">
                    {item['SERVICE']}
                  </td>
                </tr>
              ))}
            </tbody>}
          </table>
          {loading && 
            <div className='flex justify-center items-center my-15'>
              <h2>Loading .....</h2>
            </div>
          }
          <MPagination
            count={totalMechanicals.length}
            onPageChange={handlePageChange}
            pageSize={15}
            activePage={pageNumber}
          />
      </div>}
      
      {(viewPort == 'new' || viewPort == 'change') && (
        <div className='mt-5 w-1/2'>
          <div className='flex flex-col space-y-5'>
            <div className='w-2/3'>
              <TextInputLogin
                label="Service"
                type="text"
                placeholder="Service"
                isRequired
                value={service}
                setValue={setService}
              />
            </div>
          </div>
          <button
            className='flex items-center justify-center space-x-1 bg-blue-400 rounded  ring-1 mt-5 ring-zinc-300 shadow-sm cursor-pointer px-3 py-2  active:scale-95 hover:bg-blue-500 text-white'
            onClick={() => {viewPort == 'new' ? handleSubmit() : handleChange()}}
          >
            <div className='font-bold'>{viewPort == 'change' ? `Update Service` : `Create Service`}</div>
          </button>
        </div>
      )}
      
    </div>
  )
}

export default Mechanicals