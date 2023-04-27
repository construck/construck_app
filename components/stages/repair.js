import React, { useEffect } from 'react'
import {Select, Space} from 'antd';
import moment from 'moment';
import { DatePicker } from 'antd';
import MTextView from '../common/mTextView';
import dayjs from 'dayjs';
import mechanics from '../../public/data/mechanics.json';

const Repair = (props) => {
    const {
        mechanicalInspections,
        setAssignIssue,
        assignIssue,
        entryDate
    } = props;

    console.log('Entry Date ', entryDate)

    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
    };

    const disableDate = (current) => {
        return current && current < dayjs(moment(entryDate).format('YYYY-MM-DD')).endOf('day');
    }
    
    const disableCustomeDate = (current, i) => {
        return current < dayjs(moment(assignIssue[i]['startRepair']).subtract(1, 'days').format('YYYY-MM-DD')).endOf('day');
    }

    const disableCustomTime = (current, i) => ({
        disabledHours: () => (
            ((new Date()).getFullYear() == (new Date(assignIssue[i].startRepair)).getFullYear()
            && (new Date()).getMonth() == (new Date(assignIssue[i].startRepair)).getMonth()
            && (new Date()).getDate() == (new Date(assignIssue[i].startRepair)).getDate())
            ? range(0, (new Date()).getHours())
            : range((new Date()).getHours() + 1, 24)
        ),
        disabledMinutes: () => (
            ((new Date()).getFullYear() == (new Date(assignIssue[i].startRepair)).getFullYear()
            && (new Date()).getMonth() == (new Date(assignIssue[i].startRepair)).getMonth()
            && ((new Date()).getDate() == (new Date(assignIssue[i].startRepair)).getDate()) 
            && ((new Date()).getHours() == (new Date(assignIssue[i].startRepair)).getHours())))
            ? range(1, (new Date(assignIssue[i].startRepair)).getMinutes() + 1) 
            : range((new Date()).getMinutes() + 2, 60),
        disabledSeconds: () => [55, 56],    
    })

    const disabledTime = (current) => ({
        disabledHours: () => range((new Date()).getHours() + 1, 24),
        disabledMinutes: () => range((new Date()).getMinutes() + 2, 60),
        disabledSeconds: () => [55, 56],
    })

    const handleAssign = (issue, value) => {
        let found = false;

        if(assignIssue.length != 0) {
            assignIssue.map((item) => {
                if(item.issue == issue) {
                    item.mech = value,
                    item.startRepair = item.startRepair;
                    item.endRepair = item.endRepair;
                    found = true;
                    return item;
                }

                return item
            })
            if (found) {
                setAssignIssue(assignIssue);
            } else {
                setAssignIssue([...assignIssue, {issue, mech: value}])
            }
        } else {
            setAssignIssue([{issue, mech: value, startRepair: '', endRepair: ''}])
        }
    }

    const handleStartRepair = (date, value) => {
        let found = false;
        
        if(assignIssue.length != 0) {
            assignIssue.map((item) => {
                if(item.issue == value) {
                    item.mech = item.mech;
                    item.startRepair = date;
                    found = true;
                    return item;
                }

                return item
            })
            if (found) {
                setAssignIssue(assignIssue);
            } else {
                setAssignIssue([...assignIssue, {issue: value, startRepair: date, mech: [''], endRepair: ''}])
            }
        } else {
            setAssignIssue([{issue, mech: [''], startRepair: date, endRepair: ''}])
        }
    }

    const handleEndRepair = (date, value) => {
        if(assignIssue.length != 0) {
            let found = false;
            assignIssue.map((item) => {
                if(item.issue == value) {
                    item.mech = item.mech;
                    item.startRepair = item.startRepair;
                    item.endRepair = date
                    found = true;
                    return item;
                }
                return item;
            })
            if (found) {
                setAssignIssue(assignIssue);
                found = false;
            } else {
                setAssignIssue([...assignIssue, {issue: value, startRepair: '', mech: [''], endRepair: date}])
                found = false;
            }
        } else {
            setAssignIssue([{issue, mech: [''], startRepair: '', endRepair: date}])
        }
    }

    return (
        <>
            {mechanicalInspections && mechanicalInspections.map((issue, i) => (
                <div className='flex space-x-5 items-center'>
                    <div className='flex flex-col w-1/2 my-4 p-4 bg-slate-100'>
                        <div className='flex items-center justify-between'>
                            <span className='text-gray-400'>Issue: <small className='text-gray-700 text-base'>{issue}</small></span>
                            <Select
                                mode="multiple"
                                className={"rounded-2xl w-1/3"}
                                onChange={(value) => handleAssign(issue, value)}
                                placeholder="Assign Mechanics"
                                defaultValue={assignIssue.length > 0 ? (assignIssue.filter((assign) => assign.issue == issue).length > 0 && assignIssue.filter((assign) => assign.issue == issue)[0].mech) : []}
                                optionLabelProp='label'
                            >
                                {mechanics.map((item, i) => (
                                    <Select.Option key={i} value={item[' FIRST NAME '] + ' ' + item[' LAST NAME ']} label={item[' FIRST NAME '] + ' ' + item[' LAST NAME ']}>
                                        <Space>
                                            {item[' FIRST NAME '] + ' ' + item[' LAST NAME ']}
                                        </Space>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className='flex space-x-5 w-1/2 my-4 p-4 bg-slate-100'>
                        {console.log('Assign Issue I2 ', assignIssue)}
                        <div className='flex items-center'>
                            <div className='flex flex-row'>
                                <MTextView content={"Start Repair:"} />
                                <div className="text-sm text-red-600">*</div>
                            </div>
                            <div className='w-2/3 mt-3 ml-4'>
                                {assignIssue[i] && assignIssue[i]['startRepair'] ? (
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabledDate={disableDate}
                                        disabledTime={disabledTime}
                                        showTime
                                        value={(((assignIssue.length > 0 && assignIssue[i]) && assignIssue[i]['startRepair'])) && moment(assignIssue[i]['startRepair'])}
                                        disabled
                                        // onChange={(values, dateStrings) => handleStartRepair(dateStrings, issue)}
                                    />
                                ) : (
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabledDate={disableDate}
                                        disabledTime={disabledTime}
                                        showTime
                                        placeholder='Select Start'
                                        onChange={(values, dateStrings) => handleStartRepair(dateStrings, issue)}
                                    />
                                )}
                            </div>
                        </div>
                        {(assignIssue[i] && assignIssue[i]['startRepair']) && <div className='flex items-center'>
                            <div className='flex flex-row'>
                                <MTextView content={"End Repair:"} />
                                <div className="text-sm text-red-600">*</div>
                            </div>
                            <div className='w-2/3 mt-3 ml-4'>
                                {assignIssue[i]['endRepair'] ? (
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabledDate={(current) => disableCustomeDate(current, i)}
                                        disabledTime={(value) => disableCustomTime(value, i)}
                                        showTime
                                        value={((assignIssue.length > 0 && assignIssue[i]) && assignIssue[i]['endRepair']) ? moment(assignIssue[i]['endRepair']) : ''}
                                        disabled
                                        // onChange={(values, dateStrings) => handleEndRepair(dateStrings, issue)}
                                    />
                                ) : (
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabledDate={(current) => disableCustomeDate(current, i)}
                                        disabledTime={(value) => disableCustomTime(value, i)}
                                        showTime
                                        placeholder='Select End'
                                        onChange={(values, dateStrings) => handleEndRepair(dateStrings, issue)}
                                    />
                                )}
                            </div>
                        </div>}
                    </div>
                </div>
            ))}
        </>
    )
}

export default Repair