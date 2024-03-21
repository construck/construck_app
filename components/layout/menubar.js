import {
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  IdentificationIcon,
  TruckIcon,
  UserGroupIcon,
  UsersIcon,
  QueueListIcon,
  BanknotesIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline'
import { Accordion } from 'semantic-ui-react'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { ScreenContext } from '../../contexts/ScreenContext'
import { UserContext } from '../../contexts/UserContext'
import Logo from './../../assets/images/logo.svg'
import Avatar from './../../assets/images/avatar.svg'
import Icon from './../icons'

export default function MenuBar() {
  let { screen, setScreen } = useContext(ScreenContext)
  let { user, setUser } = useContext(UserContext)

  let role = user?.userType

  let canSeeDashboard = user?.permissions?.canSeeDashboard || role == 'admin'
  let canSeeDispatches = user?.permissions?.canSeeDispatches || role == 'admin' || role == 'revenue-admin'
  let canSeeUsers = user?.permissions?.canSeeUsers || role == 'admin'
  let canSeeSettings = user?.permissions?.canSeeSettings || role == 'admin'
  let canSeeDrivers = user?.permissions?.canSeeDrivers || role == 'admin'
  let canSeeVendors = user?.permissions?.canSeeVendors || role == 'admin'
  let canReverseTransactions = user?.permissions?.canReverseTransactions
  let isVendor = role === 'vendor'
  let isCustomer =
    role === 'customer-admin' ||
    role === 'customer-project-manager' ||
    role === 'customer-site-manager'

  let isProjectManager =
    role === 'customer-project-manager' || role === 'customer-site-manager'

  let isWorkshopUser =
    role === 'workshop-manager' ||
    role === 'workshop-supervisor' ||
    role === 'recording-officer' ||
    role === 'workshop-team-leader' ||
    role == 'workshop-support' ||
    role == 'admin'

  function logout() {
    localStorage.removeItem('user')
    setUser({})
  }
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  const menuClasses = () => {
    return 'flex flex-row items-center space-x-3 py-3.5 pr-2 pl-6 font-semibold cursor-pointer leading-6'
  }
  const [activeIndex, setActiveIndex] = useState(-1) // -1 to keep none open initially

  const handleItemClick = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index)
  }
  const items = [
    { title: 'Item 1', content: 'Content of item 1' },
    { title: 'Item 2', content: 'Content of item 2' },
  ]

  return (
    <div className="w-[130px] flex min-h-screen flex-col overflow-y-auto border-r border-gray-200 bg-gray-100 md:w-[225px]">
      {/* <div className="my-5 items-center px-6 text-2xl font-bold text-zinc-800">
        Shabika App
      </div> */}
      <div className="mb-4 mt-5 w-full px-6">
        <Image
          src={Logo}
          width={224}
          height={96}
          priority
          alt="icon"
          className="w-[140px]"
        />
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              <li>
                <div
                  className={classNames(
                    screen === 'dashboard' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('dashboard')}
                >
                  {/* <span className="text-lg">
                    <Icon name="home" />
                  </span> */}
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </div>
              </li>
              <li>
                <div
                  className={classNames(
                    screen === 'workData' ||
                      screen === 'dispatchReports' ||
                      screen === 'reversals'
                      ? 'text-sky-700 bg-white'
                      : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('workData')}
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                  <span>Dispatches</span>
                </div>
              </li>
              {/* <li>
                <div
                  className={classNames(
                    screen === 'costs' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('costs')}
                >
                  <BanknotesIcon className="h-5 w-5" />
                  <span>Cost</span>
                </div>
              </li> */}
              <li>
                <div
                  className={classNames(
                    screen === 'customers' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('customers')}
                >
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Customers</span>
                </div>
              </li>
              <li>
                <div
                  className={classNames(
                    screen === 'equipments' || screen === 'equipmentReports'
                      ? 'text-sky-700 bg-white'
                      : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('equipments')}
                >
                  <TruckIcon className="h-5 w-5" />
                  <span>Equipments</span>
                </div>
              </li>
              <li>
                <div
                  className={classNames(
                    screen === 'projects' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('projects')}
                >
                  <QueueListIcon className="h-5 w-5" />
                  <span>Projects</span>
                </div>
              </li>
              <li>
                <div
                  className={classNames(
                    screen === 'users' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('users')}
                >
                  <UsersIcon className="h-5 w-5" />
                  <span>Users</span>
                </div>
              </li>
              <li>
                <div
                  className={classNames(
                    screen === 'drivers' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('drivers')}
                >
                  <IdentificationIcon className="h-5 w-5" />
                  <span>Drivers</span>
                </div>
              </li>
              <li>
                <div
                  className={classNames(
                    screen === 'vendors' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('vendors')}
                >
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Vendors</span>
                </div>
              </li>
              <li>
                <div
                  className={classNames(
                    screen === 'maintenance' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('maintenance')}
                >
                  <WrenchIcon className="h-5 w-5" />
                  <span>Maintenance</span>
                </div>
              </li>
              <li>
                <div
                  className={classNames(
                    screen === 'workshop' ||
                      screen === 'items' ||
                      screen === 'mechanics' ||
                      screen === 'mechanical'
                      ? 'text-sky-700 bg-white'
                      : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('workshop')}
                >
                  <WrenchScrewdriverIcon className="h-5 w-5" />
                  <span>Workshop</span>
                </div>
                <div
                  className={classNames(
                    screen === 'workshop' || screen === 'items'
                      ? 'text-sky-700 bg-white'
                      : null,
                    menuClasses()
                  )}
                  hidden={
                    screen == 'workshop' ||
                    screen == 'items' ||
                    screen == 'mechanics' ||
                    screen == 'mechanical'
                      ? false
                      : true
                  }
                  onClick={() => setScreen('workshop')}
                >
                  <ClipboardDocumentListIcon className="h-4 w-4" />
                  <span>Items</span>
                </div>
              </li>
              {/* <li>
                <div
                  className={classNames(
                    screen === 'reversals' ? 'text-sky-700 bg-white' : null,
                    menuClasses()
                  )}
                  onClick={() => setScreen('reversals')}
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>Reversals</span>
                </div>
              </li> */}
            </ul>
          </li>
          <li className="mt-auto">
            <div className="flex space-x-3 px-5">
              <span className="flex flex-1 items-center space-x-3">
                <Image
                  src={Avatar}
                  width={64}
                  height={64}
                  priority
                  alt="icon"
                  className="h-8 w-8"
                />
                <span aria-hidden="true">
                  {user.firstName + ', ' + Array.from(user.lastName)[0]}
                </span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 hover:bg-red-300/50">
                <ArrowLeftOnRectangleIcon
                  className="h-6 w-6 cursor-pointer text-sm text-red-500"
                  onClick={() => logout()}
                />
              </span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    // <div className="w-30 flex min-h-screen flex-col overflow-y-auto bg-neutral-200 md:w-72">
    //   {/* Menu items */}

    //     <div className="my-5 px-5 hidden text-2xl font-bold text-zinc-800 md:block">
    //       Shabika App
    //     </div>
    //   <div className="w-full space-y-6">
    //     {canSeeDashboard && (
    //       <div
    //         className={
    //           screen === 'dashboard'
    //             ? 'flex w-full cursor-pointer flex-row items-center px-3.5 text-sky-700'
    //             : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //         }
    //         onClick={() => setScreen('dashboard')}
    //       >
    //         <ChartBarIcon className="h-5 w-5" />
    //         <div className="hidden font-semibold md:block">Dashboard</div>
    //       </div>
    //     )}

    //     {canSeeDispatches && (
    //       <div
    //         className={
    //           screen === 'workData'
    //             ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //             : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //         }
    //         onClick={() => setScreen('workData')}
    //       >
    //         <DocumentDuplicateIcon className="h-5 w-5" />
    //         <div className="hidden font-semibold md:block">
    //           Dispatch Forms
    //         </div>
    //       </div>
    //     )}

    //     {isProjectManager && (
    //       <div
    //         className={
    //           screen === 'costs'
    //             ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //             : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //         }
    //         onClick={() => setScreen('costs')}
    //       >
    //         <BanknotesIcon className="h-5 w-5" />
    //         <div className="hidden font-semibold md:block">Costs</div>
    //       </div>
    //     )}

    //     {!isVendor && !isCustomer && (
    //       <>
    //         <div
    //           className={
    //             screen === 'customers'
    //               ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //               : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //           }
    //           onClick={() => setScreen('customers')}
    //         >
    //           <UserGroupIcon className="h-5 w-5" />
    //           <div className="hidden font-semibold md:block">
    //             Customers
    //           </div>
    //         </div>

    //         <div
    //           className={
    //             screen === 'equipments'
    //               ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //               : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //           }
    //           onClick={() => setScreen('equipments')}
    //         >
    //           <TruckIcon className="h-5 w-5" />
    //           <div className="hidden font-semibold md:block">
    //             Equipment
    //           </div>
    //         </div>

    //         <div
    //           className={
    //             screen === 'projects'
    //               ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //               : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //           }
    //           onClick={() => setScreen('projects')}
    //         >
    //           <QueueListIcon className="h-5 w-5" />
    //           <div className="hidden font-semibold md:block">
    //             Projects
    //           </div>
    //         </div>

    //         {/* <div
    //           className={
    //             screen === 'profile'
    //               ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //               : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //           }
    //           onClick={() => setScreen('profile')}
    //         >
    //           <UserIcon className="h-5 w-5" />
    //           <div className="hidden font-semibold md:block">Profile</div>
    //         </div> */}
    //       </>
    //     )}

    //     {canSeeUsers && (
    //       <>
    //         <div
    //           className={
    //             screen === 'users'
    //               ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //               : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //           }
    //           onClick={() => setScreen('users')}
    //         >
    //           <UsersIcon className="h-5 w-5" />
    //           <div className="hidden font-semibold md:block">Users</div>
    //         </div>
    //       </>
    //     )}

    //     {canSeeDrivers && (
    //       <div
    //         className={
    //           screen === 'drivers'
    //             ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //             : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //         }
    //         onClick={() => setScreen('drivers')}
    //       >
    //         <IdentificationIcon className="h-5 w-5" />
    //         <div className="hidden font-semibold md:block">Drivers</div>
    //       </div>
    //     )}

    //     {canSeeVendors && (
    //       <div
    //         className={
    //           screen === 'vendors'
    //             ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //             : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //         }
    //         onClick={() => setScreen('vendors')}
    //       >
    //         <UserGroupIcon className="h-5 w-5" />
    //         <div className="hidden font-semibold md:block">Vendors</div>
    //       </div>
    //     )}

    //     {/* {canSeeSettings && (
    //       <div
    //         className={
    //           screen === 'settings'
    //             ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-sky-700'
    //             : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //         }
    //         onClick={() => setScreen('settings')}
    //       >
    //         <CogIcon className="h-5 w-5" />
    //         <div className="hidden font-semibold md:block">Settings</div>
    //       </div>
    //     )} */}

    //     {isWorkshopUser && (
    //       <div
    //         className={
    //           screen === 'maintenance'
    //             ? 'flex w-full cursor-pointer flex-row items-center px-3.5 text-sky-700'
    //             : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //         }
    //         onClick={() => setScreen('maintenance')}
    //       >
    //         <WrenchIcon className="h-5 w-5" />
    //         <div className="hidden font-semibold md:block">
    //           Maintenance
    //         </div>
    //       </div>
    //     )}

    //     {isWorkshopUser && (
    //       <div className="w-full">
    //         <div
    //           className={
    //             screen === 'workshop' ||
    //             screen === 'items' ||
    //             screen === 'mechanics' ||
    //             screen === 'mechanical'
    //               ? 'flex w-full cursor-pointer flex-row items-center px-3.5 text-sky-700'
    //               : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-black'
    //           }
    //           onClick={() => setScreen('workshop')}
    //         >
    //           <WrenchScrewdriverIcon className="h-5 w-5" />
    //           <div className="hidden font-semibold md:block">
    //             Workshop
    //           </div>
    //         </div>
    //         <div
    //           className={`w-full bg-gray-200`}
    //           hidden={
    //             screen == 'workshop' ||
    //             screen == 'items' ||
    //             screen == 'mechanics' ||
    //             screen == 'mechanical'
    //               ? false
    //               : true
    //           }
    //         >
    //           <div
    //             className={
    //               screen == 'workshop' || screen === 'items'
    //                 ? 'flex w-full cursor-pointer flex-row items-center px-3.5 py-3 text-sky-700'
    //                 : 'flex w-full cursor-pointer flex-row items-center px-3.5 py-3 text-black'
    //             }
    //             onClick={() => setScreen('items')}
    //           >
    //             <ClipboardDocumentListIcon className="h-4 w-4" />
    //             <div className="hidden text-base md:block">
    //               Items
    //             </div>
    //           </div>
    //           <div
    //             className={
    //               screen == 'mechanics'
    //                 ? 'flex w-full cursor-pointer flex-row items-center px-3.5 py-3 text-sky-700'
    //                 : 'flex w-full cursor-pointer flex-row items-center px-3.5 py-3 text-black'
    //             }
    //             onClick={() => setScreen('mechanics')}
    //           >
    //             <UserIcon className="h-4 w-4" />
    //             <div className="hidden text-base md:block">
    //               Mechanics
    //             </div>
    //           </div>
    //           <div
    //             className={
    //               screen == 'mechanical'
    //                 ? 'flex w-full cursor-pointer flex-row items-center px-3.5 py-3 text-sky-700'
    //                 : 'flex w-full cursor-pointer flex-row items-center px-3.5 py-3 text-black'
    //             }
    //             onClick={() => setScreen('mechanical')}
    //           >
    //             <AdjustmentsVerticalIcon className="h-4 w-4" />
    //             <div className="hidden text-base md:block">
    //               Mechanical Issues
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}

    //     {canReverseTransactions && (
    //       <div
    //         className={
    //           screen === 'reversals'
    //             ? 'flex w-full cursor-pointer flex-row items-center px-3.5  text-red-700'
    //             : 'flex w-full cursor-pointer flex-row items-center px-3.5 text-red-700'
    //         }
    //         onClick={() => setScreen('reversals')}
    //       >
    //         <ArrowPathIcon className="h-5 w-5" />
    //         <div className="hidden font-semibold md:block">Reversals</div>
    //       </div>
    //     )}
    //   </div>

    //   <div className="flex w-full flex-col items-center px-5">
    //     <div className="mb-5 flex w-full flex-col justify-evenly md:flex-row">
    //       <ArrowLeftOnRectangleIcon
    //         className="mb-1 h-7 w-7 cursor-pointer text-red-400"
    //         onClick={() => logout()}
    //       />
    //       <BellIcon className="h-7 w-7 text-yellow-600" />
    //     </div>
    //     <div className="mb-5 hidden w-full flex-row justify-between text-sm text-zinc-800 md:flex">
    //       <div>
    //         <UserCircleIcon className="h-5 w-5" />
    //       </div>
    //       <div>{user.firstName + ' ' + user.lastName}</div>
    //     </div>
    //   </div>
    // </div>
  )
}
