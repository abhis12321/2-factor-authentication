import axios from "axios"
import { useAuth } from "./AuthProvider"
import { useState } from "react"


export default function UserLoginForm() {
  const { setUser } = useAuth();
  const [TFA, setTFA] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();
    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    if (TFA == 1) {
      loginWithMFA({ ...payload, code:e.target.code.value });
    } else if (TFA == 2) {
      loginWithOTP({ ...payload, otp:e.target.otp.value });
    } else {
      verifyUser(payload);
    }
  }


  const verifyUser = (payload) => {
    axios.put("/api/user", payload)
      .then(res => res.data)
      .then(data => {
        if (data.success) {
          setTFA(data.TFA);
        }
        alert(data.message);
      })
      .catch(error => alert(`error : ${error.message}`))
  }

  const loginWithOTP = (payload) => {
    axios.put("/api/user/OTP", payload)
      .then(res => res.data)
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
        alert(data.message);
      })
      .catch(error => alert(`error : ${error.message}`))
  }
  const loginWithMFA = (payload) => {
    axios.put("/api/user/MFA", payload)
      .then(res => res.data)
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
        alert(data.message);
      })
      .catch(error => alert(`error : ${error.message}`))
  }



  return (
    <form className='w-full max-w-[440px] mx-auto p-4 flex flex-col items-center justify-center gap-[6px] bg-white' onSubmit={handleLogin}>
      {
        TFA === 1 ?
          <>
            <div className="w-full p-2 rounded text-center outline-none bg-green-50 whitespace-pre-line backdrop-blur-md font-bold text-green-600"> 2 factor authentication is required to login into this account, open your authenticator app and enter the otp..</div>
            <input type="text" name="code" placeholder="OTP" className="w-full ring-1 p-2 rounded text-center outline-none bg-violet-100/40 focus:bg-violet-100" required />
          </>
          :
          TFA === 2 && <>
            <div className="w-full p-2 rounded text-center outline-none bg-green-50 whitespace-pre-line backdrop-blur-md font-bold text-green-600"> Enter the OTP sent to your email..</div>
            <input type="text" name='otp' placeholder='OTP' className='w-[120px] py-1 text-center font-semibold rounded ring-1 outline-none bg-gray-100 focus:bg-violet-100"' />
          </>
      }

      <input type="email" name="email" placeholder="enter your email" className={`w-full ring-1 p-2 rounded text-center outline-none bg-violet-100/40 focus:bg-violet-100 ${TFA && "hidden"}`} required />
      <input type="password" name="password" placeholder="enter your password" className={`w-full ring-1 p-2 rounded text-center outline-none bg-violet-100/40 focus:bg-violet-100 ${TFA && "hidden"}`} required />
      <input type="submit" value={TFA ? "verify" : "login"} className={`w-full ring-1 p-2 rounded text-center outline-none ${TFA ? "bg-sky-700 hover:bg-sky-600 active:bg-green-600" : "bg-red-700 hover:bg-red-600 active:bg-orange-600"} font-semibold text-white cursor-pointer`} />
    </form>
  )
}
