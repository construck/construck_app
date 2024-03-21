import React, { useContext } from 'react'
import { ScreenContext } from '../../contexts/ScreenContext'
import WorkData from '../screens/dispatches'
import Settings from '../screens/settings'
import Dashboard from '../screens/dashboard'
import Customers from '../screens/customers'
import Equipments from '../screens/equipments'
import Projects from '../screens/projects'
import Users from '../screens/users'
import Reversals from '../screens/dispatches/reversals'
import Drivers from '../screens/drivers'
import Vendors from '../screens/vendors'
import Costs from '../screens/costs'
import Maintenance from '../screens/maintenance';
import Items from '../screens/items';
import Mechanics from '../screens/mechanics';
import Mechanical from '../screens/mechanicals';
import DispatchReport from '../screens/dispatches/report';
import EquipmentReport from '../screens/equipments/report';

export default function Main() {
  let { screen, setScreen } = useContext(ScreenContext)

  return (
    <div className="flex h-screen flex-1 flex-col overflow-auto bg-neutral-50">
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
      {screen === 'maintenance' && <Maintenance />}
      {(screen === 'workshop' || screen === 'items') && <Items />}
      {screen === 'mechanics' && <Mechanics />}
      {screen === 'mechanical' && <Mechanical />}
      {screen === 'dispatchReports' && <DispatchReport />}
      {screen === 'equipmentReports' && <EquipmentReport />}
    </div>
  )
}
