import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import Login from '../../pages/login'
import Main from './main'
import MenuBar from './menubar'
import 'semantic-ui-css/semantic.min.css'
import { ScreenContext } from '../../contexts/ScreenContext'

export default function Layout() {
  let { user, setUser } = useContext(UserContext)
  let { screen, setScreen } = useContext(ScreenContext)

  useEffect(() => {
    let _user = localStorage.getItem('user')
    setUser(JSON.parse(_user))
    setScreen('workData')
  }, [])

  useEffect(() => {
    setScreen('workData')
  }, [user])

  return (
    <div className="flex flex-col">
      {user?.loggedIn && (
        <div className="flex flex-row">
          <div className='fixed w-72 top-0 start-0 h-screen border-r border-gray-200'>
            <MenuBar />
          </div>
          <div className="relative w-full lg:ml-72 ml-0">
            <div className="sticky top-0 right-0 z-20 bg-white backdrop-blur-md border-b-4 border-gray-200">
              <div className='px-6 py-3.5'>Header</div>
            </div>
              <Main />
          </div>
        </div>
      )}
      {!user?.loggedIn && <Login />}
    </div>
  )
}
