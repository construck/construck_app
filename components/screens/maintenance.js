import React, { useEffect, useState } from 'react'
import MSubmitButton from '../common/mSubmitButton';
import { PlusIcon } from '@heroicons/react/24/solid';
import TextInput from '../common/TextIput';
import { ArrowDownTrayIcon, ArrowLeftIcon, CheckIcon, ClockIcon, FolderPlusIcon, ListBulletIcon, QueueListIcon, UsersIcon, WrenchScrewdriverIcon, XCircleIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import JobCard from '../common/jobCard';
import JobCards from '../stages/jobCard';
import PartsRequisitions from '../stages/partsRequisition';
import InspectionDiagnosis from '../stages/inspectionDiagnosis';
import Repair from '../stages/repair';
import Testing from '../stages/testing';
import GatePass from '../stages/gatePass';
import MainStatusCard from '../common/mainStatusCard';
import { Modal, Button, Dropdown } from 'antd';
import moment from 'moment';
import MTextView from '../common/mTextView';
import PrintableItems from '../stages/printableItems';
import OperatorCard from '../common/operatorCard';
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'

const Maintenance = () => {
    
    const canCreateData = true;
    const role = JSON.parse(localStorage.getItem('user')).userType;

    const [filterBy, setFilterBy] = useState('all');
    const [nAvailable, setNAvailable] = useState(0);
    const [nApproved, setNApproved] = useState(0);
    const [nCanceled, setNCanceled] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [viewPort, setViewPort] = useState('list');
    const [search, setSearch] = useState('');
    const [projectList, setProjectList] = useState([]);
    const [eqList, setEqList] = useState([]);
    const [usersList, setUsers] = useState([]);
    const [jobCards, setJobCards] = useState([]);
    const [row, setRow] = useState('');
    const [page, setPage] = useState(0);
    const [isReason, setIsReason] = useState(false);
    const [checkReason, setCheckReason] = useState(false);
    const [updatedAt, setUpdatedAt] = useState('');

    // Form States
    const [entryDate, setEntryDate] = useState('');
    const [driver, setDriver] = useState('');
    const [carPlate, setCarPlate] = useState('');
    const [mileages, setMileages] = useState('');
    const [location, setLocation] = useState('');
    const [startRepair, setStartRepair] = useState('');
    const [endRepair, setEndRepair] = useState('');
    const [inspectionTools, setInspectionTools] = useState([]);
    const [mechanicalInspections, setMechanicalInspections] = useState([]);
    const [startIndexNotApplicable, setStartIndxNotApp] = useState(false);
    const [sourceItem, setSourceItem] = useState('');
    const [operator, setOperator] = useState('')
    const [assignIssue, setAssignIssue] = useState([]);
    const [itemsRequest, setItemsRequest] = useState([]);
    const [transferParts, setTransferParts] = useState([]);
    const [transferData, setTransferData] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([{value: '', index: 0}]);
    const [inventoryData, setInventoryData] = useState([]);
    const [reason, setReason] = useState('');
    const [isViewed, setIsViewed] = useState('not viewed');
    const [operatorApproval, setOperatorApproval] = useState([]);
    const [teamApproval, setTeamApproval] = useState(false);
    const [supervisorApproval, setSupervisorApproval] = useState(false);
    const [operatorNotApplicable, setOperatorNotApp] = useState(false);

    const url = process.env.NEXT_PUBLIC_BKEND_URL
    const newUrl = process.env.NEXT_PUBLIC_BKEND_URL
    const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
    const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD
    let foundItem = '';

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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setCheckReason(false);
        setReason('');
        setIsReason(false);
        handleUpdate();
        setIsModalOpen(false);
        setPage(4);
    };

    const handleApproveReject = () => {
        handleUpdate();
        setPage(4);
        setIsModalOpen(false);
        setCheckReason(false);
    }

    const handleCancel = () => {
        setIsReason(false);
        setIsModalOpen(false);
    };
    
    const handleReject = () => {
        setIsReason(true);
        setCheckReason(false);
        setCheckReason(true);
    }

    const emptyState = () => {
        setEntryDate('');
        setMileages('');
        setDriver('');
        setCarPlate('');
        setLocation('');
        setInspectionTools([]);
        setMechanicalInspections([]);
        setStartIndxNotApp(false);
        setSourceItem('');
        setAssignIssue([]);
        setItemsRequest([]);
        setTransferParts([]);
        setTransferData([]);
        setInventoryItems([{value: '', index: 0}]);
        setInventoryData([]);
        setIsReason(false);
        setReason('');
        setIsViewed('not viewed');
        setOperatorApproval([]);
        setTeamApproval(false);
        setSupervisorApproval(false)
        setStartRepair('');
        setEndRepair('');
        setOperatorNotApp(false);
    }

    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
    };

    const disableDate = (current) => {
        return current && current > dayjs().endOf('day');
    }

    // const disableCustomTime = (current) => ({
    //     disabledHours: () => (
    //         ((new Date()).getFullYear() == (new Date(startRepair)).getFullYear()
    //         && (new Date()).getMonth() == (new Date(startRepair)).getMonth()
    //         && (new Date()).getDate() == (new Date(startRepair)).getDate())
    //         ? range(0, (new Date()).getHours())
    //         : range((new Date()).getHours() + 1, 24)
    //     ),
    //     disabledMinutes: () => (
    //         ((new Date()).getFullYear() == (new Date(startRepair)).getFullYear()
    //         && (new Date()).getMonth() == (new Date(startRepair)).getMonth()
    //         && ((new Date()).getDate() == (new Date(startRepair)).getDate()) 
    //         && ((new Date()).getHours() == (new Date(startRepair)).getHours())))
    //         ? range(1, (new Date(startRepair)).getMinutes() + 1) 
    //         : range((new Date()).getMinutes() + 2, 60),
    //     disabledSeconds: () => [55, 56],    
    // })

    const disabledTime = (current) => ({
        disabledHours: () => range((new Date()).getHours() + 1, 24),
        disabledMinutes: () => range((new Date()).getMinutes() + 2, 60),
        disabledSeconds: () => [55, 56],
    })

    const setJobCardsToUpdate = (data) => {
        setRow(data)
        setEntryDate(data.entryDate)
        setCarPlate(data.plate)
        setDriver(data.driver)
        setLocation(data.location)
        setStartRepair(data.startTime)
        setOperator(data.operator);
        setEndRepair(data.finishTime)
        setMileages(data.mileages)
        setInspectionTools(data.inspectionTools)
        setMechanicalInspections(data.mechanicalInspections)
        setAssignIssue(data.assignIssue)
        setTeamApproval(data.teamApproval)
        setInventoryData(data.inventoryData)
        setInventoryItems(data.inventoryItems.length < 1 ? [{value: '', index: 0}] : data.inventoryItems)
        setTransferData(data.transferData)
        setSourceItem(data.sourceItem)
        setTransferParts(data.transferParts)
        setReason(data.reason)
        setIsViewed(data.isViewed)
        setOperatorApproval(data.operatorApproval)
        setSupervisorApproval(data.supervisorApproval)
        setUpdatedAt(data.updated_At)
        setOperatorNotApp(data.operatorNotApplicable)
        setPage(
            (data && data.status) == 'entry'
            ? 1 
            : (data && data.status) == 'diagnosis'
            ? 1
            : ((data && data.status) == 'requisition' && data.isViewed == 'approved')
            ? 3
            : (data && data.status) == 'requisition'
            ? 2
            : ((data && data.status) == 'repair' && (data.finishTime) && data.finishTime.length > 1)
            ? 6
            : (data && data.status) == 'repair'
            ? 5
            : (data && data.jobCard_status) == 'closed'
            ? 7
            : (data && data.status) == 'testing'
            ? 6
            : (data && data.status) == 'pass'
            ? 7
            : 0
        )
        
        if((role == 'workshop-manager' && (data && data.status) && data.status == 'requisition')) {
            showModal()
        } else if(role == 'operatorOfficer' || role == 'workshop-team-leader' || (role == 'workshop-supervisor' && data.jobCard_status == 'opened')) {
            setViewPort('operatorView');
        } else {
            setViewPort((data && data.status) && 'change');
        }
    }

    const download = (query) => {
        fetch(`${newUrl}/api/maintenance`, {
            headers: {
                Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            }
        })
        .then((res) => res.json())
        .then((res) => {
            let data = [];
            if(query == 'general') {
                for(let i = 0; i < res.length; i++) {
                    if(res[i].sourceItem == 'Inventory') {
                        for(let j = 0; j < res[i].inventoryData.length; j++) {
                            for(let v = 0; v < res[i].inventoryData[j].length; v++) {
                                data['Mechanical issues'] = res[i].inventoryData[j][v]['issue'];
                                data['Qty requested'] = res[i].inventoryData[j][v]['qty'];
                                data['Qty recieved'] = res[i].inventoryData[j][v]['recQty'];

                                data = [...data, data]
                            }
                        }
                    }
                }

                // data = res.map(r => {
                //     if(r.sourceItem == 'Inventory') {
                //         r.inventoryData.map((inv, i) => {
                //             inv[i].map((in) => (

                //             ))
                //         })
                //     }
                //     r['inventories'] = r.inventoryData;
                //     r['location'] = r.location.text;
                //     r['equipment'] = r.plate.text;
                //     r['stage'] = r.status;
    
                //     delete r.plate;
                //     delete r.status;
                //     delete r.inventoryItems;
                //     delete r.inventoryData;
    
                //     return r;
                // })
            }
            
            exportToCSV(data,
            `Detailed Workshop ${moment().format('DD-MMM-YYYY HH-mm-ss')}`
            )
        })
        .catch((err) => {
            console.log('Error ', err)
        })
    }

    const populateJobCards = () => {
        fetch(`${newUrl}/api/maintenance`, {
            headers: {
                Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
        })
        .then(res => res.json())
        .then(res => {
            let availableCards = res.filter((result) => result.status == 'requisition' && (!result.isViewed) || result.isViewed == 'not viewed');
            let approvedCards = res.filter((result) => result.status == 'requisition' && (!result.isViewed) || result.isViewed == 'approved');
            let canceledCards = res.filter((result) => result.status == 'requisition' && (!result.isViewed) || result.isViewed == 'denied');
            setNAvailable(availableCards.length);
            setNApproved(approvedCards.length);
            setNCanceled(canceledCards.length);
            setJobCards(res)
        }
        )
        .catch((err) => {
            toast.error(err)
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        fetch(`${url}/projects/v2`, {
            headers: {
                Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
        })
           .then((res) => res.json())
           .then(res => {
            let list = res;
            let projectOptions = list.map((p) => {
                return {
                    key: p._id,
                    value: p._id,
                    text: p.prjDescription,
                    customer: p.customer
                }
            })
            setProjectList(projectOptions);
           })
           .catch((err) => {
                toast.error(err)
            })
    }, [])
    
    useEffect(() => {
        fetch(`${url}/equipments`, {
            headers: {
                Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
        })
           .then((res) => res.json())
           .then(res => {
            let list = res.equipments;
            console.log('List ', list)
            let eqOptions = list.map((p) => {
                return {
                    key: p._id,
                    value: p._id,
                    text: p.plateNumber,
                    status: p.eqStatus,
                    eqDescription: p.eqDescription,
                    eqStatus: p.eqStatus
                }
            })
            setEqList(eqOptions);
           })
           .catch((err) => {
                toast.error(err)
                // setLoadingData(false)
            })
    }, [])

    useEffect(() => {
        fetch(`${url}/users`, {
            headers: {
                Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
        })
           .then((res) => res.json())
           .then(res => {
            let list = res;
            let userOptions = 
                list.map((p) => ({
                    key: p._id,
                    value: p._id,
                    text: p.firstName + ' ' + p.lastName,
                    email: p.email,
                    username: p.username,
                    phone: p.phone,
                    userType: p.userType
                })
            )
            setUsers(userOptions);
           })
           .catch((err) => {
                toast.error(err)
                // setLoadingData(false)
            })
    }, [])

    useEffect(() => {
        populateJobCards();
    }, [])

    const handleSubmit = () => {
        const payload = {
            entryDate,
            carPlate,
            mileages,
            driver,
            location,
            status: 'entry'
        }

        fetch(`${newUrl}/api/maintenance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
            body: JSON.stringify({
              payload
            }),
          })
        .then((res) => res.json())
        .then((res) => {
            setRow(res)
            setPage(1)
        })
        .catch((err) => toast.error('Error Occured!'))
    }

    const handleUpdate = () => {
        const payload = {
            entryDate,
            carPlate,
            mileages,
            driver,
            location,
            inspectionTools,
            startRepair,
            endRepair,
            mechanicalInspections,
            assignIssue,
            transferData,
            inventoryData,
            inventoryItems,
            operatorApproval,
            operator,
            sourceItem,
            transferParts,
            operatorNotApplicable,
            teamApproval: role === 'workshop-team-leader' ? true : teamApproval,
            supervisorApproval: role === 'workshop-supervisor' ? true : row.supervisorApproval,
            isViewed:
                (role === 'workshop-manager' && row.status == 'requisition') ?
                    (isReason) ? 'denied' : 'approved' : isViewed,
            status: role != 'workshop-manager' ? page == 1 
            ? 'diagnosis'
            : page == 2 || page == 4
            ? 'requisition'
            : page == 5
            ? 'repair'
            : page == 6
            ? 'testing'
            : page == 7 && 'pass' : 'requisition',
            reason: (role == 'workshop-manager' && !checkReason) ? '' : reason
        }

        fetch(`${newUrl}/api/maintenance/${row._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
            },
            body: JSON.stringify({payload})
        })
        .then(res => res.json())
        .then(result => {
            populateJobCards();
            if((page == 2 && result.status == 'requisition' && result.sourceItem == 'Inventory') && role == 'recording-officer') {
                
                fetch(`${url}/email/send`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization:
                        'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
                    },
                    body: JSON.stringify({
                      workPayload: {
                        jobCard_Id: result.jobCard_Id,
                        plate: result.plate,
                        postingDate: moment(Date.now()).format('DD-MMMM-YYYY LT'),
                      },
                      from: 'appinfo@construck.rw',
                      to: 'kevingarry97@gmail.com',
                      subject: 'Work Notification',
                      messageType: 'notification',
                    }),
                })
                    .then((res) => res.json())
                    .then((res) => {})
                    .catch((err) => console.log(err))

                setViewPort('list')
            } else if ((page == 2 && result.status == 'requisition' && result.sourceItem == 'Transfer') && role == 'recording-officer') {
                setPage(5);
            } 
            else if(result.status == 'repair' && result.assignIssue.find(item => item.endRepair == "")) {
                populateJobCards();
                setViewPort('list')
            } 
            else if(role == 'workshop-supervisor' && (result.supervisorApproval == true && result.jobCard_status == 'closed')) {
                populateJobCards();
                setPage(7)
            }
            else if(role == 'recording-officer' && result.status == 'testing') {
                populateJobCards();
                setViewPort('list')
            }
            else
                setPage(page + 1)
        })
        .catch(err => toast.error(err));
    }

    const getData = () => {
        let filtered = jobCards;
        if(search)
            filtered = jobCards.filter(jobCard => 
                jobCard.plate.text.toLowerCase().includes(search.toLowerCase()) 
                ||
                jobCard.jobCard_Id.toLowerCase().includes(search.toLowerCase())
                ||
                jobCard.driver.text.toLowerCase().includes(search.toLowerCase())
            )
        return {totalCount: filtered.length, data: filtered}
    }

    // Multi steps
    const componentList = [
        <JobCards 
            entryDate={entryDate}
            setEntryDate={setEntryDate}
            driver={driver}
            setDriver={setDriver}
            carPlate={carPlate}
            setCarPlate={setCarPlate}
            mileages={mileages}
            setMileages={setMileages}
            location={location}
            setLocation={setLocation}
            startIndexNotApplicable={startIndexNotApplicable}
            setStartIndxNotApp={setStartIndxNotApp}
            disableDate={disableDate}
            disabledTime={disabledTime}
            usersList={usersList}
            eqList={eqList}
            projectList={projectList}
            viewPort={viewPort}
        />,
        <InspectionDiagnosis 
            inspectionTools={inspectionTools}
            setInspectionTools={setInspectionTools}
            mechanicalInspections={mechanicalInspections}
            setMechanicalInspections={setMechanicalInspections}
        />,
        <PartsRequisitions 
            sourceItem={sourceItem}
            setSourceItem={setSourceItem}
            itemsRequest={itemsRequest}
            setItemsRequest={setItemsRequest}
            mechanicalInspections={mechanicalInspections}
            setPage={setPage}
            eqList={eqList}
            mileages={mileages}
            setTransferParts={setTransferParts}
            transferParts={transferParts}
            transferData={transferData}
            setTransferData={setTransferData}
            inventoryItems={inventoryItems}
            inventoryData={inventoryData}
            setInventoryItems={setInventoryItems}
            setInventoryData={setInventoryData}
            reason={reason}
        />,
        <PrintableItems 
            row={row} 
            setPage={setPage}
        />,
        <PartsRequisitions 
            sourceItem={sourceItem}
            setSourceItem={setSourceItem}
            itemsRequest={itemsRequest}
            setItemsRequest={setItemsRequest}
            mechanicalInspections={mechanicalInspections}
            page={page}
            setPage={setPage}
            mileages={mileages}
            setTransferParts={setTransferParts}
            transferParts={transferParts}
            transferData={transferData}
            setTransferData={setTransferData}
            inventoryItems={inventoryItems}
            inventoryData={inventoryData}
            setInventoryItems={setInventoryItems}
            setInventoryData={setInventoryData}
            reason={reason}
        />,
        <Repair
            entryDate={entryDate}
            mechanicalInspections={mechanicalInspections}
            inspectionTools={inspectionTools}
            itemsRequest={itemsRequest}
            startRepair={startRepair}
            endRepair={endRepair}
            setStartRepair={setStartRepair}
            setEndRepair={setEndRepair}
            row={row}
            setAssignIssue={setAssignIssue}
            assignIssue={assignIssue}
        />,
        <Testing 
            userList={usersList}
            operator={operator}
            setOperator={setOperator}
            operatorNotApplicable={operatorNotApplicable}
            setOperatorNotApp={setOperatorNotApp}
        />,
        <GatePass 
            row={row}
        />
    ];

    const items = [
        {
          key: '1',
          label: (
            <a className='flex items-center' onClick={() => download('general')}>
              <ListBulletIcon className='w-6 h-6 mr-3' />
              General Report
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a className='flex items-center' onClick={() => download('mechanic')}>
              <UsersIcon className='w-5 h-5 mr-3' />
              Mechanic Productivity Report
            </a>
          ),
        },
        {
          key: '3',
          label: (
            <a className='flex items-center' onClick={() => download('items')}>
              <WrenchScrewdriverIcon className='w-5 h-5 mr-3' />
              Items Requisition Report
            </a>
          ),
        },
    ];

    return (
        <div className="my-5 flex flex-col space-y-5 px-10">
            <div className="text-2xl font-semibold">
                {viewPort == 'list' ? 'Maintenance Centre' : page == 0 
                ? 'Job Card'
                : page == 1
                ? 'Diagnosis & Inspection'
                : page == 2 || page == 4
                ? 'Parts Requisition'
                : page == 3
                ? 'Print Requisition'
                : page == 5
                ? 'Repair'
                : page == 6
                ? 'Testing Equipment'
                : 'Gate Pass' 
                }
            </div>
            <div className="flex w-full flex-row items-center space-x-4">
                {viewPort === 'list' && canCreateData && (
                    <MSubmitButton
                        submit={() => {
                            emptyState();
                            setViewPort('new')
                        }}
                        intent="primary"
                        icon={<PlusIcon className="h-5 w-5 text-zinc-800" />}
                        label="New"
                    />
                )}
                {viewPort === 'list' && (
                    <div className="mx-auto px-10 flex-1">
                        <TextInput placeholder="Search..." setValue={setSearch} />
                    </div>
                )}
                {viewPort === 'list' && (
                    <div className="flex flex-row items-center space-x-5">
                        <MainStatusCard
                            data={{ title: 'Available', content: nAvailable }}
                            intent={
                                filterBy === 'available' || filterBy === 'all'
                                    ? 'available'
                                    : ''
                            }
                            icon={<FolderPlusIcon className="h-5 w-5" />}
                            onClick={() =>
                            filterBy === 'available'
                                ? setFilterBy('all')
                                : setFilterBy('available')
                            }
                        />
                        <MainStatusCard
                            data={{ title: 'Approved', content: nApproved }}
                            intent={
                            filterBy === 'approved' || filterBy === 'all'
                                ? 'approved'
                                : ''
                            }
                            icon={<CheckIcon className="h-5 w-5" />}
                            onClick={() =>
                            filterBy === 'approved'
                                ? setFilterBy('all')
                                : setFilterBy('approved')
                            }
                        />
                        <MainStatusCard
                            data={{ title: 'Canceled', content: nCanceled }}
                            intent={
                            filterBy === 'canceled' || filterBy === 'all'
                                ? 'canceled'
                                : ''
                            }
                            icon={<XCircleIcon className="h-5 w-5" />}
                            onClick={() =>
                            filterBy === 'Canceled'
                                ? setFilterBy('all')
                                : setFilterBy('Canceled')
                            }
                        />
                    </div>
                )}
                {viewPort === 'list' && (
                    <Dropdown menu={{ items }} placement="bottomRight">
                        <QueueListIcon
                            className="h-10 w-10 cursor-pointer"
                            // onClick={() => download()}
                        />
                    </Dropdown>
                    
                )}
                
                {(viewPort === 'new' || viewPort === 'change' || viewPort === 'operatorView') && (
                    <MSubmitButton
                        submit={() => {
                            setPage(0);
                            populateJobCards();
                            setViewPort('list')
                        }}
                        intent="primary"
                        icon={<ArrowLeftIcon className="h-5 w-5 text-zinc-800" />}
                        label="Back"
                    />
                )}
            </div>
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                on
                width={800}
                footer={
                    (!checkReason ? [
                        <Button className='pt-0 pb-2' key="back" onClick={handleReject}>
                            Reject Request
                        </Button>,
                        <Button className='pt-0 pb-2' key="submit" type="primary" onClick={handleOk}>
                            Approve
                        </Button>
                    ] : [
                        <Button disabled={reason.length < 1} className='pt-0 pb-2' key="submit" type="primary" onClick={handleApproveReject}>
                            Apply Denial
                        </Button>
                    ])
                }
            >
                <div className='py-10'>
                    <div className='flex justify-between'>
                        <h5 className='text-sm text-gray-400'>Job Card: <b className='text-gray-600'>{row.jobCard_id}</b></h5>
                        <div className='flex space-x-2 text-lg text-gray-400'>
                            <ClockIcon width={15} /> 
                            <small className='text-gray-600 font-bold'>{moment(row.entryDate).format('DD-MMMM-YYYY LT')}</small>
                        </div>
                    </div>
                    <h5 className='mt-5 text-sm text-gray-400'>Eq. Plate: <b className='text-gray-600'>{row.plate && row.plate.text}</b></h5>
                    <h5 className='mt-7 text-sm text-gray-400'>Mech. Issues: </h5>
                    <div className='flex items-start space-x-3'>
                        {row.inventoryData && row.inventoryData.map((item) => (
                            <div className='bg-gray-100 px-5 mt-2 py-2'>
                                {item.map((value, i) => {
                                    if(foundItem != value.issue) {
                                        foundItem = value.issue;
                                        return (
                                            <>
                                                <h6 className='p-0 m-0'>{value.issue}</h6>
                                                <small>{value.item}: <b>{value.qty}</b></small>
                                                <br />
                                            </>
                                        )
                                    } else {
                                        return (
                                            <>
                                                <small>{value.item}: <b>{value.qty}</b></small>
                                                <br />
                                            </>
                                        )
                                    }

                                })}
                                

                            </div>
                        ))}
                    </div>
                    {(isReason) && (
                        <div className='flex w-full flex-col space-y-1 mt-5'>
                            <div className='flex flex-row items-center'>
                                <MTextView content={'Denial Reason'} />
                                <div className='text-sm text-red-600'>*</div>
                            </div>
                            <input type={'text'} name="reason" value={reason} onChange={({target}) => setReason(target.value)} className="w-full flex-grow rounded-sm border-gray-100 py-2.5 px-3 text-sm font-medium shadow-none ring-1 ring-gray-200 transition duration-200 ease-in-out hover:ring-1 hover:ring-gray-400 focus:outline-none focus:ring-blue-300" placeholder={'Specify your reason'} />
                        </div>
                    )}
                </div>
            </Modal>
            {/* Displaying Job Cards List */}
            {viewPort === 'list' && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {getData().totalCount > 0 ? getData().data.map((c) => {
                        return (
                            <JobCard 
                                data={{
                                    _id: c._id,
                                    status: c.status,
                                    jobCard_id: c.jobCard_Id,
                                    finishTime: c.endRepair,
                                    startTime: c.startRepair,
                                    plate: c.plate,
                                    driver: c.driver,
                                    operator: c.operator,
                                    location: c.location,
                                    operatorApproval: c.operatorApproval,
                                    teamApproval: c.teamApproval,
                                    supervisorApproval: c.supervisorApproval,
                                    entryDate: c.entryDate,
                                    mileages: c.mileage,
                                    inspectionTools: c.inspectionTools,
                                    mechanicalInspections: c.mechanicalInspections,
                                    assignIssue: c.assignIssue,
                                    inventoryData: c.inventoryData,
                                    inventoryItems: c.inventoryItems,
                                    sourceItem: c.sourceItem,
                                    transferData: c.transferData,
                                    transferParts: c.transferParts,
                                    isViewed: c.isViewed,
                                    reason: c.reason,
                                    jobCard_status: c.jobCard_status,
                                    updated_At: c.updated_At,
                                    operatorNotApplicable: c.operatorNotApplicable
                                }}
                                updateMe={setJobCardsToUpdate}
                                canCreateData={canCreateData}
                            />
                        )
                    }) : (
                        <h5 className='text-center'>No Data ...</h5>
                    )}
                </div>
            )}
            
            {/* Creating Job Cards Forms*/}
            {(viewPort === 'new') && (
                <div className='mt-5 w-1/2'>
                    {role == 'recording-officer' ? componentList[page] : <h5 className='text-lg font-medium mt-5 text-center'>Logged in user is not authorized for job card creation</h5>}
                    <div className='flex mt-10 space-x-5'>
                        {page != 0 && 
                            <MSubmitButton submit={() => setPage(page - 1)} label={`Go to Previous`} intent={'primary'} />
                        }
                        {role == 'recording-officer' && <MSubmitButton submit={page == 0 ? handleSubmit : handleUpdate} label={`${page == 2 ? `Submit Request` : page == 0 ? `Create Job Card` : `Save & Continue`}`} />}
                    </div>
                </div>
            )}

            {viewPort === 'change' && (
                <div className={`mt-5 ${row && row.isViewed == 'approved' ? 'w-3/4' : 'w-1/2'}`}>
                    {componentList[page]}
                    {(row && (page != 3 && page != 7)) && <div className='flex mt-10 space-x-5'>
                        {(page != 0) &&
                            <MSubmitButton intent='primary' submit={() => setPage(page - 1)} label={`Go to Previous`} />
                        }
                        <MSubmitButton submit={handleUpdate} label={`${page == 2 ? `Submit Request` : `Save & Continue`}`} />
                    </div>}
                </div>
            )}

            {viewPort == 'operatorView' && (
                <div className='mt-5 w-3/4'>
                    <OperatorCard 
                        row={row}
                        role={role}
                        teamApproval={teamApproval}
                        operatorApproval={operatorApproval}
                        setOperatorApproval={setOperatorApproval}
                    />
                    <div className='flex mt-10 space-x-5'>
                        {role != 'workshop-team-leader' && <MSubmitButton intent='danger' submit={() => {
                                setTeamApproval(false);
                                setViewPort('list')
                            }} 
                            intentColor={'danger'}
                            label={`Denie Approval`} 
                        />}
                        <MSubmitButton 
                            submit={() => {
                                handleUpdate(); 
                                setViewPort('list')
                            }}
                            intent={'success'}
                            intentColor={'success'}
                            label={`${role == 'workshop-supervisor' ? 'Authorise Gate Pass' : role == 'workshop-team-leader' ? 'Validate Repairs' : 'Save & Continue'}`} 
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Maintenance;