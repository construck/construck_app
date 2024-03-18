import React, { useContext } from 'react'
import { ScreenContext } from '../../../contexts/ScreenContext'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Menu({
  allCount,
  reversalsCount = 0,
  reportsCount = 0,
  current = 'workData',
}) {
  let { screen, setScreen } = useContext(ScreenContext)
  const tabs = [
    {
      name: 'All',
      screen: 'workData',
      count: allCount,
      current: current === 'All' ? true : false,
    },
    {
      name: 'Reversals',
      screen: 'workData',
      count: reversalsCount,
      current: current === 'Reversals' ? true : false,
    },
    {
      name: 'Reports',
      screen: 'dispatchReports',
      count: reportsCount,
      current: current === 'dispatchReports' ? true : false,
    },
  ]
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <div
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent hover:border-gray-300 hover:text-gray-700',
                  'cursor-pointer border-b-4 py-4 px-1 text-sm font-medium'
                )}
                onClick={() => setScreen(tab.screen)}
              >
                {tab.name}
                {tab?.count > 0 && (
                  <span
                    className={classNames(
                      tab.current
                        ? 'bg-orange-100 text-secondary-600'
                        : 'bg-gray-100 text-gray-600',
                      'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
