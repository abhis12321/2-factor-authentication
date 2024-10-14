import axios from "axios"
import { useAuth } from "./AuthProvider"
import { useState } from "react";
import OTPform from "./OTPform";

export default function UserLoginForm() {
  const { setUser } = useAuth();
  const [TFA, setTFA] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();
    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    if (TFA) payload.code = e.target.code.value;

    axios.put("/api/user", payload)
      .then(res => res.data)
      .then(data => {
        if (data.TFA) {
          setTFA(true)
        } else {
          setUser(data.user);
          alert(data.message);
        }
        console.log(data)
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
        TFA === 2 && <OTPform email={""} />
      }

      <input type="email" name="email" placeholder="enter your email" className={`w-full ring-1 p-2 rounded text-center outline-none bg-violet-100/40 focus:bg-violet-100 ${TFA && "hidden"}`} required />
      <input type="password" name="password" placeholder="enter your password" className={`w-full ring-1 p-2 rounded text-center outline-none bg-violet-100/40 focus:bg-violet-100 ${TFA && "hidden"}`} required />
      <input type="submit" value={TFA ? "verify" : "login"} className={`w-full ring-1 p-2 rounded text-center outline-none ${TFA ? "bg-sky-700 hover:bg-sky-600 active:bg-green-600" : "bg-red-700 hover:bg-red-600 active:bg-orange-600"} font-semibold text-white cursor-pointer`} />
    </form>
  )
}
