"use client"
import UserProfile from './__components/UserProfile'
import { useAuth } from './__components/AuthProvider'
import UserLoginForm from './__components/UserLoginForm'
import UserRegistrationForm from './__components/UserRegistrationForm'

export default function page() {
  const { user } = useAuth();
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      {
        user ?
          <UserProfile user={user} />
          :
          <>
            <UserLoginForm />
            <UserRegistrationForm />
          </>
      }
    </div>
  )
}
