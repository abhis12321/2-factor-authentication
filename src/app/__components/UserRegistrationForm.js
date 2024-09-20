import axios from "axios"

export default function UserRegistrationForm() {
    const handleUserRegistration = (e) => {
        e.preventDefault();
        const payload = {
            name:e.target.name.value,
            email:e.target.email.value,
            password:e.target.password.value,
        }
        
        axios.post("/api/user" , payload)
            .then(res => res.data)
            .then(data => alert(data.message))
            .catch(error => console.error(error));
    }

  return (
    <form className='w-full max-w-[440px] mx-auto p-4 flex flex-col items-center justify-center gap-[6px] bg-white' onSubmit={handleUserRegistration}>
      <input type="text" name="name" placeholder="enter your name" className="w-full ring-1 p-2 rounded text-center outline-none bg-violet-100/40 focus:bg-violet-100" required/>
      <input type="email" name="email" placeholder="enter your email" className="w-full ring-1 p-2 rounded text-center outline-none bg-violet-100/40 focus:bg-violet-100" required/>
      <input type="password" name="password" placeholder="enter your password" className="w-full ring-1 p-2 rounded text-center outline-none bg-violet-100/40 focus:bg-violet-100" required/>
      <input type="submit" value="register" className="w-full ring-1 p-2 rounded text-center outline-none bg-red-700 hover:bg-red-600 active:bg-orange-600 font-semibold text-white cursor-pointer" />
    </form>
  )
}
