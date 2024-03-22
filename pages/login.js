import { BadgeCheckIcon } from '@heroicons/react/24/outline'
import React, { useContext, useState } from 'react'
import TextInput from '../components/common/TextIput'
import { UserContext } from '../contexts/UserContext'
import { toast, ToastContainer } from 'react-toastify'
import { Dropdown, Loader } from 'semantic-ui-react'
import 'react-toastify/dist/ReactToastify.css'
import 'semantic-ui-css/semantic.min.css'
import MTextView from '../components/common/mTextView'
import { LanguageContext } from '../contexts/languageContext'
import { labels, messages } from '../utils/labels'
import TextInputLogin from '../components/common/TextIputLogin'
import Logo from '@/assets/images/logo.svg'
import Image from 'next/image'
import { Card } from '@/components/atoms'

export default function Login() {
  const { user, setUser } = useContext(UserContext)
  const { language, setLanguage } = useContext(LanguageContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [fullNames, setFullNames] = useState('')
  const [agency, setAgency] = useState('')
  const [agencyWebsite, setAgencyWebsite] = useState('')
  const [agencyEmail, setAgencyEmail] = useState('')
  const [agencyPhone, setAgencyPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [viewPort, setViewPort] = useState('login')
  const [accountType, setAccountType] = useState('')
  const [country, setCountry] = useState('')
  const [submitting, setSubmitting] = useState(false)
  let url = process.env.NEXT_PUBLIC_BKEND_URL
  let apiUsername = process.env.NEXT_PUBLIC_API_USERNAME
  let apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD

  function login() {
    setSubmitting(true)
    try {
      fetch(`${url}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          let _user = resp.user
          if (resp.message === 'Allowed') {
            _user.loggedIn = true
            setUser(_user)
            localStorage.setItem('user', JSON.stringify(_user))
          } else {
            toast.error(resp.message, {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          }

          setSubmitting(false)
        })
        .catch((err) => {
          toast.error(`${messages[`${language}`].checkDataService}`)
          setSubmitting(false)
        })
    } catch (err) {
      toast.error(JSON.stringify(err), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      setSubmitting(false)
    }
  }

  function resetPassword() {
    setSubmitting(true)
    try {
      fetch(`${url}/users/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          email,
          oldPassword: password,
          newPassword,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            toast.error(`${res.message}`)
            setSubmitting(false)
          } else {
            fetch(`${url}/email/send`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
              },
              method: 'POST',
              body: JSON.stringify({
                to: email,
                from: 'appinfo@construck.rw',
                subject: 'Password has been reset.',
                messageType: 'passwordReset',
                password: newPassword,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                setSubmitting(false)
                setPassword('')
                setViewPort('login')
              })
              .catch((err) => {})
          }
        })
        .catch((err) => {
          toast.error(`${messages[`${language}`].checkDataService}`)
          setSubmitting(false)
        })
    } catch (err) {
      toast.error(JSON.stringify(err), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      setSubmitting(false)
    }
  }

  function signup() {
    try {
      fetch(`https://Construck App-backend.herokuapp.com/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + window.btoa(`${apiUsername}:${apiPassword}`),
        },
        body: JSON.stringify({
          password,
          email,
          names: fullNames,
          agency,
          accountType,
          agencyWebsite,
          agencyEmail,
          agencyPhone,
          country,
          role: 'agent-admin',
        }),
      })
        .then((resp) => {
          return resp.json()
        })
        .then((resp) => {
          if (resp.error) {
            toast.error(resp.message, {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          } else {
            setViewPort('login')
            toast.success('You are registered!', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          }
        })
    } catch (err) {
      toast.error(JSON.stringify(err), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  function _setUsername(value) {
    setUsername(value)
  }

  function _setPassword(value) {
    setPassword(value)
  }

  function _setCurrentPassword(value) {
    _setCurrentPassword(value)
  }

  function _setNewPassword(value) {
    setNewPassword(value)
  }

  function _setEmail(value) {
    setEmail(value)
  }

  function _setAgencyEmail(value) {
    setAgencyEmail(value)
  }

  function _setFullNames(value) {
    setFullNames(value)
  }

  function _setAgency(value) {
    setAgency(value)
  }

  function _setAgencyWebsite(value) {
    setAgencyWebsite(value)
  }

  function _setAgencyPhone(value) {
    setAgencyPhone(value)
  }

  function _setRepeatPassword(value) {
    setRepeatPassword(value)
  }

  function toggleLanguage() {
    language === 'en' ? setLanguage('fr') : setLanguage('en')
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-auto bg-gray-50">
      <ToastContainer />

      {viewPort === 'login' && (
        <>
          <div className="mb-5 flex flex-row items-center space-x-5">
            {/* <div className="text-4xl font-bold text-zinc-800">Shabika App.</div> */}
            <div className="mb-4 mt-5 w-full px-6">
              <Image
                src={Logo}
                width={320}
                height={96}
                priority
                alt="icon"
                className="w-[220px]"
              />
            </div>
          </div>
          <Card size="sm" title={`${labels[`${language}`]?.login}`}>
            <div className="w-full">
              <form action="#">
                <div className="flex w-full flex-col items-start justify-start space-y-3">
                  {/* Login form */}
                  <TextInputLogin
                    label={`${labels[`${language}`]?.username}`}
                    value={email}
                    type="email"
                    setValue={_setEmail}
                  />
                  <TextInputLogin
                    label={`${labels[`${language}`]?.password}`}
                    value={password}
                    isPassword={true}
                    setValue={_setPassword}
                  />
                </div>
                {!submitting && (
                  <button
                    onClick={() => {
                      if (email.length < 1 || password.length < 1) {
                        toast.error(`${messages[`${language}`]?.checkInputs}`, {
                          position: 'top-center',
                          autoClose: 3000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        })
                      } else {
                        login()
                      }
                    }}
                    className="mt-5 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-primary p-3 shadow-md transition duration-75 ease-out hover:shadow-sm active:scale-95 active:shadow-sm"
                  >
                    {
                      <div className="text-black">{`${
                        labels[`${language}`]?.submit
                      }`}</div>
                    }
                  </button>
                )}
                {submitting && (
                  <div className="mt-5 flex w-full cursor-not-allowed items-center justify-center space-x-2 rounded-md bg-primary p-3 shadow-md transition duration-75 ease-out">
                    <Loader active inline size="small" />
                  </div>
                )}

                <div className="flex flex-row justify-between">
                  <button
                    className="hover:text-blue-cvl-500 mt-10 cursor-pointer p-1 text-center text-sm text-gray-400 hover:underline"
                    onClick={() => setViewPort('resetPassword')}
                  >
                    Reset password
                  </button>

                  <button
                    className="hover:text-blue-cvl-500 mt-10 cursor-pointer p-1 text-center text-sm text-gray-400 hover:underline"
                    onClick={
                      () => {}
                      // setViewPort('forgotPassword')
                    }
                  >
                    Forgot password
                  </button>
                </div>
              </form>
            </div>
          </Card>

          {/* <div className="mt-8 flex flex-row">
            <div className="mt-3 w-36 border-t-2 border-gray-200"></div>
            <div className="mx-4 text-gray-400">{`${
              labels[`${language}`]?.or
            }`}</div>
            <div className="mt-3 w-36 border-t-2 border-gray-200"></div>
          </div>

          <div className="sm:w-full md:w-1/5">
            <button
              type="submit"
              onClick={() => {
                setViewPort('signup')
              }}
              className="mt-3 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-blue-400 p-3 shadow-md transition duration-75 ease-out hover:shadow-sm active:scale-95 active:shadow-sm"
            >
             
              <div className="text-white">{`${
                labels[`${language}`]?.signup
              }`}</div>
            </button>
          </div> */}
        </>
      )}

      {viewPort === 'resetPassword' && (
        <>
          <div className="mb-5 flex flex-row items-center space-x-5">
            <div className="text-zinc-800 text-4xl font-bold">
              Reset Password
            </div>
          </div>
          <div className="sm:w-full md:w-1/5">
            <form action="#">
              <div className="flex w-full flex-col items-start justify-start space-y-3">
                {/* Login form */}

                <TextInputLogin
                  label={`${labels[`${language}`]?.username}`}
                  value={email}
                  type="email"
                  setValue={_setEmail}
                />
                <TextInputLogin
                  label={`${labels[`${language}`]?.password}`}
                  value={password}
                  isPassword={true}
                  setValue={setPassword}
                />
                <TextInputLogin
                  label={`${labels[`${language}`]?.newPassword}`}
                  value={newPassword}
                  isPassword={true}
                  setValue={setNewPassword}
                />
                <TextInputLogin
                  label={`${labels[`${language}`]?.repeatPassword}`}
                  value={repeatPassword}
                  isPassword={true}
                  setValue={setRepeatPassword}
                />
              </div>
              {!submitting && (
                <button
                  onClick={() => {
                    if (
                      email.length < 1 ||
                      password.length < 1 ||
                      newPassword !== repeatPassword
                    ) {
                      toast.error(`${messages[`${language}`]?.checkInputs}`, {
                        position: 'top-center',
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                    } else {
                      resetPassword()
                    }
                  }}
                  className="mt-5 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-primary p-3 shadow-md transition duration-75 ease-out hover:shadow-sm active:scale-95 active:shadow-sm"
                >
                  ===
                  {
                    <div className="text-white">{`${
                      labels[`${language}`]?.submit
                    }`}</div>
                  }
                </button>
              )}
              {submitting && (
                <div className="bg-zinc-100 mt-5 flex w-full cursor-not-allowed items-center justify-center space-x-2 rounded-md p-3 shadow-md transition duration-75 ease-out">
                  <Loader active inline size="small" />
                </div>
              )}

              <div className="flex flex-row justify-between">
                <button
                  className="hover:text-blue-cvl-500 mt-10 cursor-pointer p-1 text-center text-sm text-gray-400 hover:underline"
                  onClick={() => setViewPort('login')}
                >
                  Login instead
                </button>

                <button
                  className="hover:text-blue-cvl-500 mt-10 cursor-pointer p-1 text-center text-sm text-gray-400 hover:underline"
                  onClick={
                    () => {}
                    // setViewPort('forgotPassword')
                  }
                >
                  Forgot password
                </button>
              </div>
            </form>
          </div>

          {/* <div className="mt-8 flex flex-row">
            <div className="mt-3 w-36 border-t-2 border-gray-200"></div>
            <div className="mx-4 text-gray-400">{`${
              labels[`${language}`]?.or
            }`}</div>
            <div className="mt-3 w-36 border-t-2 border-gray-200"></div>
          </div>

          <div className="sm:w-full md:w-1/5">
            <button
              type="submit"
              onClick={() => {
                setViewPort('signup')
              }}
              className="mt-3 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-blue-400 p-3 shadow-md transition duration-75 ease-out hover:shadow-sm active:scale-95 active:shadow-sm"
            >
             
              <div className="text-white">{`${
                labels[`${language}`]?.signup
              }`}</div>
            </button>
          </div> */}
        </>
      )}

      {/* {viewPort === 'signup' && (
        <div className="pt-14">
          <div className="mb-5 flex flex-row items-center space-x-5">
            <div className="text-4xl font-bold text-zinc-800">
              Shabika App.
            </div>
            <div
              className="mt-1 cursor-pointer text-lg font-semibold text-blue-400"
              onClick={() => toggleLanguage()}
            >
              {language}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <form action="#">
              <div className="flex flex-col justify-start">
                <h1 className="text-xl text-gray-600">{`${
                  labels[`${language}`]?.signup
                }`}</h1>
                

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <MTextView
                      content={`${labels[`${language}`]?.accountType}`}
                    />
                    <Dropdown
                      className="mb-3 mt-1"
                      selection
                      placeholder={`${
                        placeholders[`${language}`]?.selectAccountType
                      }`}
                      options={[
                        {
                          text: `${labels[`${language}`]?.operator}`,
                          key: 'O',
                          value: 'Operator',
                        },
                        {
                          text: `${labels[`${language}`]?.flightSupport}`,
                          key: 'F',
                          value: 'Flight Support',
                        },
                      ]}
                      onChange={(e, data) => {
                        setAccountType(data)
                      }}
                    />
                    <TextInput
                      label={`${labels[`${language}`]?.fullNames}`}
                      value={fullNames}
                      setValue={_setFullNames}
                      isRequired={true}
                    />
                    <TextInput
                      label={`${labels[`${language}`]?.email}`}
                      value={email}
                      setValue={_setEmail}
                      isRequired={true}
                    />

                    <TextInput
                      label={`${labels[`${language}`]?.password}`}
                      value={password}
                      isPassword={true}
                      setValue={_setPassword}
                      isRequired={true}
                    />
                    <TextInput
                      label={`${labels[`${language}`]?.repeatPassword}`}
                      value={repeatPassword}
                      isPassword={true}
                      setValue={_setRepeatPassword}
                      isRequired={true}
                    />
                  </div>

                  <div>
                    <TextInput
                      label={`${labels[`${language}`]?.agency}`}
                      value={agency}
                      setValue={_setAgency}
                    />
                    <TextInput
                      label={`${labels[`${language}`]?.agencyWebsite}`}
                      value={agencyWebsite}
                      setValue={_setAgencyWebsite}
                    />

                    <TextInput
                      label={`${labels[`${language}`]?.agencyEmail}`}
                      value={agencyEmail}
                      type="email"
                      setValue={_setAgencyEmail}
                    />

                    <TextInput
                      label={`${labels[`${language}`]?.agencyPhone}`}
                      value={agencyPhone}
                      type="telephone"
                      setValue={_setAgencyPhone}
                    />

                    <MTextView
                      content={`${labels[`${language}`]?.agencyCountry}`}
                    />
                    <Dropdown
                      className="mb-3 mt-1"
                      selection
                      search
                      placeholder={`${
                        placeholders[`${language}`]?.selectCountry
                      }`}
                      options={countries.map((country) => {
                        return {
                          text: country.name,
                          description: country.code,
                          key: country.code,
                          value: country.code,
                        }
                      })}
                      onChange={(e, data) => {
                        setCountry(data.value)
                      }}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                onClick={() => signup()}
                className="mt-3 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-zinc-800 p-3 shadow-md transition duration-75 ease-out hover:shadow-sm active:scale-95 active:shadow-sm"
              >
               
                <div className="text-white">{`${
                  labels[`${language}`]?.submit
                }`}</div>
              </button>
            </form>
            <div className="mt-8 flex flex-row">
              <div className="mt-3 w-36 border-t-2 border-gray-200"></div>
              <div className="mx-4 text-gray-400">{`${
                labels[`${language}`]?.or
              }`}</div>
              <div className="mt-3 w-36 border-t-2 border-gray-200"></div>
            </div>
          </div>

          <div className="">
            <button
              type="submit"
              onClick={() => {
                setViewPort('login')
              }}
              className="mt-3 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-blue-400 p-3 shadow-md transition duration-75 ease-out hover:shadow-sm active:scale-95 active:shadow-sm"
            >
             
              <div className="text-white">{`${
                labels[`${language}`]?.login
              }`}</div>
            </button>
          </div>
        </div>
      )} */}
    </div>
  )
}
