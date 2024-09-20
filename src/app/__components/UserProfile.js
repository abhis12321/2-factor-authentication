import { useState } from 'react'
import TfaForm from './TfaForm';

export default function UserProfile({ user }) {
    const [tfaForm, setTfaForm] = useState(false);
  return (
    <div className='w-full max-w-[600px] mx-auto p-4 rounded flex flex-col gap-1 items-center justify-center bg-white shadow-[0_0_2px_gray]'>
      <div className="">{ user.name }</div>
      <div className="">{ user.email }</div>
      <button className="w-[120px] py-1 text-center rounded bg-sky-700 hover:bg-sky-600 active:bg-blue-700 text-white font-semibold" onClick={() => setTfaForm(prev => !prev)}>enable TFA</button>

      {
        tfaForm && <TfaForm  user={user}/>
      }
    </div>
  )
}
