import React from 'react'
import LoginForm from './__components/LoginForm'
import UserRegistration from './__components/UserRegistration'

export default function page() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      {/* <LoginForm /> */}
      <UserRegistration />
    </div>
  )
}
