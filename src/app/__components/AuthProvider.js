"use client"
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"
const authContext = createContext();


export default function AuthProvider({ children }) {
    const [user , setUser] = useState();

    const value = {
        user,
        setUser,
    };

    useEffect(() => {
      axios.get("/api/user")
          .then(res => res.data)
          .then(data => data.user)
          // .then(userData => console.log(userData))
          .then(userData => setUser(userData))
          .catch(error => console.error(error));
    }, [])

  return (
    <authContext.Provider value={value}>
      { children }
    </authContext.Provider>
  )
}


export const useAuth = () => useContext(authContext);