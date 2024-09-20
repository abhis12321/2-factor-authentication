"use client"
import { createContext, useContext, useEffect, useState } from "react"
const authContext = createContext();


export default function AuthProvider({ children }) {
    const [user , setUser] = useState();

    const value = {
        user,
        setUser,
    };

    useEffect(() => {
      console.log(user)
    }, [user])

  return (
    <authContext.Provider value={value}>
      { children }
    </authContext.Provider>
  )
}


export const useAuth = () => useContext(authContext);