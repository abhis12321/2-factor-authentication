"use client"
import { createContext, useContext, useState } from "react"
const authContext = createContext();


export default function AuthProvider({ children, initialUserInfo }) {
    const [user , setUser] = useState(initialUserInfo);

    const value = {
        user,
        setUser,
    };

  return (
    <authContext.Provider value={value}>
      { children }
    </authContext.Provider>
  )
}


export const useAuth = () => useContext(authContext);