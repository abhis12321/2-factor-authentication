import axios from "axios"
import { useAuth } from "./AuthProvider"
import { useState } from "react";

export default function UserLoginForm() {
  const { setUser } = useAuth();
  const [TFA , setTFA] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    if(TFA)   payload.TFA = TFA;
    
    axios.put("/api/user", payload)
      .then(res => res.data)
      .then(data => {
        if(data.TFA) {
          setTFA(true)
        } else {
          alert(data.message);
          setUser(data.user);
        }
      })
  }

  return (
    <form className='w-full max-w-[440px] mx-auto p-4 flex flex-col items-center justify-center gap-1 bg-white' onSubmit={handleLogin}>
      <input type="email" name="email" placeholder="enter your email" className="w-full ring-1 p-2 rounded text-center outline-none focus:bg-violet-100" required/>
      <input type="password" name="password" placeholder="enter your password" className="w-full ring-1 p-2 rounded text-center outline-none focus:bg-violet-100" required/>

      {
        TFA && <>
        <input type="text" name="code" placeholder="code" className="w-full ring-1 p-2 rounded text-center outline-none focus:bg-violet-100" required/>
        </>
      }

      <input type="submit" value={TFA ? "verify" : "login"} className="w-full ring-1 p-2 rounded text-center outline-none bg-red-700 hover:bg-red-600 active:bg-orange-600 font-semibold text-white cursor-pointer" />
    </form>
  )
}
