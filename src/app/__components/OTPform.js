import React from 'react'

export default function OTPform({ email }) {
    const verifyOTP = (e) => {
        e.preventDefault();
        const payload = {
            email,
            OTP:e.target.otp.value,
        }
        console.log(email);
    }

  return (
    <form className='flex flex-col items-center justify-center gap-1' onSubmit={verifyOTP}>
      <input type="text" name='otp' placeholder='OTP' className='w-[120px] py-1 text-center font-semibold rounded ring-1 outline-none bg-gray-100 focus:bg-violet-100"' />
      <input type="submit" value="verify" className="w-[120px] py-1 text-center font-bold rounded ring-1 outline-none bg-sky-700 hover:bg-sky-600 active:bg-blue-600 text-white cursor-pointer"/>
    </form>
  )
}
