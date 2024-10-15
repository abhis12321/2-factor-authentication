import axios from "axios";
import { useEffect, useState } from "react"
import { useAuth } from "./AuthProvider";

export default function TfaForm() {
    const { user , setUser } = useAuth()
    const [qrcode, setQrcode] = useState(user?.tfa?.qrcode);

    useEffect(() => {
        if(!qrcode)
        axios.get(`/api/tfa/${user._id}`)
            .then(res => res.data)
            .then(data => data.image)
            .then(image => setQrcode(image))
            .catch(error => console.error(error));
    }, []);

    const handleTFAform = (e) => {
        e.preventDefault();
        const payload = {
            code:e.target.code.value,
        }
        axios.post(`/api/tfa/${user._id}` , payload)
            .then(res => res.data)
            .then(data => {
                if(data.user) {
                    setUser(data.user)
                }
                 alert(data.message)
                })
            .catch(error => alert(error.message));
    }
    return (
        <form className="flex flex-col items-center justify-center gap-1" onSubmit={handleTFAform}>
            <img src={qrcode} alt="loading.." className="h-[120px] w-[120px] rounded shadow-[0_0_1.5px_black]" />
            <input type="text" name="code" placeholder="code" className="w-[120px] py-1 text-center font-semibold rounded ring-1 outline-none bg-gray-100 focus:bg-violet-100" />
            <input type="submit" value="verify" className="w-[120px] py-1 text-center font-bold rounded ring-1 outline-none bg-sky-700 hover:bg-sky-600 active:bg-blue-600 text-white cursor-pointer"/>            
        </form>
    )
}
