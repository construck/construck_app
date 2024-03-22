import {
  WrenchIcon,
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  BellIcon,
  ChartBarIcon,
  CogIcon,
  DocumentDuplicateIcon,
  IdentificationIcon,
  TruckIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  QueueListIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/react/24/outline'
import React, { useContext } from 'react'
import { ScreenContext } from '../../contexts/ScreenContext'
import { UserContext } from '../../contexts/UserContext'

export default function MenuBar() {
  let { screen, setScreen } = useContext(ScreenContext)
  let { user, setUser } = useContext(UserContext)

  let role = user?.userType

  let canSeeDashboard = user?.permissions?.canSeeDashboard || role == 'admin'
  let canSeeDispatches =
    user?.permissions?.canSeeDispatches ||
    role == 'admin' ||
    role == 'revenue-admin'
  let canSeeUsers = user?.permissions?.canSeeUsers || role == 'admin'
  let canSeeProjects = user?.permissions?.canSeeProjects || role == 'admin'
  let canSeeCustomers = user?.permissions?.canSeeCustomers || role == 'admin'
  let canSeeEquipment = user?.permissions?.canSeeEquipment || role == 'admin'
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
  return (
    <div className="w-30 flex min-h-screen flex-col items-center justify-between overflow-y-auto bg-neutral-200 md:w-72">
      {/* Menu items */}

      <div className="flex w-full flex-col items-center">
        <div className="mt-5 mb-10 hidden text-2xl font-bold text-zinc-800 md:block">
          Shabika App
        </div>

        {canSeeDashboard && (
          <div
            className={
              screen === 'dashboard'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-neutral-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('dashboard')}
          >
            <ChartBarIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">Dashboard</div>
          </div>
        )}

        {canSeeDispatches && (
          <div
            className={
              screen === 'workData'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('workData')}
          >
            <DocumentDuplicateIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">
              Dispatch Forms
            </div>
          </div>
        )}

        {isProjectManager && (
          <div
            className={
              screen === 'costs'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('costs')}
          >
            <BanknotesIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">Costs</div>
          </div>
        )}

        {!isVendor && !isCustomer && canSeeCustomers && (
          <>
            <div
              className={
                screen === 'customers'
                  ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                  : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
              }
              onClick={() => setScreen('customers')}
            >
              <UserGroupIcon className="h-5 w-5" />
              <div className="hidden w-1/2 font-semibold md:block">
                Customers
              </div>
            </div>

            {/* <div
              className={
                screen === 'profile'
                  ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                  : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
              }
              onClick={() => setScreen('profile')}
            >
              <UserIcon className="h-5 w-5" />
              <div className="hidden w-1/2 font-semibold md:block">Profile</div>
            </div> */}
          </>
        )}

        {canSeeEquipment && (
          <div
            className={
              screen === 'equipments'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('equipments')}
          >
            <TruckIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">Equipment</div>
          </div>
        )}

        {canSeeProjects && (
          <div
            className={
              screen === 'projects'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('projects')}
          >
            <QueueListIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">Projects</div>
          </div>
        )}

        {canSeeUsers && (
          <>
            <div
              className={
                screen === 'users'
                  ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                  : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
              }
              onClick={() => setScreen('users')}
            >
              <UsersIcon className="h-5 w-5" />
              <div className="hidden w-1/2 font-semibold md:block">Users</div>
            </div>
          </>
        )}

        {canSeeDrivers && (
          <div
            className={
              screen === 'drivers'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('drivers')}
          >
            <IdentificationIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">Drivers</div>
          </div>
        )}

        {canSeeVendors && (
          <div
            className={
              screen === 'vendors'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('vendors')}
          >
            <UserGroupIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">Vendors</div>
          </div>
        )}

        {/* {canSeeSettings && (
          <div
            className={
              screen === 'settings'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('settings')}
          >
            <CogIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">Settings</div>
          </div>
        )} */}

        {isWorkshopUser && (
          <div
            className={
              screen === 'maintenance'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-slate-50 py-5 text-sky-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
            }
            onClick={() => setScreen('maintenance')}
          >
            <WrenchIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">
              Maintenance
            </div>
          </div>
        )}

        {isWorkshopUser && (
          <div className="w-full">
            <div
              className={
                screen === 'workshop' ||
                screen === 'items' ||
                screen === 'mechanics' ||
                screen === 'mechanical'
                  ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-slate-50 py-5 text-sky-700'
                  : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-black'
              }
              onClick={() => setScreen('workshop')}
            >
              <WrenchScrewdriverIcon className="h-5 w-5" />
              <div className="hidden w-1/2 font-semibold md:block">
                Workshop
              </div>
            </div>
            <div
              className={`w-full bg-gray-300`}
              hidden={
                screen == 'workshop' ||
                screen == 'items' ||
                screen == 'mechanics' ||
                screen == 'mechanical'
                  ? false
                  : true
              }
            >
              <div
                className={
                  screen == 'workshop' || screen === 'items'
                    ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-slate-200 py-3 text-sky-700'
                    : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-3 text-black'
                }
                onClick={() => setScreen('items')}
              >
                <ClipboardDocumentListIcon className="h-4 w-4" />
                <div className="hidden w-1/2 text-base font-semibold md:block">
                  Items
                </div>
              </div>
              <div
                className={
                  screen == 'mechanics'
                    ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-slate-200 py-3 text-sky-700'
                    : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-3 text-black'
                }
                onClick={() => setScreen('mechanics')}
              >
                <UserIcon className="h-4 w-4" />
                <div className="hidden w-1/2 text-base font-semibold md:block">
                  Mechanics
                </div>
              </div>
              <div
                className={
                  screen == 'mechanical'
                    ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-slate-200 py-3 text-sky-700'
                    : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-3 text-black'
                }
                onClick={() => setScreen('mechanical')}
              >
                <AdjustmentsVerticalIcon className="h-4 w-4" />
                <div className="hidden w-1/2 text-base font-semibold md:block">
                  Mechanical Issues
                </div>
              </div>
            </div>
          </div>
        )}

        {canReverseTransactions && (
          <div
            className={
              screen === 'reversals'
                ? 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 bg-gray-50 py-5 text-red-700'
                : 'flex w-full cursor-pointer flex-row items-center justify-center space-x-3 py-5 text-red-700'
            }
            onClick={() => setScreen('reversals')}
          >
            <ArrowPathIcon className="h-5 w-5" />
            <div className="hidden w-1/2 font-semibold md:block">Reversals</div>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-center px-5">
        <div className="mb-5 flex w-full flex-col justify-evenly md:flex-row">
          <ArrowLeftOnRectangleIcon
            className="mb-1 h-7 w-7 cursor-pointer text-red-400"
            onClick={() => logout()}
          />
          <BellIcon className="h-7 w-7 text-yellow-600" />
        </div>
        <div className="mb-5 hidden w-full flex-row justify-between text-sm text-zinc-800 md:flex">
          <div>
            <UserCircleIcon className="h-5 w-5" />
          </div>
          <div>{user.firstName + ' ' + user.lastName}</div>
        </div>
      </div>
    </div>
  )
}
