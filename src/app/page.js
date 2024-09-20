"use client"
import { useState } from 'react'
import UserProfile from './__components/UserProfile'
import { useAuth } from './__components/AuthProvider'
import UserLoginForm from './__components/UserLoginForm'
import UserRegistrationForm from './__components/UserRegistrationForm'

export default function page() {
  const { user } = useAuth();
  const [option, setOption] = useState(1);
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      {
        user ?
          <UserProfile user={user} />
          :
          <div className='w-full max-w-[500px] min-h-[280px] flex flex-col gap-2 bg-white rounded-md overflow-hidden shadow-[0_0_2px_gray]'>
            <div className="flex font-bold items-center justify-around">
              <div className={`px-4 py-[10px] text-center cursor-pointer ${option == 0 ? "border-b-[2.5px] border-orange-600 text-orange-600" : "text-gray-600"}`} onClick={() => setOption(0)}>register</div>
              <div className={`px-4 py-[10px] text-center cursor-pointer ${option == 1 ? "border-b-[2.5px] border-orange-600 text-orange-600" : "text-gray-600"}`} onClick={() => setOption(1)}>login</div>
            </div>
            <div className="flex">
              {
                option == 1 ?
                  <UserLoginForm />
                  :
                  <UserRegistrationForm />}
            </div>
          </div>
      }
    </div>
  )
}
