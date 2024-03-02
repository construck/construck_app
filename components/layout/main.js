import React, { useContext } from 'react'
import { ScreenContext } from '../../contexts/ScreenContext'
import WorkData from '../screens/workdata'
import Settings from '../screens/settings'
import Dashboard from '../screens/dashboard'
import Customers from '../screens/customers'
import Equipments from '../screens/equipments'
import Projects from '../screens/projects'
import Users from '../screens/users'
import Reversals from '../screens/reversals'
import Drivers from '../screens/drivers'
import Vendors from '../screens/vendors'
import Costs from '../screens/costs'
import RequestEquipment from '../screens/requestequipment';
import Maintenance from '../screens/maintenance';
import Items from '../screens/items';
import Mechanics from '../screens/mechanics';
import Mechanical from '../screens/mechanicals';

export default function Main() {
  let { screen, setScreen } = useContext(ScreenContext)

  return (
    // <main className="sm:p-2 md:p-4 lg:p-6"></main>
    <div className="flex h-screen flex-1 flex-col overflow-auto bg-gray-100/50">
      {screen === 'workData' && <WorkData />}
      {screen === 'settings' && <Settings />}
      {screen === 'dashboard' && <Dashboard />}
      {screen === 'customers' && <Customers />}
      {screen === 'equipments' && <Equipments />}
      {screen === 'projects' && <Projects />}
      {screen === 'users' && <Users />}
      {screen === 'reversals' && <Reversals />}
      {screen === 'drivers' && <Drivers />}
      {screen === 'vendors' && <Vendors />}
      {screen === 'costs' && <Costs />}
      {screen === 'requestequipment' && <RequestEquipment />}
      {screen === 'maintenance' && <Maintenance />}
      {(screen === 'workshop' || screen === 'items') && <Items />}
      {screen === 'mechanics' && <Mechanics />}
      {screen === 'mechanical' && <Mechanical />}
    </div>
  )
}
