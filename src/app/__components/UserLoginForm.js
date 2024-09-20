"use client"
import axios from "axios";
import { useAuth } from "./AuthProvider";

export default function UserLoginForm() {
  const { setUser } = useAuth();
  
  const handleLogin = (e) => {
    e.preventDefault();
    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    axios.put("/api/user", payload)
      .then(res => res.data)
      .then(data => {
        alert(data.message);
        setUser(data.user);
      })
  }

  return (
    <form className='w-full max-w-[440px] mx-auto p-4 flex flex-col items-center justify-center gap-1 bg-white rounded-md shadow-[0_0_2px_gray]' onSubmit={handleLogin}>
      <input type="email" name="email" placeholder="enter your email" className="w-full ring-1 p-2 rounded text-center outline-none focus:bg-violet-100" />
      <input type="password" name="password" placeholder="enter your password" className="w-full ring-1 p-2 rounded text-center outline-none focus:bg-violet-100" />
      <input type="submit" value="login" className="w-full ring-1 p-2 rounded text-center outline-none bg-red-700 hover:bg-red-600 active:bg-orange-600 font-semibold text-white cursor-pointer" />
    </form>
  )
}
