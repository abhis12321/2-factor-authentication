import { useState } from 'react'
import TfaForm from './TfaForm';
import { useAuth } from './AuthProvider';

export default function UserProfile() {
  const { user , setUser } = useAuth();
  const [tfaForm, setTfaForm] = useState(false);
  return (
    <div className='w-full max-w-[600px] mx-auto p-4 rounded flex flex-col gap-1 items-center justify-center bg-white shadow-[0_0_2px_gray]'>
      <div className="text-red950 font-bold text-sm">{user.name}</div>
      <div className="font-mono tex-gray-600">{user.email}</div>
      <button className="text-xs font-semibold py-1 px-5 bg-red-700 hover:bg-red-600 active:bg-orange-500 text-white rounded" onClick={() => setUser(null)}>logout</button>
      <button className="w-fit min-w-[120px] py-1 px-3 text-center rounded bg-sky-700 hover:bg-sky-600 active:bg-blue-700 text-white font-semibold text-xs" onClick={() => setTfaForm(prev => !prev)}>{user.tfa.active ? "2-factor authentication is activated" : "TFA enable"} </button>

      {
        tfaForm && !user.tfa.active && <TfaForm user={user} />
      }
    </div>
  )
}
